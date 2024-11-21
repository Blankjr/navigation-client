import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import TetheringManager, { Network, Event, TetheringError } from '@react-native-tethering/wifi';
import ImageGallery from './ImageGallery';
import NavigationAudioGuide from '../audio/NavigationAudioGuide';
import WebViewer from './WebViewer';
import { Button } from 'react-native-paper';

export interface ImageItem {
  url: string;
  description: string;
}

interface RoutePoint {
  x: number;
  y: number;
  waypointId?: string;
}

interface Waypoint extends ImageItem {
  id: string;
}

interface NavigationResponse {
  start: {
    floor: number;
    room: number;
  };
  destination: {
    floor: number;
    room: number;
  };
  route: RoutePoint[];
  waypoints: Waypoint[];
}

interface PositionResponse {
  position: {
    x: number;
    y: number;
    floor: string;
    timestamp: number;
  };
  gridSquare: string;
  timestamp: number;
}

const API_URL = 'https://mqtt-hono-context-server-bridge-production.up.railway.app/';

const fetchGuideData = async (startFloor: string, startRoom: string, destFloor: string, destRoom: string): Promise<NavigationResponse> => {
  const response = await fetch(
    `${API_URL}guide?start_floor=${startFloor}&start_room=${startRoom}&destination_floor=${destFloor}&destination_room=${destRoom}`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchPositionData = async (): Promise<PositionResponse> => {
  const response = await fetch(`${API_URL}simulatedPosition/gridSquare/`);
  if (!response.ok) {
    throw new Error('Failed to fetch position data');
  }
  return response.json();
};

const Map = ({ floorNumber, roomNumber }) => {
  const [wifiInfo, setWifiInfo] = React.useState(null);
  const [isWebViewVisible, setIsWebViewVisible] = React.useState(false);
  const [lastScanTime, setLastScanTime] = React.useState(0);
  const [retryCount, setRetryCount] = React.useState(0);
  const [currentGridSquare, setCurrentGridSquare] = React.useState<string>('');
  const MAX_RETRIES = 3;
  const MIN_SCAN_INTERVAL = 30000; // 30 seconds minimum between scans

  // For now, we'll use the same floor/room numbers for both start and destination
  const { data, isLoading, error, refetch } = useQuery<NavigationResponse, Error>(
    ['guideData', floorNumber, roomNumber],
    () => fetchGuideData('1', '1', floorNumber, roomNumber), // Example start location
    {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      enabled: !!floorNumber && !!roomNumber,
    }
  );

  const { data: positionData } = useQuery<PositionResponse, Error>(
    'positionData',
    fetchPositionData,
    {
      refetchInterval: 5000, // Refetch every 5 seconds
      onSuccess: (data) => {
        setCurrentGridSquare(data.gridSquare);
      },
    }
  );
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Request permissions one at a time
        const fineLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs location permission to scan WiFi networks",
            buttonNegative: "DENY",
            buttonPositive: "ALLOW"
          }
        );

        const coarseLocation = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs location permission to scan WiFi networks",
            buttonNegative: "DENY",
            buttonPositive: "ALLOW"
          }
        );
        
        const isGranted = fineLocation === PermissionsAndroid.RESULTS.GRANTED &&
                         coarseLocation === PermissionsAndroid.RESULTS.GRANTED;
        
        console.log("Permission status:", { fineLocation, coarseLocation });
        
        if (isGranted) {
          console.log("WiFi permissions granted");
          return true;
        } else {
          console.log("Location permission denied");
          return false;
        }
      } catch (err) {
        console.warn("Permission request error:", err);
        return false;
      }
    }
    return true;
  };

  const scanWifi = async () => {
    const currentTime = Date.now();
    if (currentTime - lastScanTime < MIN_SCAN_INTERVAL) {
      console.log("Skipping scan due to rate limiting", {
        timeSinceLastScan: currentTime - lastScanTime,
        minInterval: MIN_SCAN_INTERVAL
      });
      return;
    }

    try {
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) return;

      // Check if WiFi is enabled
      const isEnabled = await TetheringManager.isWifiEnabled();
      if (!isEnabled) {
        console.log("WiFi is not enabled, enabling...");
        await TetheringManager.setWifiEnabled();
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for WiFi to initialize
      }

      try {
        console.log("Starting WiFi scan...");
        const networks = await TetheringManager.getWifiNetworks(true);
        console.log(`Successfully scanned ${networks.length} networks`);
        
        // Reset retry count on successful scan
        setRetryCount(0);
        setLastScanTime(currentTime);

        // Print network information
        console.log("\n=== Available Networks ===");
        networks.forEach((network, index) => {
          console.log(`
Network ${index + 1}:
  SSID: ${network.ssid}
  Signal: ${network.level} dBm
  Frequency: ${network.frequency} MHz
  Security: ${network.capabilities}
  BSSID: ${network.bssid}
          `);
        });

        // Update connected network info
        const isConnected = await TetheringManager.isDeviceAlreadyConnected();
        if (isConnected) {
          const ip = await TetheringManager.getDeviceIP();
          const connectedNetwork = networks[0];
          
          setWifiInfo({
            ssid: connectedNetwork?.ssid || '',
            bssid: connectedNetwork?.bssid || '',
            strength: connectedNetwork?.level || 0,
            frequency: connectedNetwork?.frequency || 0,
            ip
          });
        }

      } catch (scanError) {
        console.warn("Scan error:", scanError);
        
        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
          const nextRetry = retryCount + 1;
          setRetryCount(nextRetry);
          console.log(`Retry attempt ${nextRetry}/${MAX_RETRIES} in 5 seconds...`);
          setTimeout(() => scanWifi(), 5000);
        } else {
          console.log("Max retries reached, waiting for next scheduled scan");
          setRetryCount(0);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  React.useEffect(() => {
    // Initial scan with delay
    const initialScanTimeout = setTimeout(() => {
      scanWifi();
    }, 2000);

    // Set up periodic scanning with a longer interval
    const intervalId = setInterval(() => {
      scanWifi();
    }, MIN_SCAN_INTERVAL);

    return () => {
      clearTimeout(initialScanTimeout);
      clearInterval(intervalId);
    };
  }, []);

  const getFloorLabel = (floor) => {
    switch (floor) {
      case '0': return 'EG';
      case '1': return '1. OG';
      case '2': return '2. OG';
      case '3': return '3. OG';
      default: return `${floor}. OG`;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text>{error.message}</Text>
        <Button onPress={() => refetch()}>Retry</Button>
      </View>
    );
  }

  // Get only waypoints that are referenced in the route
  const relevantWaypoints = data?.waypoints.filter(waypoint => 
    data.route.some(point => point.waypointId === waypoint.id)
  ) || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.locationHeader}>
          <View style={styles.destinationInfo}>
            <Text style={styles.title}>Aktuelles Ziel:</Text>
            <Text style={styles.roomInfo}>
              {getFloorLabel(data?.destination.floor.toString() || '')}, 
              Raum: {data?.destination.room}
            </Text>
            <Text style={styles.startInfo}>
              Start: {getFloorLabel(data?.start.floor.toString() || '')}, 
              Raum: {data?.start.room}
            </Text>
          </View>
          <View style={styles.currentPosition}>
            <Text style={styles.subtitle}>Aktuelle Position:</Text>
            <Text style={styles.gridSquare}>{currentGridSquare || 'Wird ermittelt...'}</Text>
          </View>
        </View>
      </View>
      {data && (
        <>
          <ImageGallery images={relevantWaypoints} />
          <NavigationAudioGuide images={relevantWaypoints}/>
        </>
      )}
      <Button 
        icon="web" 
        mode="contained" 
        onPress={() => setIsWebViewVisible(true)}
      >
        Ziel Informationen
      </Button>
      <WebViewer 
        isVisible={isWebViewVisible}
        onClose={() => setIsWebViewVisible(false)}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
  },
  content: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomInfo: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  wifiInfo: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startInfo: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },

  //currentLocation
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  currentPosition: {
    flex: 1,
    marginRight: 16,
  },
  destinationInfo: {
    flex: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gridSquare: {
    fontSize: 18,
    color: '#444',
  },
});

export default Map;