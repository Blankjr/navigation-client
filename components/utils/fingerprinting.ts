import TetheringManager from '@react-native-tethering/wifi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, PermissionsAndroid, ToastAndroid } from 'react-native';

interface WifiSample {
  ssid: string;
  rssi: number;
  bssid: string;
  frequency: number;
  channel?: number;
  security?: string;
  hidden?: boolean;
  band?: string;
}

interface Position {
  x: number;
  y: number;
  floor: string;
}

interface Location {
  position_px: Position;
  floor: string;
  building: string;
  gridSquare: string;
}

interface Scan {
  id: string;
  timestamp: number;
  location: Location;
  samples: WifiSample[];
}

interface Fingerprint {
  position: Position;
  gridSquare: string;
  samples: WifiSample[];
}

interface FingerprintDatabase {
  fingerprints: Fingerprint[];
  lastUpdated: number;
}

const STORAGE_KEY = '@fingerprint_db';
const API_URL = 'https://mqtt-hono-context-server-bridge-production.up.railway.app/fingerprints';

const DEFAULT_POSITION = {
  gridSquare: '04.0.H3-P7',
  position: {
    x: 577,
    y: 498,
    floor: '0',
    timestamp: Date.now()
  },
  timestamp: Date.now()
};

function mergeFingerprints(scans: Scan[]): Fingerprint[] {
  // Group scans by gridSquare
  const gridSquareMap = new Map<string, {
    position: Position,
    samples: Map<string, WifiSample[]>
  }>();

  for (const scan of scans) {
    const gridSquare = scan.location.gridSquare;
    const position = {
      x: scan.location.position_px.x,
      y: scan.location.position_px.y,
      floor: scan.location.floor.replace('Etage ', '')
    };

    if (!gridSquareMap.has(gridSquare)) {
      gridSquareMap.set(gridSquare, {
        position,
        samples: new Map()
      });
    }

    // Group samples by BSSID
    const gridSquareData = gridSquareMap.get(gridSquare)!;
    for (const sample of scan.samples) {
      if (!gridSquareData.samples.has(sample.bssid)) {
        gridSquareData.samples.set(sample.bssid, []);
      }
      gridSquareData.samples.get(sample.bssid)!.push(sample);
    }
  }

  // Convert grouped data to fingerprints
  return Array.from(gridSquareMap.entries()).map(([gridSquare, data]) => {
    // Average RSSI values for each BSSID
    const mergedSamples = Array.from(data.samples.entries()).map(([bssid, samples]) => {
      const avgRssi = samples.reduce((sum, s) => sum + s.rssi, 0) / samples.length;
      return {
        ...samples[0], // Keep other properties from first sample
        rssi: Math.round(avgRssi)
      };
    });

    return {
      position: data.position,
      gridSquare,
      samples: mergedSamples
    };
  });
}

export async function updateFingerprintDatabase(): Promise<void> {
  try {
    console.log('Fetching fingerprint data from API...');
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch fingerprints');
    
    const data = await response.json();
    console.log('Received data structure:', JSON.stringify(data).slice(0, 200) + '...');
    
    if (!data.scans || !Array.isArray(data.scans)) {
      throw new Error('Invalid data format: expected scans array');
    }

    const fingerprints = mergeFingerprints(data.scans);
    
    const dbUpdate: FingerprintDatabase = {
      fingerprints,
      lastUpdated: Date.now()
    };
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dbUpdate));
    console.log(`Stored ${fingerprints.length} fingerprints`);
  } catch (error) {
    console.warn('Error updating fingerprint database:', error);
  }
}

async function getFingerprintDatabase(): Promise<FingerprintDatabase | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    return JSON.parse(stored);
  } catch (error) {
    console.warn('Error reading fingerprint database:', error);
    return null;
  }
}

async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    try {
      const fineLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs location permission for WiFi scanning",
          buttonNegative: "DENY",
          buttonPositive: "ALLOW"
        }
      );

      const coarseLocation = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Location Permission",
          message: "App needs location permission for WiFi scanning",
          buttonNegative: "DENY",
          buttonPositive: "ALLOW"
        }
      );

      return (
        fineLocation === PermissionsAndroid.RESULTS.GRANTED &&
        coarseLocation === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
  return true;
}

function calculateNetworkSimilarity(current: WifiSample[], reference: WifiSample[]): number {
    let matchScore = 0;
    let totalWeight = 0;

    // Create maps for faster lookup
    const currentMap = new Map(current.map(s => [s.bssid, s]));
    const referenceMap = new Map(reference.map(s => [s.bssid, s]));

    // Find common networks
    const commonBssids = new Set([...currentMap.keys()].filter(x => referenceMap.has(x)));

    if (commonBssids.size === 0) return 0;

    for (const bssid of commonBssids) {
        const currentSample = currentMap.get(bssid)!;
        const referenceSample = referenceMap.get(bssid)!;
        
        // Weight stronger signals more heavily
        const signalWeight = Math.pow(2, (100 + referenceSample.rssi) / 20);
        
        // Calculate similarity based on RSSI difference
        const rssiDiff = Math.abs(currentSample.rssi - referenceSample.rssi);
        const similarity = Math.max(0, 1 - (rssiDiff / 40)); // 40dBm difference = 0 similarity
        
        matchScore += similarity * signalWeight;
        totalWeight += signalWeight;
    }

    // Consider the number of matching networks vs total networks
    const coverageRatio = commonBssids.size / Math.max(current.length, reference.length);

    return (matchScore / totalWeight) * coverageRatio;
}

export async function getCurrentPosition(): Promise<{
    gridSquare: string;
    timestamp: number;
    position: {
      x: number;
      y: number;
      floor: string;
      timestamp: number;
    };
  }> {
    try {
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) {
        ToastAndroid.show('Location permissions are required for WiFi scanning', ToastAndroid.LONG);
        return DEFAULT_POSITION;
      }
  
      const isWifiEnabled = await TetheringManager.isWifiEnabled();
      if (!isWifiEnabled) {
        console.log('Enabling WiFi...');
        await TetheringManager.setWifiEnabled();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
  
      console.log('Starting network scan...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const networks = await TetheringManager.getWifiNetworks(true);
      console.log('Found networks:', networks);
  
      // Filter out networks with very weak signals
      const currentSamples: WifiSample[] = networks
        .filter(network => network.level > -85) // Ignore very weak signals
        .map(network => ({
          ssid: network.ssid,
          rssi: network.level,
          bssid: network.bssid,
          frequency: network.frequency
        }));
  
      const db = await getFingerprintDatabase();
      if (!db?.fingerprints?.length) {
        console.warn('No fingerprint database available');
        return DEFAULT_POSITION;
      }
  
      // Calculate similarity scores for each fingerprint
      const matches = db.fingerprints.map(fingerprint => ({
        fingerprint,
        similarity: calculateNetworkSimilarity(currentSamples, fingerprint.samples)
      }));
  
      // Sort by similarity score
      matches.sort((a, b) => b.similarity - a.similarity);
  
      console.log('Top matches:', matches.slice(0, 3).map(m => ({
        gridSquare: m.fingerprint.gridSquare,
        similarity: m.similarity,
        commonNetworks: currentSamples.filter(s => 
          m.fingerprint.samples.some(fs => fs.bssid === s.bssid)
        ).length
      })));
  
      // If best match has very low similarity, use default position
      if (matches[0].similarity < 0.3) {
        console.log('No good matches found, using default position');
        return DEFAULT_POSITION;
      }
  
      const bestMatch = matches[0].fingerprint;
      return {
        position: {
          x: bestMatch.position.x,
          y: bestMatch.position.y,
          floor: bestMatch.position.floor,
          timestamp: Date.now()
        },
        gridSquare: bestMatch.gridSquare,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Error in fingerprinting position calculation:', error);
      return DEFAULT_POSITION;
    }
  }