import React from 'react';
import { View, StyleSheet } from 'react-native';

interface LineIndicatorProps {
  currentGridSquare: string;
  lineDirections?: {
    [key: string]: string[];
  };
}

const LineIndicator: React.FC<LineIndicatorProps> = ({ currentGridSquare, lineDirections }) => {
  const getNextColor = () => {
    if (!lineDirections || !currentGridSquare) return null;

    //find which color we should follow from our current position
    for (const [color, squares] of Object.entries(lineDirections)) {
      if (squares.includes(currentGridSquare)) {
        return color;
      }
    }
    return null;
  };

  const getColorFromName = (colorName: string): string => {
    switch (colorName) {
      case 'red':
        return '#FF4444';
      case 'yellow':
        return '#FFD700';
      case 'light-blue':
        return '#44AEFF';
      case 'dark-blue':
        return '#4444FF';
      case 'green-long':
      case 'green-short':
      case 'green-short-reverse':
        return '#44FF44';
      case 'orange':
        return '#FFA500';
      default:
        return '#CCCCCC';
    }
  };

  const nextColorName = getNextColor();
  if (!nextColorName) return null;

  return (
    <View style={styles.container}>
      <View style={[styles.line, { backgroundColor: getColorFromName(nextColorName) }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1,
  },
  line: {
    height: 40,
    width: '100%',
  }
});

export default LineIndicator;