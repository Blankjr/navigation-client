

import { View, StyleSheet, Button } from 'react-native';
import * as Speech from 'expo-speech';
import { useGalleryStore } from '../visual/ImageGallery';
import { useCallback } from 'react';

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
        <Button title="Press to hear some words" onPress={speak} />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    });
