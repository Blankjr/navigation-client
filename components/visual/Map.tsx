import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, PermissionsAndroid, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import WifiManager from "react-native-wifi-reborn";
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

const API_URL = 'https://mqtt-hono-context-server-bridge-production.up.railway.app';

const fetchGuideData = async (startFloor: string, startRoom: string, destFloor: string, destRoom: string): Promise<NavigationResponse> => {
  const response = await fetch(
    `${API_URL}/guide?start_floor=${startFloor}&start_room=${startRoom}&destination_floor=${destFloor}&destination_room=${destRoom}`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Map = ({ floorNumber, roomNumber }) => {
  const [wifiInfo, setWifiInfo] = React.useState(null);
  const [isWebViewVisible, setIsWebViewVisible] = React.useState(false);

  // For now, we'll use the same floor/room numbers for both start and destination
  // You might want to add start location as props or determine it another way
  const { data, isLoading, error, refetch } = useQuery<NavigationResponse, Error>(
    ['guideData', floorNumber, roomNumber],
    () => fetchGuideData('1', '1', floorNumber, roomNumber), // Example start location
    {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      enabled: !!floorNumber && !!roomNumber,
    }
  );
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location permission is required for WiFi connections",
            message:
              "This app needs location permission as this is required " +
              "to scan for wifi networks.",
            buttonNegative: "DENY",
            buttonPositive: "ALLOW"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the WiFi");
          return true;
        } else {
          console.log("Location permission denied");
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const scanWifi = async () => {
    try {
      const permissionGranted = await requestLocationPermission();
      if (!permissionGranted) return;

      const ssid = await WifiManager.getCurrentWifiSSID();
      const bssid = await WifiManager.getBSSID();
      const strength = await WifiManager.getCurrentSignalStrength();
      const frequency = await WifiManager.getFrequency();
      const ip = await WifiManager.getIP();

      const newWifiInfo = {
        ssid,
        bssid,
        strength,
        frequency,
        ip
      };

      setWifiInfo(newWifiInfo);
      console.log("WiFi Info:", newWifiInfo);
    } catch (error) {
      console.error('Error scanning WiFi:', error);
    }
  };

  React.useEffect(() => {
    scanWifi(); // Initial scan

    const intervalId = setInterval(() => {
      scanWifi();
    }, 5000); // Scan every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
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
});

export default Map;