import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LiquidTheme, SCREEN_WIDTH, isWeb, nativeDriver } from './theme';

type Tab = { id: string; icon: React.ReactNode; label?: string };

type Props = {
  tabs: Tab[];
  activeId: string | null;
  onChange: (id: string) => void;
};

export const LiquidDock: React.FC<Props> = ({ tabs, activeId, onChange }) => {
  const [width, setWidth] = useState(0);
  const highlightX = useRef(new Animated.Value(0)).current;

  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);
  const hasActive = activeIndex >= 0;

  useEffect(() => {
    if (width === 0 || tabs.length === 0 || !hasActive) return;
    const itemWidth = width / tabs.length;
    Animated.spring(highlightX, {
      toValue: activeIndex * itemWidth,
      useNativeDriver: nativeDriver,
      bounciness: 12,
    }).start();
  }, [activeIndex, width, tabs.length, highlightX, hasActive]);

  const onLayout = (e: any) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      {...(isWeb ? {} : { pointerEvents: 'box-none' })}
      style={styles.dockWrapper}
    >
      <View style={styles.dockShadowLayer} />
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.dock}
        onLayout={onLayout}
      >
        {width > 0 && tabs.length > 0 && hasActive && (
          <Animated.View
            style={[
              styles.dockHighlight,
              {
                width: width / tabs.length - 12,
                transform: [
                  {
                    translateX: Animated.add(
                      highlightX,
                      new Animated.Value(6),
                    ),
                  },
                ],
              },
            ]}
          />
        )}
        {tabs.map((tab) => {
          const isActive = hasActive && tab.id === activeId;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onChange(tab.id)}
              style={({ pressed }) => [
                styles.dockItem,
                pressed && { transform: [{ scale: 0.95 }] },
              ]}
            >
              <View
                style={[
                  styles.dockIconWrapper,
                  isActive && styles.dockIconWrapperActive,
                ]}
              >
                {tab.icon}
              </View>
              {tab.label && (
                <Text
                  style={[
                    styles.dockLabel,
                    isActive ? styles.dockLabelActive : styles.dockLabelInactive,
                  ]}
                >
                  {tab.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  dockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: 'center',
  },
  dockShadowLayer: {
    position: 'absolute',
    bottom: 12,
    width: 200,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.12)',
    opacity: 0.25,
    alignSelf: 'center',
    filter: Platform.OS === 'web' ? 'blur(24px)' : undefined,
  } as any,
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden',
    ...LiquidTheme.shadowStrong,
    width: SCREEN_WIDTH * 0.8,
    maxWidth: 360,
  },
  dockHighlight: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  dockIconWrapper: {
    borderRadius: 999,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockIconWrapperActive: {},
  dockLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  dockLabelActive: {
    color: LiquidTheme.colors.primary,
    fontWeight: '700',
  },
  dockLabelInactive: {
    color: '#9CA3AF',
  },
});
