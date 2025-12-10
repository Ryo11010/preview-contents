import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { LiquidTheme, nativeDriver } from './theme';

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  style?: any;
};

export const LiquidSegmentControl: React.FC<Props> = ({
  options,
  value,
  onChange,
  style,
}) => {
  const [width, setWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const activeIndex = Math.max(0, options.findIndex((o) => o.value === value));

  useEffect(() => {
    if (width === 0) return;
    const itemWidth = width / options.length;
    Animated.spring(translateX, {
      toValue: activeIndex * itemWidth,
      useNativeDriver: nativeDriver,
      bounciness: 12,
    }).start();
  }, [activeIndex, width, options.length, translateX]);

  const onLayout = (e: any) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.segmentContainer, style]} onLayout={onLayout}>
      {width > 0 && (
        <Animated.View
          style={[
            styles.segmentHighlight,
            {
              width: width / options.length - 8,
              transform: [
                { translateX: Animated.add(translateX, new Animated.Value(4)) },
              ],
            },
          ]}
        />
      )}
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            style={styles.segmentItem}
            onPress={() => onChange(opt.value)}
          >
            <Text
              style={[
                styles.segmentText,
                isActive ? styles.segmentTextActive : styles.segmentTextInactive,
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    ...LiquidTheme.shadowSoft,
  },
  segmentHighlight: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: LiquidTheme.colors.primary,
  },
  segmentTextInactive: {
    color: '#6B7280',
  },
});

