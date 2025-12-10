import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LiquidTheme, SCREEN_HEIGHT, nativeDriver } from './theme';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
};

export const LiquidSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  headerRight,
  children,
}) => {
  const [visible, setVisible] = useState(isOpen);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: nativeDriver,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 260,
        useNativeDriver: nativeDriver,
      }).start(({ finished }) => {
        if (finished) setVisible(false);
      });
    }
  }, [isOpen, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 4,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 80) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: nativeDriver,
            bounciness: 8,
          }).start();
        }
      },
    }),
  ).current;

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.sheetBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.sheetHandle} />
          {(title || headerRight) && (
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title}</Text>
              {headerRight}
            </View>
          )}
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetContainer: {
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: LiquidTheme.radius.sheet,
    borderTopRightRadius: LiquidTheme.radius.sheet,
    backgroundColor: 'rgba(255,255,255,0.95)',
    overflow: 'hidden',
  },
  sheetHandle: {
    alignSelf: 'center',
    marginTop: 8,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sheetScroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

