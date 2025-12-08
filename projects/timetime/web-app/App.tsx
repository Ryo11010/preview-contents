import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MobileApp from './src/app/mobile';
import DebugOverlayHost, {
  DebugOverlay,
  debugOverlayEnabled,
} from './src/app/debugOverlay';

export default function App() {
  useEffect(() => {
    if (debugOverlayEnabled) {
      DebugOverlay.ensure({ title: 'Timetime Debug' }).show();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MobileApp />
      <DebugOverlayHost />
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
