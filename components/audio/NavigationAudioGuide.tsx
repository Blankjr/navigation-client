import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { ImageGalleryProps, useGalleryStore } from '../visual/ImageGallery';
import { IconButton } from 'react-native-paper';
import { useAudioStore } from '../../stores/useAudioStore';

const NavigationAudioGuide: React.FC<ImageGalleryProps> = ({ images }) => {
    const imageIndex = useGalleryStore((state) => state.currentImageIndex);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechRate = useAudioStore((state) => state.speechRate);

    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);

    const speak = useCallback(async () => {
        if (isSpeaking) {
            await Speech.stop();
            setIsSpeaking(false);
        } else {
            const imageDescription = images[imageIndex].description;
            setIsSpeaking(true);
            
            console.log(imageIndex);
            
            try {
                await Speech.speak(imageDescription, {
                    language: "de-DE",
                    rate: speechRate,
                    onDone: () => setIsSpeaking(false),
                    onError: () => setIsSpeaking(false)
                });
            } catch (error) {
                console.error("Speech error:", error);
                setIsSpeaking(false);
            }
        }
    }, [imageIndex, images, isSpeaking]);

    return (
        <Pressable 
            style={styles.container}
            onPress={speak}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Beschreibung vorlesen"
        >
            <IconButton
                style={styles.button} 
                icon={isSpeaking ? "stop" : "speaker"}
                mode="contained" 
                iconColor={isSpeaking ? '#ff0000' : '#2F3C7E'}
                size={120}
                onPress={speak}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        width: 120,
        height: 120,
    },
});

export default NavigationAudioGuide;