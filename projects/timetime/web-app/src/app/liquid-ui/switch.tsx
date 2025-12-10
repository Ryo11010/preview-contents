import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LiquidTheme } from './theme';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const LiquidSwitch: React.FC<Props> = ({ value, onValueChange }) => {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[
        styles.switchTrack,
        value ? styles.switchTrackOn : styles.switchTrackOff,
      ]}
    >
      <View
        style={[
          styles.switchThumb,
          value ? styles.switchThumbOn : styles.switchThumbOff,
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchTrack: {
    width: 44,
    height: 28,
    borderRadius: 16,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchTrackOn: {
    backgroundColor: '#34C759',
  },
  switchTrackOff: {
    backgroundColor: '#D1D5DB',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  switchThumbOn: {
    transform: [{ translateX: 16 }],
  },
  switchThumbOff: {
    transform: [{ translateX: 0 }],
  },
});

