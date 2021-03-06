import React, { FC } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { isSmallerScreen } from '../../helpers/screenDimension';
import Rating from '../Rating';

type BookProps = {
  onPress: () => void;
  bookId: string;
  imageUrl: string;
  title: string;
  rating: number;
};

const Book: FC<BookProps> = ({ bookId, onPress, imageUrl, title, rating }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Image
      source={{
        uri: imageUrl,
      }}
      style={styles.image}
    />
    <Text style={styles.title}>{title}</Text>
    <Rating bookId={bookId} rating={rating} disabled />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    width: isSmallerScreen ? 160 : 260,
    height: isSmallerScreen ? 200 : 300,
    resizeMode: 'contain',
    margin: 8,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  ratingContainer: {
    marginTop: 15,
    flexDirection: 'row',
  },
});

export default Book;
