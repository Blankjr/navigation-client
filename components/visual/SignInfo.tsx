import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import * as Speech from 'expo-speech';
import { RoomSignage, SignColor } from '../../data/locations';
import { useAudioStore } from '@/stores/useAudioStore';

interface SignInfoProps {
  signage?: RoomSignage;
}

interface ColorMapping {
    spokenName: string;
    cssColor: string;
  }
  
  const colorMappings: { [key in SignColor]: ColorMapping } = {
    [SignColor.RED]: {
      spokenName: 'roten',
      cssColor: '#FF0000'
    },
    [SignColor.BLUE]: {
      spokenName: 'blauen',
      cssColor: '#0000FF'
    },
    [SignColor.GREEN]: {
      spokenName: 'grünen',
      cssColor: '#00FF00'
    },
    [SignColor.YELLOW]: {
      spokenName: 'gelben',
      cssColor: '#FFD700'
    },
    [SignColor.BLACK]: {
      spokenName: 'schwarzen',
      cssColor: '#000000'
    }
  };

const SignInfo: React.FC<SignInfoProps> = ({ signage }) => {
  const speechRate = useAudioStore((state: { speechRate: number; }) => state.speechRate);
    const getColorInfo = (color: SignColor): ColorMapping => {
        return colorMappings[color] || {
          spokenName: 'grauen',
          cssColor: '#808080'
        };
      };

      const formatSignForSpeech = (text: string): string => {
        // Add spaces between all characters
        return text.split('').join(' ');
      };

      const announceSign = () => {
        if (signage) {
          const colorInfo = getColorInfo(signage.signColor);
          const spokenSign = formatSignForSpeech(signage.visualSign);
          Speech.speak(`Suchen Sie nach einem ${colorInfo.spokenName} Schild mit der Kennzeichnung ${spokenSign}`, {
            language: 'de-DE',
            rate: speechRate
          });
        } else {
          Speech.speak("Der Raum wurde noch nicht mit einem geeigneten Schild versehen.", {
            language: 'de-DE',
            rate: speechRate
          });
        }
      };

  return (
    <Pressable 
      style={styles.container}
      onPress={announceSign}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={signage 
        ? `Suchen Sie nach einem ${getColorInfo(signage.signColor).spokenName} Schild mit der Kennzeichnung ${signage.visualSign}`
        : "Der Raum wurde noch nicht mit einem geeigneten Schild versehen."
      }
    >
      <Surface style={styles.surface} elevation={4}>
        <View style={[
          styles.sign, 
          {
            backgroundColor: signage 
              ? getColorInfo(signage.signColor).cssColor 
              : '#000000'
          }
        ]}>
          <Text style={styles.signText}>
            {signage ? signage.visualSign : "?"}
          </Text>
        </View>
      </Surface>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    borderRadius: 8,
  },
  sign: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  signText: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default SignInfo;