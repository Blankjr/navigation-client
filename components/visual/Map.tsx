import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, PermissionsAndroid } from 'react-native';
import WifiManager from "react-native-wifi-reborn";
import ImageGallery from './ImageGallery';
import NavigationAudioGuide from '../audio/NavigationAudioGuide';

interface ImageItem {
  url: string;
  description: string;
}

const Map = ({ floorNumber, roomNumber }) => {
  const [wifiInfo, setWifiInfo] = React.useState(null);

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

    // Sample array of image URLs
    const images: ImageItem[] = [
      {
        url: 'https://picsum.photos/seed/696/3000/2000',
        description: 'Eine malerische Aussicht auf eine Berglandschaft mit einem See im Vordergrund'
      },
      {
        url: 'https://picsum.photos/seed/697/3000/2000',
        description: 'Eine belebte Stadtstraße mit hohen Gebäuden und gehenden Menschen'
      },
      {
        url: 'https://picsum.photos/seed/698/3000/2000',
        description: 'Eine Nahaufnahme einer farbenfrohen Blume mit Tautropfen auf ihren Blütenblättern'
      },
      {
        url: 'https://picsum.photos/seed/699/3000/2000',
        description: 'Eine friedliche Strandszene mit weißem Sand und klarem blauen Wasser'
      },
      {
        url: 'https://picsum.photos/seed/700/3000/2000',
        description: 'Eine Luftaufnahme eines dichten Waldes mit verschiedenen Grüntönen'
      }
    ];
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Aktuelles Ziel:</Text>
        <Text style={styles.roomInfo}>{getFloorLabel(floorNumber)}, Raum: {roomNumber}</Text>
      </View>
      <View style={styles.middleContent}>
        <Text style={styles.wifiInfo}>WiFi-Informationen werden alle 5 Sekunden gescannt und in der Konsole protokolliert.</Text>
      </View>
      <ImageGallery images={images} />
      <NavigationAudioGuide/>
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
});

export default Map;