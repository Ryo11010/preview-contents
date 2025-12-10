import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTextFieldFocus } from '../hooks/useTextFieldFocus';
import { LiquidTheme, isWeb } from './theme';

type Props = TextInputProps & {
  leftIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export const LiquidInput: React.FC<Props> = ({
  leftIcon,
  containerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const { focused, baseInputProps } = useTextFieldFocus({ onFocus, onBlur });
  const iconTint = focused ? LiquidTheme.colors.primary : '#9CA3AF';

  return (
    <View
      style={[
        styles.inputContainer,
        focused && styles.inputContainerFocused,
        containerStyle,
      ]}
    >
      {leftIcon && (
        <View style={styles.inputIcon}>
          {React.isValidElement(leftIcon)
            ? React.cloneElement(leftIcon as any, { color: iconTint })
            : leftIcon}
        </View>
      )}
      <TextInput
        {...baseInputProps}
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

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    ...LiquidTheme.shadowSoft,
  },
  inputContainerFocused: {
    borderColor: LiquidTheme.colors.primary,
    ...(isWeb
      ? { boxShadow: '0 0 0 2px rgba(0,122,255,0.16)' }
      : {
          shadowColor: LiquidTheme.colors.primary,
          shadowOpacity: 0.18,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        }),
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
});

