import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, AccessibilityInfo } from 'react-native';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import { create } from 'zustand';
import { ImageItem } from './types';

interface IGalleryStore {
    currentImageIndex: number
    updateCurrentImageIndex: (newIndex: number) => void
}

export const useGalleryStore = create<IGalleryStore>()((set) => ({
  currentImageIndex: 0,
  updateCurrentImageIndex: (newIndex: number) => set({ currentImageIndex: newIndex}),
}));

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export interface ImageGalleryProps {
  images: ImageItem[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const updateCurrentImageIndex = useGalleryStore(state => state.updateCurrentImageIndex);
  
    const onPageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
      const newPage = e.nativeEvent.position;
      setCurrentPage(newPage);
      updateCurrentImageIndex(newPage);
      
      // Safety check for valid image and description
      if (images && images[newPage] && images[newPage].description) {
        AccessibilityInfo.announceForAccessibility(
          `Image ${newPage + 1} of ${images.length}. ${images[newPage].description}`
        );
      } else {
        // Fallback announcement if description is missing
        AccessibilityInfo.announceForAccessibility(
          `Image ${newPage + 1} of ${images.length}`
        );
      }
    }, [images, updateCurrentImageIndex]);

    // Safety check for empty images array
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
          style={styles.pagerView} 
          initialPage={0}
          onPageSelected={onPageSelected}
          accessible={true}
          accessibilityLabel={`Image gallery with ${images.length} images`}
          accessibilityHint="Swipe left or right to view different images"
        >
          {images.map((image, index) => (
            <View 
              key={index} 
              style={styles.page}
              accessible={true}
              accessibilityLabel={`Image ${index + 1} of ${images.length}`}
              accessibilityHint={image?.description || 'No description available'}
            >
              <Image
                style={styles.image}
                source={image.url}
                placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                accessible={true}
                accessibilityLabel={image?.description || 'No description available'}
              />
            </View>
          ))}
        </PagerView>
        <View 
          style={styles.indicatorContainer}
          accessible={true}
          accessibilityLabel={`Image ${currentPage + 1} of ${images.length}`}
          accessibilityHint="Shows current image position"
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
            accessibilityLabel="Swipe hint"
            accessibilityHint="Swipe right to view more images"
          >
            Swipe für mehr Bilder ➡️
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