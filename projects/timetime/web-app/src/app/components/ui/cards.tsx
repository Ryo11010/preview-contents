import React from 'react';
import { LayoutChangeEvent, View, Text } from 'react-native';
import { COLORS, spacing } from '../../designTokens';
import { styles } from '../../styles';
import { LiquidCard } from '../../liquid-ui';

type GlassCardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  padding?: number;
  shadowless?: boolean;
  transparent?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  onPress,
  style,
  padding,
  shadowless,
  transparent,
  onLayout,
}) => (
  <LiquidCard
    onPress={onPress}
    padding={padding ?? spacing.md}
    style={style}
    transparent={transparent ?? false}
    shadowless={shadowless}
    onLayout={onLayout}
  >
    {children}
  </LiquidCard>
);

type CardSurfaceProps = GlassCardProps & {
  shadowless?: boolean;
  variant?: 'default' | 'menu' | 'admin';
};

export const CardSurface: React.FC<CardSurfaceProps> = ({
  style,
  shadowless,
  padding,
  variant = 'default',
  ...rest
}) => {
  const shadowStyle = shadowless
    ? null
    : variant === 'admin'
      ? styles.cardShadowAdmin
      : variant === 'menu'
        ? styles.cardShadowMenu
        : styles.cardShadowSoft;
  return (
    <GlassCard
      padding={padding}
      shadowless={shadowless}
      style={[shadowStyle, style]}
      {...rest}
    />
  );
};

type SectionCardProps = CardSurfaceProps & {
  title?: string;
  action?: React.ReactNode;
  bodyStyle?: any;
};

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  action,
  children,
  style,
  bodyStyle,
  padding,
  variant = 'default',
  ...rest
}) => (
  <CardSurface
    padding={padding ?? spacing.md}
    variant={variant}
    style={[styles.sectionCard, style]}
    {...rest}
  >
    {(title || action) && (
      <View style={styles.sectionCardHeader}>
        {title ? <Text style={styles.sectionCardTitle}>{title}</Text> : <View />}
        {action}
      </View>
    )}
    <View style={[styles.sectionCardBody, bodyStyle]}>{children}</View>
  </CardSurface>
);

type StatCardProps = CardSurfaceProps & {
  label: string;
  value: React.ReactNode;
  suffix?: string;
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  suffix,
  style,
  children,
  padding,
  ...rest
}) => (
  <CardSurface
    padding={padding ?? spacing.md}
    style={[styles.adminStatCard, style]}
    {...rest}
  >
    <Text style={styles.adminStatLabel}>{label}</Text>
    <Text style={styles.adminStatValue}>
      {value}
      {suffix ? <Text style={styles.adminStatSuffix}>{suffix}</Text> : null}
    </Text>
    {children}
  </CardSurface>
);

