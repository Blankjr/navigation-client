import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Speech from 'expo-speech';
import { ImageGalleryProps, useGalleryStore } from '../visual/ImageGallery';
import { IconButton } from 'react-native-paper';
import { useAudioStore } from '../../stores/useAudioStore';

interface NavigationAudioGuideProps extends ImageGalleryProps {
    autoPlay?: boolean;
}

const NavigationAudioGuide: React.FC<NavigationAudioGuideProps> = ({ 
    images, 
    autoPlay 
}) => {
    const imageIndex = useGalleryStore((state) => state.currentImageIndex);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechRate = useAudioStore((state) => state.speechRate);
    const lastPlayedIndex = React.useRef(imageIndex);

    const speak = useCallback(async (forcePlay = false) => {
        if (isSpeaking && !forcePlay) {
            await Speech.stop();
            setIsSpeaking(false);
            return;
        }

        const imageDescription = images[imageIndex]?.description;
        if (!imageDescription) {
            console.error("No description available for this image");
            return;
        }
        
        if (isSpeaking) {
            await Speech.stop();
        }

        setIsSpeaking(true);
        try {
            Speech.speak(imageDescription, {
                language: "de-DE",
                rate: speechRate,
                onDone: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false)
            });
        } catch (error) {
            console.error("Speech error:", error);
            setIsSpeaking(false);
        }
    }, [imageIndex, images, isSpeaking, speechRate]);

    // handle auto-play
    useEffect(() => {
        if (autoPlay && imageIndex !== lastPlayedIndex.current) {
            lastPlayedIndex.current = imageIndex;
            speak(true); // Force play even if already speaking
        }
    }, [imageIndex, autoPlay, speak]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            Speech.stop();
        };
    }, []);

    return (
        <Pressable 
            style={styles.container}
            onPress={() => speak(false)}
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
                onPress={() => speak(false)}
            />
        </Pressable>
    );
};

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