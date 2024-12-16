import React from 'react';
import { View, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { IconButton } from 'react-native-paper';

interface WebViewerProps {
  isVisible: boolean;
  onClose: () => void;
  destinationRoom: string;
}

// Define URL destinations and their corresponding rooms
const ROOM_DESTINATIONS = {
  'wissenschaftliche_Mitarbeiter': [
    '04.2.002',
    '04.2.004',
    '04.2.007',
    '04.2.008',
    '04.2.037'
  ],
  'labor': [
    '04.2.014',
    '04.2.015',
    '04.2.016'
  ],
  'seminarraum': [
    '04.2.017',
    '04.2.020'
  ],
  'sitzungsraum': [
    '04.2.025'
  ],
  'fachschaft': ['fachschaft'],
  'pc-pool': ['pc-pool',]
} as const;

// Create a lookup map for faster room resolution
const ROOM_LOOKUP = Object.entries(ROOM_DESTINATIONS).reduce((acc, [destination, rooms]) => {
  rooms.forEach(room => {
    acc[room] = destination;
  });
  return acc;
}, {} as { [key: string]: string });

const WebViewer: React.FC<WebViewerProps> = ({ isVisible, onClose, destinationRoom }) => {
  const getFormattedUrl = (room: string): string => {
    const baseUrl = 'https://www.freibewegen.info/rooms';
    
    // Check if room has a special mapping
    if (room in ROOM_LOOKUP) {
      return `${baseUrl}/${ROOM_LOOKUP[room]}`;
    }
    
    // Handle regular room numbers
    if (room.match(/^\d{2}\.\d\.\d{3}$/)) {
      return `${baseUrl}/${room}`;
    }
    
    // Clean the room string for other cases
    const cleanRoom = room.replace(/\s+/g, '-');
    return `${baseUrl}/${cleanRoom}`;
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <WebView
          style={styles.webview}
          source={{ uri: getFormattedUrl(destinationRoom) }}
        />
        <View style={styles.footer}>
          <IconButton
            icon="close"
            size={55}
            iconColor='#fffcfd'
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
  },
  footer: {
    height: 80,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  closeButton: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#ea333a',
  },
});

export default WebViewer;