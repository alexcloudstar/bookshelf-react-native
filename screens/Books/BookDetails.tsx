import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import Rating from '../../components/Rating';
import { Reviews } from '../../components/Reviews';
import { isSmallerScreen } from '../../helpers/screenDimension';
import * as bookActions from '../../store/actions/bookActions';

const BookDetails = (props: any) => {
  const { bookId, canEditBook, title, imageUrl, rating, reviews } =
    props.route.params;

  const dispatch = useDispatch();

  const onDeleteBook = () => {
    dispatch(bookActions.deleteBook(bookId));
    props.navigation.goBack();
  };

  const onAddReview = () =>
    props.navigation.navigate('AddReview', { bookId, reviews });

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Text style={styles.bookTitle}>{title}</Text>
        </View>

        <Rating bookId={bookId} rating={rating} disabled={canEditBook} />
        <Text style={{ fontSize: isSmallerScreen ? 14 : 18 }}>Reviews: </Text>
        <Reviews reviews={reviews} />

        {canEditBook && <Button title='Delete Book' onPress={onDeleteBook} />}
        {!canEditBook && <Button title='Add Review' onPress={onAddReview} />}
      </View>
    </ScrollView>
  );
};

export const screenOptions = (navData: any) => {
  return {
    headerTitle: navData.route.params.title,
    headerRight: () =>
      navData.route.params.canEditBook ? (
        <View>
          <FontAwesome5
            name='edit'
            size={24}
            color='black'
            onPress={() =>
              navData.navigation.navigate('AddBook', {
                bookId: navData.route.params.bookId,
                title: navData.route.params.title,
                imageUrl: navData.route.params.imageUrl,
                isEditBook: true,
              })
            }
          />
        </View>
      ) : (
        <></>
      ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 50,
  },
  innerContainer: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  image: {
    width: isSmallerScreen ? 150 : 250,
    height: isSmallerScreen ? 250 : 350,
    marginBottom: 20,
  },
});

export default BookDetails;
