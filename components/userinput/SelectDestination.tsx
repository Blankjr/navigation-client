import * as React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import VoiceSelector from './VoiceSelector';
import { Location } from '../../data/locations';

interface SelectDestinationProps {
  onSearch: (destinationRoom: string) => void;
}

const SelectDestination: React.FC<SelectDestinationProps> = ({ onSearch }) => {
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    const destination = location.room || location.name.toLowerCase();
    onSearch(destination);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.selectionArea}>
        {selectedLocation && (
          <View style={styles.selectedLocation}>
            <Text style={styles.selectedName}>{selectedLocation.name}</Text>
            {selectedLocation.room && (
              <Text style={styles.selectedRoom}>Raum: {selectedLocation.room}</Text>
            )}
          </View>
        )}
        {selectedLocation && (
        <Button
          icon="map-marker-radius"
          mode="contained"
          onPress={() => handleLocationSelect(selectedLocation)}
          style={styles.confirmButton}
        >
          Zum Ziel
        </Button>
      )}
        <VoiceSelector onLocationSelect={handleLocationSelect} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  selectionArea: {
    flex: 1,
  },
  selectedLocation: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  selectedName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  selectedRoom: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  confirmButton: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default SelectDestination;