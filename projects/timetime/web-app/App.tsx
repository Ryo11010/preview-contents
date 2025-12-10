import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
    <SafeAreaProvider>
      <View style={styles.container}>
        <MobileApp />
        <DebugOverlayHost />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
