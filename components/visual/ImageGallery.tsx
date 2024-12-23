import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text, AccessibilityInfo, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import { create } from 'zustand';
import { ImageItem } from './types';
import { useNavigationStore } from '@/stores/useNavigationStore';

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
  const { isVisualMode } = useNavigationStore();
  const [currentPage, setCurrentPage] = useState(0);
  const updateCurrentImageIndex = useGalleryStore(state => state.updateCurrentImageIndex);
  const pagerRef = React.useRef<PagerView>(null);

  useEffect(() => {
      if (currentGridSquare && images.length > 0) {
          const matchingIndex = images.findIndex(image => {
              const imageId = image.id || image.url?.split('/').pop()?.split('.')[0];
              return imageId === currentGridSquare;
          });

          if (matchingIndex !== -1 && matchingIndex !== currentPage) {
              pagerRef.current?.setPage(matchingIndex);
              setCurrentPage(matchingIndex);
              updateCurrentImageIndex(matchingIndex);

              if (images[matchingIndex]?.description) {
                  AccessibilityInfo.announceForAccessibility(
                      `${images[matchingIndex].description}`
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
              `${images[newPage].description}`
          );
      }
  }, [images, updateCurrentImageIndex]);

  if (!images || images.length === 0) {
      return null;
  }

  // Common UI elements for both modes
  const renderPager = () => (
      <PagerView 
          ref={pagerRef}
          style={styles.pagerView} 
          initialPage={0}
          onPageSelected={onPageSelected}
          accessible={true}
          accessibilityLabel={`Navigation mit ${images.length} Anweisungen`}
          accessibilityHint="Wische nach links oder rechts für weitere Anweisungen"
      >
          {images.map((image, index) => (
              <View 
                  key={index} 
                  style={styles.page}
                  accessible={true}
                  accessibilityLabel={`Anweisung ${index + 1} von ${images.length}`}
                  accessibilityHint={image?.description || 'Keine Beschreibung verfügbar'}
              >
                  {isVisualMode ? (
                      image.url && (
                          <Image
                              style={styles.image}
                              source={image.url}
                              placeholder={blurhash}
                              contentFit="cover"
                              transition={1000}
                              accessible={true}
                              accessibilityLabel={image?.description || 'Keine Beschreibung verfügbar'}
                          />
                      )
                  ) : (
                      <View style={styles.indexContainer}>
                          <Text style={styles.indexText}>
                              {index + 1}/{images.length}
                          </Text>
                      </View>
                  )}
              </View>
          ))}
      </PagerView>
  );

  const renderIndicator = () => (
      <View 
          style={styles.indicatorContainer}
          accessible={true}
          accessibilityLabel={`Anweisung ${currentPage + 1} von ${images.length}`}
          accessibilityHint="Zeigt aktuelle Position"
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
  );

  return (
      <View style={styles.container}>
          {renderPager()}
          {isVisualMode && renderIndicator()}
      </View>
  );
};

interface Styles {
  container: ViewStyle;
  pagerView: ViewStyle;
  page: ViewStyle;
  image: ImageStyle;
  indexContainer: ViewStyle;
  indexText: TextStyle;
  indicatorContainer: ViewStyle;
  pageText: TextStyle;
  dotContainer: ViewStyle;
  dot: ViewStyle;
  activeDot: ViewStyle;
  inactiveDot: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
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
  } as ImageStyle,
  indexContainer: {
      flex: 1,
      width: '100%',
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#000000',
  },
  indexText: {
      fontSize: 72,
      color: '#000000',
      fontWeight: 'bold',
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
});

export default ImageGallery;