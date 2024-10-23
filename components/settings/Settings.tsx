// import React from 'react'
// import { View, StyleSheet } from 'react-native'
// import { Switch, Subheading, DefaultTheme } from 'react-native-paper'
// // import { useStateValue } from '../Store'
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     elevation: 2,
//     padding: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingTop: 16,
//     paddingHorizontal: 16,
//     width: '100%',
//   },
// })
// function SettingsScreen() {
// //   const [state, dispatch] = useStateValue()
// //   const { isDarkModeOn } = state
// //   const handleThemeChange = () => dispatch({
// //     type: 'TOGGLE_THEME',
// //     payload: !isDarkModeOn,
// //   })
//   return (
//     <View >
//       <View style={styles.row}>
//         <Subheading >Rot Grün Schwäche</Subheading>
//         {/* <Switch value={isDarkModeOn} onValueChange={handleThemeChange} /> */}
//       </View>
//     </View>
//   )
// }
// export default SettingsScreen


import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useAudioStore } from '../../stores/useAudioStore';

const Settings: React.FC = () => {
  const { speechRate, setSpeechRate } = useAudioStore();

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Spracheinstellungen
      </Text>
      <View style={styles.sliderContainer}>
        <Text variant="bodyLarge">Sprechgeschwindigkeit: {speechRate.toFixed(1)}x</Text>
        <Slider
          style={styles.slider}
          value={speechRate}
          onValueChange={setSpeechRate}
          minimumValue={0.5}
          maximumValue={2.0}
          step={0.1}
          minimumTrackTintColor="#0052CC"
          maximumTrackTintColor="#000000"
          thumbTintColor="#0052CC"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: 24,
  },
  sliderContainer: {
    marginBottom: 16,
  },
  slider: {
    marginTop: 8,
    width: '100%',
    height: 40,
  },
});

export default Settings;
