import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import SelectDestination from '@/components/userinput/SelectDestination';
import Map from '@/components/visual/Map';
import Settings from '@/components/settings/Settings';
import { Keyboard, LogBox } from 'react-native';
import { Location } from '@/data/locations';


LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.'
]);

export default function Index() {
  const [index, setIndex] = React.useState(0);
  const [selectedLocation, setSelectedLocation] = React.useState<Location | null>(null);

  const routes = [
    { key: 'selectDestination', title: 'Ziel wählen', unfocusedIcon: 'arrow-decision-outline', focusedIcon: 'arrow-decision' },
    { key: 'map', title: 'Karte', unfocusedIcon: 'map-legend', focusedIcon: 'map-search' },
    { key: 'settings', title: 'Einstellungen', unfocusedIcon: 'cog-outline', focusedIcon: 'cog' },
  ];

  const handleSearch = (location: Location) => {
    setSelectedLocation(location);
    Keyboard.dismiss();
    setIndex(1); // Switch to Map
  };

  const handleIndexChange = (newIndex: number) => {
    Keyboard.dismiss(); // Dismiss keyboard when switching tabs
    setIndex(newIndex);
  };

  const renderScene = ({ route }: { route: any}) => {
    switch (route.key) {
      case 'selectDestination':
        return <SelectDestination onSearch={handleSearch} />;
      case 'map':
        return selectedLocation ? <Map selectedLocation={selectedLocation} /> : null;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene}
      activeColor="#0052CC"
      activeIndicatorStyle={{
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#0052CC',
      }}
      barStyle={{
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
      }}
    />
  );
}