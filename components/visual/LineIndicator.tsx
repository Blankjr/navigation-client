import React from 'react';
import { View, StyleSheet } from 'react-native';

type LineRoutes = {
  [key: string]: string[];
};

interface LineIndicatorProps {
  currentGridSquare: string;
  lineDirections?: {
    [key: string]: string[];
  };
}

const LineIndicator: React.FC<LineIndicatorProps> = ({ currentGridSquare, lineDirections }) => {
  const getLineColor = () => {
    console.log('Current Line Directions:', JSON.stringify(lineDirections, null, 2));
    console.log('Current Grid Square:', currentGridSquare);

    if (!lineDirections || !currentGridSquare) return null;

    // Check each color in lineDirections
    for (const [color, squares] of Object.entries(lineDirections)) {
      // console.log(`Checking color ${color} with squares:, ${squares}`);
      // console.log(`Current grid square for comparison: ${currentGridSquare}`);

      const isMatch = squares.includes(currentGridSquare);
      // console.log(`Is match: ${isMatch}`);

      if (isMatch) {
        switch (color) {
          case 'red':
            return '#FF4444';
          case 'yellow':
          case 'yellow-reverse':
            return '#FFD700';
          case 'blue':
            return '#4444FF';
          case 'green-long':
          case 'green-short':
          case 'green-short-reverse':
            return '#44FF44';
          case 'orange':
            return '#FFA500';
          default:
            return null;
        }
      }
    }
    return null;
  };

  const lineColor = getLineColor();
  // console.log('Final line color:', lineColor);

  if (!lineColor) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: lineColor }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1, // Add this to ensure it shows above other content
  },
  line: {
    height: 40,
    width: '100%',
  }
});

export default LineIndicator;