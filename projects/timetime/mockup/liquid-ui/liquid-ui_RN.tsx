// src/ui/liquid-ui.native.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform,
  GestureResponderEvent,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';

// ▼ グラデーション / ぼかしは、あなたの環境に合わせて切り替えてください。
// 例1: expo を使っている場合
// import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';

// 例2: bare RN の場合
// import LinearGradient from 'react-native-linear-gradient';
// import { BlurView } from '@react-native-community/blur';

// ここでは「expo を使っている想定のサンプル」として書いておきます。
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export const LiquidTheme = {
  colors: {
    primary: '#007AFF',
    danger: '#FF3B30',
    background: '#E0E5EC',
    cardBg: 'rgba(255,255,255,0.7)',
    cardBorder: 'rgba(255,255,255,0.6)',
  },
  radius: {
    card: 28,
    sheet: 32,
    button: 24,
  },
  shadowStrong: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  shadowSoft: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
};

/**
 * LiquidContainer (RN)
 * 画面全体のグラデーション＋オーラ背景。
 * Web 版の LiquidContainer の RN 版。
 */
export const LiquidContainer: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['#E0EAFC', '#CFDEF3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* soft blobs */}
      <View pointerEvents="none" style={styles.blobTop} />
      <View pointerEvents="none" style={styles.blobBottom} />
      {/* SafeArea 内にアプリ内容を載せる */}
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </View>
  );
};

/**
 * LiquidCard (RN)
 * ガラス風カード。Pressable を渡せる。
 */
export const LiquidCard: React.FC<{
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  transparent?: boolean; // blur を使わない軽量モード
}> = ({ children, onPress, style, padding = 16, transparent = false }) => {
  const content = (
    <View style={[styles.card, transparent && styles.cardTransparent, style]}>
      {!transparent && (
        <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFill} />
      )}
      <View style={[styles.cardInner, { padding }]}>{children}</View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
        LiquidTheme.shadowSoft,
      ]}
    >
      {content}
    </Pressable>
  );
};

/**
 * LiquidButton (RN)
 * ボタン。variant/size/icon を渡せる。
 */
type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'glass' | 'segment';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export const LiquidButton: React.FC<{
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode; // RN 側のアイコンコンポーネントをそのまま渡す
  disabled?: boolean;
}> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  icon,
  disabled = false,
}) => {
  const variantStyle = (() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: LiquidTheme.colors.primary,
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.9)',
          borderWidth: 1,
        };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'glass':
        return {
          backgroundColor: 'rgba(255,255,255,0.5)',
          borderColor: 'rgba(255,255,255,0.8)',
          borderWidth: 1,
        };
      case 'segment':
        return {
          backgroundColor: '#fff',
        };
      default:
        return {};
    }
  })();

  const sizeStyle = (() => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 12, paddingVertical: 8, minHeight: 32 };
      case 'md':
        return { paddingHorizontal: 16, paddingVertical: 12, minHeight: 40 };
      case 'lg':
        return { paddingHorizontal: 20, paddingVertical: 14, minHeight: 48 };
      case 'icon':
        return {
          paddingHorizontal: 8,
          paddingVertical: 8,
          minHeight: 36,
          width: 36,
          justifyContent: 'center',
        };
      default:
        return {};
    }
  })();

  const textColor = (() => {
    switch (variant) {
      case 'primary':
        return '#fff';
      case 'danger':
        return LiquidTheme.colors.danger;
      case 'ghost':
        return '#4b5563';
      case 'glass':
      case 'segment':
      default:
        return '#111827';
    }
  })();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonBase,
        variantStyle,
        sizeStyle,
        LiquidTheme.shadowSoft,
        pressed && !disabled && { transform: [{ scale: 0.95 }] },
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {icon && (
        <View style={{ marginRight: children ? 8 : 0, alignItems: 'center' }}>
          {icon}
        </View>
      )}
      {children && (
        <Text
          style={[
            styles.buttonText,
            { color: textColor },
            variant === 'danger' && { fontWeight: '600' },
            textStyle,
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
};

/**
 * LiquidSwitch (RN)
 * iOS 風トグルスイッチ
 */
export const LiquidSwitch: React.FC<{
  value: boolean;
  onValueChange: (value: boolean) => void;
}> = ({ value, onValueChange }) => {
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

/**
 * LiquidSegmentControl (RN)
 * iOS 風のセグメントタブ
 */
export const LiquidSegmentControl: React.FC<{
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}> = ({ options, value, onChange, style }) => {
  const [width, setWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  useEffect(() => {
    if (width === 0) return;
    const itemWidth = width / options.length;
    Animated.spring(translateX, {
      toValue: activeIndex * itemWidth,
      useNativeDriver: true,
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
      {options.map((opt, idx) => {
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

/**
 * LiquidInput (RN)
 * 左にアイコンを置けるガラス風 TextInput
 */
export const LiquidInput: React.FC<
  TextInputProps & {
    leftIcon?: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
  }
> = ({ leftIcon, containerStyle, inputStyle, ...props }) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {leftIcon && <View style={styles.inputIcon}>{leftIcon}</View>}
      <TextInput
        {...props}
        style={[
          styles.input,
          leftIcon && { paddingLeft: 32 },
          inputStyle,
        ]}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

/**
 * LiquidSheet (RN)
 * iOS 風のボトムシート。タップで閉じる＋下方向へのドラッグで閉じる。
 */
export const LiquidSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, headerRight, children }) => {
  const [visible, setVisible] = useState(isOpen);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 260,
        useNativeDriver: true,
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
            useNativeDriver: true,
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

/**
 * DeleteConfirmationModal (RN)
 * 小さめのポップアップ確認モーダル
 */
export const DeleteConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: React.ReactNode;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = '削除する',
  cancelLabel = 'キャンセル',
  icon,
}) => {
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isOpen) {
      scale.setValue(0.8);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
      }).start();
    }
  }, [isOpen, scale]);

  if (!isOpen) return null;

  return (
    <Modal transparent visible={isOpen} animationType="fade">
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View
          style={[
            styles.modalCard,
            { transform: [{ scale }] },
            LiquidTheme.shadowStrong,
          ]}
        >
          <View style={styles.modalIconCircle}>
            {icon ?? <Text style={styles.modalIconText}>!</Text>}
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={{ height: 12 }} />
          <LiquidButton variant="danger" onPress={onConfirm}>
            {confirmLabel}
          </LiquidButton>
          <View style={{ height: 8 }} />
          <LiquidButton variant="ghost" onPress={onClose}>
            {cancelLabel}
          </LiquidButton>
        </Animated.View>
      </View>
    </Modal>
  );
};

/**
 * LiquidDock (RN)
 * 画面下部のフローティング Dock ナビゲーション
 */
export const LiquidDock: React.FC<{
  tabs: { id: string; icon: React.ReactNode; label?: string }[];
  activeId: string;
  onChange: (id: string) => void;
}> = ({ tabs, activeId, onChange }) => {
  const [width, setWidth] = useState(0);
  const highlightX = useRef(new Animated.Value(0)).current;

  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.id === activeId),
  );

  useEffect(() => {
    if (width === 0 || tabs.length === 0) return;
    const itemWidth = width / tabs.length;
    Animated.spring(highlightX, {
      toValue: activeIndex * itemWidth,
      useNativeDriver: true,
      bounciness: 12,
    }).start();
  }, [activeIndex, width, tabs.length, highlightX]);

  const onLayout = (e: any) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View pointerEvents="box-none" style={styles.dockWrapper}>
      <View style={styles.dockShadowLayer} />
      <LinearGradient
        colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.dock}
        onLayout={onLayout}
      >
        {width > 0 && tabs.length > 0 && (
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
          const isActive = tab.id === activeId;
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
  // Container
  container: {
    flex: 1,
    backgroundColor: LiquidTheme.colors.background,
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

  // Card
  card: {
    borderRadius: LiquidTheme.radius.card,
    overflow: 'hidden',
    backgroundColor: LiquidTheme.colors.cardBg,
    borderWidth: 1,
    borderColor: LiquidTheme.colors.cardBorder,
    ...LiquidTheme.shadowSoft,
  },
  cardTransparent: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  cardInner: {
    position: 'relative',
  },

  // Button
  buttonBase: {
    borderRadius: LiquidTheme.radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: Platform.select({ ios: '700', default: '600' }),
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // Switch
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

  // SegmentControl
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

  // Input
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    ...LiquidTheme.shadowSoft,
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },

  // BottomSheet
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

  // Delete Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(248,113,113,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalIconText: {
    fontSize: 24,
    color: LiquidTheme.colors.danger,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },

  // Dock
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
  dockIconWrapperActive: {
    // RN アイコン側の色指定に任せるので特に色は変えない
  },
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
