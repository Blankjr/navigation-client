import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, PermissionsAndroid } from 'react-native';
import WifiManager from "react-native-wifi-reborn";

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Aktuelles Ziel:</Text>
        <Text style={styles.roomInfo}>Etage: {floorNumber}</Text>
        <Text style={styles.roomInfo}>Raum: {roomNumber}</Text>
        <Text style={styles.wifiInfo}>WiFi-Informationen werden alle 5 Sekunden gescannt und in der Konsole protokolliert.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomInfo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  wifiInfo: {
    marginTop: 10,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default Map;