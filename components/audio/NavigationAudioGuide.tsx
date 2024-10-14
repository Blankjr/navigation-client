import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';
import { ImageGalleryProps, useGalleryStore } from '../visual/ImageGallery';
import { IconButton } from 'react-native-paper';

const NavigationAudioGuide: React.FC<ImageGalleryProps> = ({ images }) => {
    const imageIndex = useGalleryStore((state) => state.currentImageIndex);
    const [isSpeaking, setIsSpeaking] = useState(false);

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
        <View style={styles.container}>
             <IconButton
                style={styles.button} 
                icon={isSpeaking ? "stop" : "speaker"}
                mode="contained" 
                iconColor={isSpeaking ? '#ff0000' : '#ce7276'}
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

export default NavigationAudioGuide;