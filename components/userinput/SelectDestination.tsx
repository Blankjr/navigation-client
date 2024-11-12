import * as React from 'react';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import { StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import VoiceSelector from './VoiceSelector';

const handleLocationSelect = (location) => {
  console.log('Selected location:', location);
  // Handle the selected location
};

const SelectDestination = ({ onSearch }) => {
  const [floorNumber, setFloorNumber] = React.useState('');
  const [roomNumber, setRoomNumber] = React.useState('');

  const handleSearch = () => {
    onSearch(floorNumber, roomNumber);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={floorNumber}
        onValueChange={setFloorNumber}
        buttons={[
          { value: '0', label: 'EG' },
          { value: '1', label: '1 OG' },
          { value: '2', label: '2 OG' },
          { value: '3', label: '3 OG' },
        ]}
        style={styles.segmentedButtons}
      />
      <TextInput
        placeholder={'Raum-Nummer'}
        keyboardType="numeric"
        mode='outlined'
        style={styles.roomInput}
        value={roomNumber}
        onChangeText={setRoomNumber}
      />
      <Button
        icon="airplane-search"
        mode="contained"
        onPress={handleSearch}
      >
        Ziel wählen
      </Button>
      <VoiceSelector onLocationSelect={handleLocationSelect} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  roomInput: {
    width: '100%',
    marginBottom: 20,
  },
});

export default SelectDestination;