import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, AccessibilityInfo } from 'react-native';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import { create } from 'zustand';
import { ImageItem } from './types';

interface IGalleryStore {
    currentImageIndex: number;
    updateCurrentImageIndex: (newIndex: number) => void;
}

export const useGalleryStore = create<IGalleryStore>()((set) => ({
    currentImageIndex: 0,
    updateCurrentImageIndex: (newIndex: number) => set({ currentImageIndex: newIndex }),
}));

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export interface ImageGalleryProps {
    images: ImageItem[];
    currentGridSquare?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, currentGridSquare }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const updateCurrentImageIndex = useGalleryStore(state => state.updateCurrentImageIndex);
    const pagerRef = React.useRef<PagerView>(null);

    useEffect(() => {
        if (currentGridSquare && images.length > 0) {
            // Find the index of the image that matches the current grid square
            const matchingIndex = images.findIndex(image => {
                // Extract grid square ID from image URL or ID
                const imageId = image.id || image.url.split('/').pop()?.split('.')[0];
                return imageId === currentGridSquare;
            });

            if (matchingIndex !== -1 && matchingIndex !== currentPage) {
                // Set the page programmatically
                pagerRef.current?.setPage(matchingIndex);
                setCurrentPage(matchingIndex);
                updateCurrentImageIndex(matchingIndex);

                // Announce the change for accessibility
                if (images[matchingIndex]?.description) {
                    AccessibilityInfo.announceForAccessibility(
                        `Automatisch gewechselt zu Bild ${matchingIndex + 1} von ${images.length}. ${images[matchingIndex].description}`
                    );
                }
            }
        }
    }, [currentGridSquare, images]);

    const onPageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
        const newPage = e.nativeEvent.position;
        setCurrentPage(newPage);
        updateCurrentImageIndex(newPage);
        
        if (images && images[newPage] && images[newPage].description) {
            AccessibilityInfo.announceForAccessibility(
                `Bild ${newPage + 1} von ${images.length}. ${images[newPage].description}`
            );
        } else {
            AccessibilityInfo.announceForAccessibility(
                `Bild ${newPage + 1} von ${images.length}`
            );
        }
    }, [images, updateCurrentImageIndex]);

    if (!images || images.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Kein Bild verfügbar</Text>
            </View>
        );
    }

    return (
      <View style={styles.container}>
        <PagerView 
            ref={pagerRef}
            style={styles.pagerView} 
            initialPage={0}
            onPageSelected={onPageSelected}
            accessible={true}
            accessibilityLabel={`Gallerie mit ${images.length} Bildern`}
            accessibilityHint="Wische nach links oder rechts für weitere Bilder"
          >
          {images.map((image, index) => (
            <View 
              key={index} 
              style={styles.page}
              accessible={true}
              accessibilityLabel={`Bild ${index + 1} von ${images.length}`}
              accessibilityHint={image?.description || 'Keine Beschreibung verfügbar'}
            >
              <Image
                style={styles.image}
                source={image.url}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                accessible={true}
                accessibilityLabel={image?.description || 'Keine Beschreibung verfügbar'}
              />
            </View>
          ))}
        </PagerView>
        <View 
          style={styles.indicatorContainer}
          accessible={true}
          accessibilityLabel={`Bild ${currentPage + 1} von ${images.length}`}
          accessibilityHint="Zeigt aktuelle Bildposition"
        >
          <Text style={styles.pageText}>
            {currentPage + 1} / {images.length}
          </Text>
          <View style={styles.dotContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentPage ? styles.activeDot : styles.inactiveDot
                ]}
              />
            ))}
          </View>
        </View>
        {currentPage === 0 && (
          <Text 
            style={styles.swipeHint}
            accessible={true}
            accessibilityLabel="Wisch Hinweis"
            accessibilityHint="Wische rechts für mehr Bilder"
          >
            Wische für mehr Bilder ⬅️
          </Text>
        )}
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
      height: Dimensions.get('window').height * 0.3,
      width: '100%',
    },
    pagerView: {
      flex: 1,
    },
    page: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      flex: 1,
      width: '100%',
      backgroundColor: '#0553',
    },
    indicatorContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    pageText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10,
    },
    dotContainer: {
      flexDirection: 'row',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    activeDot: {
      backgroundColor: 'white',
    },
    inactiveDot: {
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    swipeHint: {
      position: 'absolute',
      top: 20,
      right: 20,
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.75)',
      textShadowOffset: {width: -1, height: 1},
      textShadowRadius: 10,
    },
});

export default ImageGallery;