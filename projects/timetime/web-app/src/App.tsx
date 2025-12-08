import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MockupApp from './mockup';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MockupApp />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 0,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
  },
});
