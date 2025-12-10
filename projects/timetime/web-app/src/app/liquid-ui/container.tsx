import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SCREEN_HEIGHT, SCREEN_WIDTH, isWeb } from './theme';

type Props = {
  children: React.ReactNode;
  style?: any;
};

export const LiquidContainer: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['#E0EAFC', '#CFDEF3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        {...(isWeb ? {} : { pointerEvents: 'none' })}
        style={[styles.blobTop, isWeb ? { pointerEvents: 'none' as const } : null]}
      />
      <View
        {...(isWeb ? {} : { pointerEvents: 'none' })}
        style={[styles.blobBottom, isWeb ? { pointerEvents: 'none' as const } : null]}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E5EC',
  },
  safeArea: {
    flex: 1,
  },
  blobTop: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.15,
    left: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: SCREEN_WIDTH * 0.35,
    backgroundColor: 'rgba(147,197,253,0.3)',
    opacity: 0.7,
  },
  blobBottom: {
    position: 'absolute',
    bottom: -SCREEN_HEIGHT * 0.2,
    right: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    backgroundColor: 'rgba(196,181,253,0.25)',
    opacity: 0.9,
  },
});

