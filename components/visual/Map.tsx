import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import ImageGallery from './ImageGallery';
import NavigationAudioGuide from '../audio/NavigationAudioGuide';
import WebViewer from './WebViewer';
import { Button } from 'react-native-paper';
import * as Speech from 'expo-speech';

interface MapProps {
  destinationRoom: string; // This can be either a room number or a location name
}

const API_URL = 'https://mqtt-hono-context-server-bridge-production.up.railway.app/';

const fetchGuideData = async (startGridSquare: string, destinationRoom: string) => {
  destinationRoom = destinationRoom.replace(/\s+/g, '-');
  const response = await fetch(
    `${API_URL}guide?start_gridsquare=${startGridSquare}&destination_room=${destinationRoom}&mode=visual`
  );
  if (!response.ok) {
    console.log(`${API_URL}guide?start_gridsquare=${startGridSquare}&destination_room=${destinationRoom}&mode=visual`);
    
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

const formatRoomForSpeech = (room: string): string => {
  if (/^\d/.test(room)) {
    const cleaned = room.replace(/[\s.]/g, '');
    return cleaned.split('').join(' ')
      .replace(/^0+/, '')
      .replace(/(\d+)\s?[A-Za-z]$/, '$1 $2');
  }
  return room;
};


const Map: React.FC<MapProps> = ({ destinationRoom }) => {
  React.useEffect(() => {
    if (destinationRoom) {
      const spokenRoom = formatRoomForSpeech(destinationRoom);
      Speech.speak(`Navigation zum Raum: ${spokenRoom}`, {
      language: 'de-DE',
      rate: 0.9
    });
    }
  }, [destinationRoom]);
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

  let isSpeaking = false;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.DestinationHeader}>
          <View style={styles.destinationInfo}
          accessibilityRole="button"
          onTouchEnd={async () => {
            if (!isSpeaking) {
              isSpeaking = true;
              await Speech.speak(`Navigation zum Ziel: ${formatRoomForSpeech(destinationRoom)}`, {
                language: 'de-DE',
                rate: 1,
                onDone: () => { isSpeaking = false }
              });
            }
          }}>
            <Button icon="target" contentStyle={{height: 80, alignItems: 'center'}}
    labelStyle={{fontSize: 40, fontWeight: 'bold', lineHeight: 80, color: 'black'}}>{destinationRoom}</Button>
          </View>
        </View>
      </View>

      {guideData && (
        <>
          <ImageGallery images={relevantWaypoints} />
          <NavigationAudioGuide images={relevantWaypoints}/>
        </>
      )}

<View style={styles.currentPosition}>
            <Text style={styles.subtitle}>Position:</Text>
            <Text style={styles.gridSquare}>{currentGridSquare || 'Determining...'}</Text>
          </View>

      <Button 
        icon="web" 
        mode="contained" 
        onPress={() => setIsWebViewVisible(true)}
      >
        Ziel Info
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
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomInfo: {
    fontSize: 40,
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
  DestinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  currentPosition: {
    marginLeft: 120
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