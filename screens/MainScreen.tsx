import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

const MainScreen = (props: any) => {
  return (
    <View style={styles.container}>
      <Text>Main Screen</Text>
      <Button
        title='Go to Book List Screen'
        onPress={() => props.navigation.navigate('BooksListScreen')}
      />
    </View>
  );
};

export const screenOptions = (navData: any) => {
  return {
    headerTitle: 'Home',
    headerLeft: () => <Text onPress={() => alert('pressed')}>Open Drawer</Text>,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;
