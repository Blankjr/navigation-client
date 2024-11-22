import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import ImageGallery from './ImageGallery';
import NavigationAudioGuide from '../audio/NavigationAudioGuide';
import WebViewer from './WebViewer';
import { Button } from 'react-native-paper';

interface MapProps {
  destinationRoom: string; // This can be either a room number or a location name
}

const API_URL = 'https://mqtt-hono-context-server-bridge-production.up.railway.app/';

const fetchGuideData = async (startGridSquare: string, destinationRoom: string) => {
  const response = await fetch(
    `${API_URL}guide?start_gridsquare=${startGridSquare}&destination_room=${destinationRoom}&mode=visual`
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchPositionData = async () => {
  const response = await fetch(`${API_URL}simulatedPosition/gridSquare/`);
  if (!response.ok) {
    throw new Error('Failed to fetch position data');
  }
  return response.json();
};

const Map: React.FC<MapProps> = ({ destinationRoom }) => {
  const [isWebViewVisible, setIsWebViewVisible] = React.useState(false);
  const [currentGridSquare, setCurrentGridSquare] = React.useState<string>('');

  // Get current position with grid square
  const { data: positionData } = useQuery(
    'positionData',
    fetchPositionData,
    {
      refetchInterval: 5000,
      onSuccess: (data) => {
        setCurrentGridSquare(data.gridSquare);
      },
    }
  );

  // Fetch guide data using current grid square and destination
  const { data: guideData, isLoading, error, refetch } = useQuery(
    ['guideData', currentGridSquare, destinationRoom],
    () => fetchGuideData(currentGridSquare, destinationRoom),
    {
      enabled: !!currentGridSquare && !!destinationRoom,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );

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

  const relevantWaypoints = guideData?.waypoints.filter(waypoint => 
    guideData.route.some(point => point.waypointId === waypoint.id)
  ) || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.locationHeader}>
          <View style={styles.destinationInfo}>
            <Text style={styles.title}>Destination:</Text>
            <Text style={styles.roomInfo}>
              {destinationRoom}
            </Text>
          </View>
          <View style={styles.currentPosition}>
            <Text style={styles.subtitle}>Current Position:</Text>
            <Text style={styles.gridSquare}>{currentGridSquare || 'Determining...'}</Text>
          </View>
        </View>
      </View>

      {guideData && (
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
        Destination Information
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