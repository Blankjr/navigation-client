import * as React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import ImageGallery from './ImageGallery';
import NavigationAudioGuide from '../audio/NavigationAudioGuide';
import WebViewer from './WebViewer';
import { Button } from 'react-native-paper';
import * as Speech from 'expo-speech';
import LineIndicator from './LineIndicator';
import SignInfo from './SignInfo';
import { findSignageByRoom, Location, locations, RoomSignage, SignColor } from '../../data/locations';
import { useAudioStore } from '@/stores/useAudioStore';
interface MapProps {
  selectedLocation: Location | null;
}
interface GuideData {
  lineDirections: {
    [key: string]: string[];
  };
  waypoints: any[];
  route: any[];
}

// const API_URL = 'http://192.168.1.109:3000';
const API_URL = 'https://mqtt-hono-context-server-bridge-production.up.railway.app'

const fetchPositionData = async () => {
  try {
    const url = `${API_URL}/simulatedPosition/gridSquare/`;
    console.log('Fetching from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error(`Failed to fetch position data: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const fetchInitialGuideData = async (startGridSquare: string, destinationRoom: string) => {
  try {
    destinationRoom = destinationRoom.replace(/\s+/g, '-');
    const url = `${API_URL}/guide/?start_gridsquare=${startGridSquare}&destination_room=${destinationRoom}&mode=visual`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Guide data error:', {
        status: response.status,
        statusText: response.statusText,
        responseText: errorText,
        url: url
      });
      throw new Error(`Guide data fetch failed: ${response.status}`);
    }
    
    const responseBody = await response.json();
    console.log("Guide data received:", responseBody);
    return responseBody;
  } catch (error) {
    console.error('Guide data fetch error:', error);
    // Log the parameters to help debug
    // console.log('Guide data parameters:', {
    //   startGridSquare,
    //   destinationRoom,
    //   fullUrl: `${API_URL}/guide/?start_gridsquare=${startGridSquare}&destination_room=${destinationRoom}&mode=visual`
    // });
    throw error;
  }
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


const Map: React.FC<MapProps> = ({ selectedLocation }) => {
  const [isWebViewVisible, setIsWebViewVisible] = React.useState(false);
  const [currentGridSquare, setCurrentGridSquare] = React.useState<string>('');
  const [initialGuideData, setInitialGuideData] = React.useState<GuideData | null>(null);
  const speechRate = useAudioStore((state) => state.speechRate);
  // Get destination room from selectedLocation
  const destinationRoom = selectedLocation?.room || selectedLocation?.name?.toLowerCase() || '';
  const lastDestinationRef = React.useRef(destinationRoom);

  const getEffectiveSignage = React.useMemo(() => {
    if (!selectedLocation) return undefined;

    // If the location already has signage, use it
    if (selectedLocation.signage) {
      return selectedLocation.signage;
    }

    // If we're searching by room number, try to find matching signage
    if (selectedLocation.room) {
      return findSignageByRoom(selectedLocation.room, locations);
    }

    return undefined;
  }, [selectedLocation]);

  // Reset guide data when destination changes
  React.useEffect(() => {
    if (destinationRoom !== lastDestinationRef.current) {
      setInitialGuideData(null);
      lastDestinationRef.current = destinationRoom;
    }
  }, [destinationRoom]);

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

  // Fetch guide data when position is available and we don't have guide data yet
  React.useEffect(() => {
    if (currentGridSquare && destinationRoom && !initialGuideData) {
      fetchInitialGuideData(currentGridSquare, destinationRoom)
        .then(data => {
          setInitialGuideData(data);
        })
        .catch(error => console.error('Failed to fetch guide data:', error));
    }
  }, [currentGridSquare, destinationRoom, initialGuideData]);

  // Initial speech when component mounts or destination changes
  React.useEffect(() => {
    if (destinationRoom) {
      const spokenRoom = formatRoomForSpeech(destinationRoom);
      Speech.speak(`Navigation zum Raum: ${spokenRoom}`, {
        language: 'de-DE',
        rate: speechRate
      });
    }
  }, [destinationRoom]);

  if (!currentGridSquare || !initialGuideData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const relevantWaypoints = initialGuideData?.waypoints.filter(waypoint => 
    initialGuideData.route.some(point => point.waypointId === waypoint.id)
  ) || [];

  let isSpeaking = false;
  return (
    <SafeAreaView style={styles.container}>
      <LineIndicator 
  currentGridSquare={currentGridSquare}
  lineDirections={initialGuideData?.lineDirections}
/>
      <View style={styles.content}>
      
        <View style={styles.DestinationHeader}>
          <View style={styles.destinationInfo}
          accessibilityRole="button"
          onTouchEnd={async () => {
            if (!isSpeaking) {
              isSpeaking = true;
              await Speech.speak(`Navigation zum Ziel: ${formatRoomForSpeech(destinationRoom)}`, {
                language: 'de-DE',
                rate: speechRate,
                onDone: () => { isSpeaking = false }
              });
            }
          }}>
            <Button
              icon="target"
              contentStyle={{ height: 80, alignItems: 'center' }}
              labelStyle={{
                fontSize: 40,
                fontWeight: 'bold',
                lineHeight: 80,
                color: 'black',
                textAlign: 'center',
              }}
            >
            {destinationRoom.split(' ')[0][0].toUpperCase() + destinationRoom.split(' ')[0].slice(1)}
            </Button>
          </View>
        </View>
      </View>

      {initialGuideData && (
  <>
    <ImageGallery 
            images={relevantWaypoints} 
            currentGridSquare={currentGridSquare} 
        />
    <View style={styles.controlsRow}>
      <View style={styles.controlHalf}>
        <SignInfo signage={getEffectiveSignage} />
      </View>
      <View style={styles.controlHalf}>
        <NavigationAudioGuide images={relevantWaypoints}/>
      </View>
    </View>
  </>
)}

      <Button 
        icon="web" 
        mode="contained"
        style={styles.WebViewerButton} 
        onPress={() => setIsWebViewVisible(true)}
      >
        Ziel Info
      </Button>

      <WebViewer 
  isVisible={isWebViewVisible}
  onClose={() => setIsWebViewVisible(false)}
  destinationRoom={destinationRoom}
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
  controlsRow: {
    flexDirection: 'row',
    height: 200,
    marginVertical: 8,
  },
  controlHalf: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    margin: 3,
  },
  WebViewerButton: {
    width: '100%',
    height: 65,
    justifyContent: 'center',
  }
});

export default Map;