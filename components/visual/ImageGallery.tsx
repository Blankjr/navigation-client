import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const ImageGallery = ({ images }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const onPageSelected = (e) => {
    setCurrentPage(e.nativeEvent.position);
  };

  return (
    <View style={styles.container}>
      <PagerView 
        style={styles.pagerView} 
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.page}>
            <Image
              style={styles.image}
              source={image}
              placeholder={blurhash}
              contentFit="cover"
              transition={1000}
            />
          </View>
        ))}
      </PagerView>
      <View style={styles.indicatorContainer}>
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
        <Text style={styles.swipeHint}>Swipe für mehr Bilder ➡️</Text>
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