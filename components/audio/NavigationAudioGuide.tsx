

import { View, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { useGalleryStore } from '../visual/ImageGallery';
import { useCallback } from 'react';
import { Button, IconButton } from 'react-native-paper';

export default function App() {
    const imageIndex = useGalleryStore((state) => state.currentImageIndex)
    const speak = useCallback(() => {
        const thingToSay = 'Laufe am grünen Schild vorbei';
        Speech.VoiceQuality.Enhanced;
        
        console.log(imageIndex);
        
        Speech.speak(thingToSay, {language:"de-DE"});
    }, [imageIndex])

    return (
        <View style={styles.container}>
             <IconButton
                style={styles.button} 
                icon="speaker"
                mode="contained" 
                iconColor='#ce7276'
                size={75}
                onPress={speak}
            />
        
        </View>
    );
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ecf0f1',
            padding: 8,
        },
        button: {
            borderRadius: 5,
            width: 100,
            height: 100,
            borderColor: '#000000',
            borderWidth: 2
            
        },

    });
