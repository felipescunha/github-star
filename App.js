import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  wellcome: {
    fontSize: 20,
    alignItems: 'center',
    margin: 10,
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.wellcome}>Hello World</Text>
    </View>
  );
}
