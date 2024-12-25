import * as React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet, SafeAreaView, View, Text, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { Location } from '../../data/locations';
import EnhancedLocationSelector from './EnhancedLocationSelector';

interface SelectDestinationProps {
  onSearch: (location: Location) => void;
}

const SelectDestination: React.FC<SelectDestinationProps> = ({ onSearch }) => {
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);
  const [selectionTimestamp, setSelectionTimestamp] = React.useState<number>(0);
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  const calculateFontSize = (text: string) => {
    if (!text) return 32;
    if (text.length > 30) return 24;
    if (text.length > 20) return 28;
    return 32;
  };

  // Format display name to handle long professor names
  const formatDisplayName = (name: string) => {
    if (name === "Wissenschaftlicher Mitarbeiter") return "Mitarbeiter";
    if (name.startsWith("Professor ")) {
      const parts = name.split(" ");
      if (parts.length > 2) {
        return `Prof. ${parts[parts.length - 1]}`;
      }
    }
    return name;
  };

  const displayName = selectedLocation ? formatDisplayName(selectedLocation.name) : "";

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardAvoid}
    >
      <SafeAreaView style={styles.container}>
        <View style={[
          styles.selectionArea,
          keyboardVisible && styles.selectionAreaKeyboard
        ]}>
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
                  { fontSize: calculateFontSize(selectedLocation.name) }
                ]} numberOfLines={2} ellipsizeMode='tail'>
                  {displayName}
                </Text>
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

          <View style={styles.selectorContainer}>
            <EnhancedLocationSelector 
              onLocationSelect={handleLocationSelect} 
              forceUpdate={forceUpdate}
            />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  selectionArea: {
    flex: 1,
    padding: 20,
  },
  selectionAreaKeyboard: {
    paddingBottom: Platform.OS === 'ios' ? 80 : 20, // Additional padding when keyboard is visible
  },
  selectedLocation: {
    backgroundColor: '#E6F0FF',
    padding: 24,
    borderRadius: 12,
    marginBottom: 24,
    minHeight: 120,
    maxHeight: 160,
    borderWidth: 2,
    borderColor: '#0052CC',
  },
  selectedLocationEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedName: {
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
    marginVertical: 10,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32
  },
  selectorContainer: {
    flex: 1,
    minHeight: 200,
  }
});

export default SelectDestination;