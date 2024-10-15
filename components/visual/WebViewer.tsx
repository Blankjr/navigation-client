import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, SafeAreaView, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, IconButton } from 'react-native-paper';

interface WebViewerProps {
  isVisible: boolean;
  onClose: () => void;
}

const WebViewer: React.FC<WebViewerProps> = ({ isVisible, onClose }) => {
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
          source={{ uri: 'https://medien.hs-duesseldorf.de/wojciechowski' }}
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
}

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
    paddingBottom: 20, // Add extra padding at the bottom for better touch area
  },
  closeButton: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#ea333a',
  },
  closeButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WebViewer;