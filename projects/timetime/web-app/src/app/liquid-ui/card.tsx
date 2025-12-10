import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LiquidTheme } from './theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  transparent?: boolean;
  shadowless?: boolean;
  onLayout?: (event: any) => void;
};

export const LiquidCard: React.FC<Props> = ({
  children,
  onPress,
  style,
  padding = 16,
  transparent = false,
  shadowless = false,
  onLayout,
}) => {
  const flattened = StyleSheet.flatten(style) || {};
  const radius =
    typeof flattened?.borderRadius === 'number'
      ? flattened.borderRadius
      : LiquidTheme.radius.card;

  const wrapperBase = [
    styles.cardWrapper,
    { borderRadius: radius, width: '100%' },
    !shadowless && LiquidTheme.shadowSoft,
    style,
  ];

  const surface = (
    <View
      style={[
        styles.card,
        { borderRadius: radius },
        transparent && styles.cardTransparent,
      ]}
    >
      {!transparent && (
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <View style={[styles.cardInner, { padding }]}>{children}</View>
    </View>
  );

  if (!onPress) {
    return (
      <View style={wrapperBase} onLayout={onLayout}>
        <View style={{ borderRadius: radius, overflow: 'hidden' }}>{surface}</View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        wrapperBase,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
      onLayout={onLayout}
    >
      <View style={{ borderRadius: radius, overflow: 'hidden' }}>{surface}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    overflow: 'visible',
    position: 'relative',
  },
  card: {
    borderRadius: LiquidTheme.radius.card,
    overflow: 'hidden',
    backgroundColor: LiquidTheme.colors.cardBg,
    borderWidth: 1,
    borderColor: LiquidTheme.colors.cardBorder,
    width: '100%',
  },
  cardTransparent: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cardInner: {
    position: 'relative',
  },
});

