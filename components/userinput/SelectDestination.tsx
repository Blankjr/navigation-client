import * as React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, SafeAreaView, View, Text, Keyboard } from 'react-native';
import { Location } from '../../data/locations';
import EnhancedLocationSelector from './EnhancedLocationSelector';

interface SelectDestinationProps {
  onSearch: (location: Location) => void;
}

const SelectDestination: React.FC<SelectDestinationProps> = ({ onSearch }) => {
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [selectionTimestamp, setSelectionTimestamp] = React.useState<number>(0);

  const forceUpdate = React.useCallback(() => {
    setSelectionTimestamp(Date.now());
  }, []);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setSelectionTimestamp(Date.now());
    onSearch(location);
  };

  const handleConfirmPress = () => {
    if (selectedLocation) {
      Keyboard.dismiss();
      setSelectionTimestamp(Date.now());
      onSearch(selectedLocation);
    }
  };

  const calculateFontSize = (text: string, baseSize: number) => {
    return text.length > 20 ? baseSize - 4 : baseSize; // Adjust font size for longer text
  };

  const displayName = selectedLocation?.name === "Wissenschaftlicher Mitarbeiter"
  ? "Mitarbeiter"
  : selectedLocation?.name;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.selectionArea}>
        <View style={[
          styles.selectedLocation,
          !selectedLocation && styles.selectedLocationEmpty
        ]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={selectedLocation 
          ? `Ausgewähltes Ziel: ${selectedLocation.name}${selectedLocation.room ? `, Raum ${selectedLocation.room}` : ''}`
          : "Kein Ziel ausgewählt"
        }
        >
          {selectedLocation ? (
            <>
              <Text style={[
    styles.selectedName,
    { fontSize: calculateFontSize(selectedLocation.name, 32) },
  ]} numberOfLines={2} ellipsizeMode='tail'>{displayName}</Text>
              {selectedLocation.room && (
                <Text style={styles.selectedRoom}>Raum: {selectedLocation.room}</Text>
              )}
            </>
          ) : (
            <Text style={styles.placeholderText}>Kein Ziel ausgewählt</Text>
          )}
        </View>

        <Button
          icon="map-marker-radius"
          mode="contained"
          onPress={handleConfirmPress}
          style={styles.confirmButton}
          labelStyle={styles.buttonLabel}
          disabled={!selectedLocation}
          accessibilityLabel={selectedLocation 
            ? `Navigation zu ${selectedLocation.name} starten` 
            : "Navigation nicht möglich ohne ausgewähltes Ziel"
          }
        >
          Zum Ziel
        </Button>

        <EnhancedLocationSelector onLocationSelect={handleLocationSelect} forceUpdate={forceUpdate}/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  selectionArea: {
    flex: 1,
  },
  selectedLocation: {
    backgroundColor: '#E6F0FF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    minHeight: 120,
    borderWidth: 2,
    borderColor: '#0052CC',
  },
  selectedLocationEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#000000',
    flexWrap: 'wrap',
    lineHeight: 36,
  },
  selectedRoom: {
    fontSize: 24,
    color: '#000000',
    marginTop: 8,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 24,
    color: '#0052CC',
    fontWeight: '500',
  },
  confirmButton: {
    marginTop: 10,
    marginBottom: 10,
    opacity: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32
  },
});

export default SelectDestination;