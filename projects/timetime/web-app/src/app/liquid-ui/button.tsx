import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  StyleProp,
  TextStyle,
  GestureResponderEvent,
  Platform,
} from 'react-native';
import { LiquidTheme } from './theme';

type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'glass' | 'segment';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

type Props = {
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export const LiquidButton: React.FC<Props> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  icon,
  disabled = false,
}) => {
  const isIconOnlyChild =
    size === 'icon' &&
    !icon &&
    React.Children.count(children) === 1 &&
    typeof children !== 'string';

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
        return { backgroundColor: '#fff' };
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
          width: 44,
          height: 44,
          paddingHorizontal: 0,
          paddingVertical: 0,
          borderRadius: 22,
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
        <View
          style={[
            size === 'icon' ? styles.iconOnlyWrapper : styles.iconWrapper,
            children ? styles.iconWithLabel : null,
          ]}
        >
          {icon}
        </View>
      )}
      {children &&
        (isIconOnlyChild ? (
          <View style={styles.iconOnlyWrapper}>{children}</View>
        ) : (
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
        ))}
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOnlyWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWithLabel: {
    marginRight: 8,
  },
});
