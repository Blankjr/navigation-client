import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import SelectDestination from '@/components/userinput/SelectDestination';
import Map from '@/components/visual/Map';

export default function Index() {
  const [index, setIndex] = React.useState(0);
  const [floorNumber, setFloorNumber] = React.useState('');
  const [roomNumber, setRoomNumber] = React.useState('');

  const routes = [
    { key: 'selectDestination', title: 'Ziel wählen', unfocusedIcon: 'arrow-decision-outline', focusedIcon: 'arrow-decision' },
    { key: 'map', title: 'Karte', unfocusedIcon: 'map-legend', focusedIcon: 'map-search' },
  ];

  const handleSearch = (floor, room) => {
    setFloorNumber(floor);
    setRoomNumber(room);
    setIndex(1); // Switch to Map
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'selectDestination':
        return <SelectDestination onSearch={handleSearch} />;
      case 'map':
        return <Map floorNumber={floorNumber} roomNumber={roomNumber} />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor="#0052CC" // Darker blue for better visibility
      activeIndicatorStyle={{
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#0052CC', // Matching border color for consistency
      }}
      barStyle={{
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
      }}
    />
  );
}