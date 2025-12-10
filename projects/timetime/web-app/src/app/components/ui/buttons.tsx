import React from 'react';
import { Text, View } from 'react-native';
import type { IconComponent } from '../../types';
import { LiquidButton, LiquidSwitch } from '../../liquid-ui';
import { COLORS } from '../../designTokens';
import { styles } from '../../styles';

type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'glass';
type ButtonSize = 'md' | 'sm' | 'icon';

type AppButtonProps = {
  children?: React.ReactNode;
  icon?: IconComponent;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress?: () => void;
  style?: any;
  disabled?: boolean;
};

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  onPress,
  style,
  disabled,
}) => {
  const iconColor =
    variant === 'primary'
      ? '#fff'
      : variant === 'danger'
        ? COLORS.danger
        : COLORS.textSub;
  const iconElement = Icon ? (
    <Icon
      size={size === 'sm' ? 16 : size === 'icon' ? 18 : 20}
      color={iconColor}
    />
  ) : undefined;
  const sizeMap: Record<ButtonSize, 'sm' | 'md' | 'lg' | 'icon'> = {
    sm: 'sm',
    md: 'md',
    icon: 'icon',
  };

  return (
    <LiquidButton
      onPress={onPress}
      variant={variant}
      size={sizeMap[size] ?? 'md'}
      icon={iconElement}
      disabled={disabled}
      style={style}
    >
      {children}
    </LiquidButton>
  );
};

export const AppSwitch: React.FC<{ isOn: boolean; onToggle: () => void }> = ({
  isOn,
  onToggle,
}) => <LiquidSwitch value={isOn} onValueChange={onToggle} />;

export const RoleChip: React.FC<{ role: string }> = ({ role }) => (
  <View style={styles.roleChip}>
    <Text style={styles.roleChipText}>{role}</Text>
  </View>
);

