import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, ChevronDown } from 'lucide-react-native';
import { COLORS } from '../designTokens';
import { styles } from '../../lib/styles';

type MenuSurfaceProps = {
  gradient: string[];
  children: ReactNode;
  style?: any;
};

export const MenuSurface: React.FC<MenuSurfaceProps> = ({
  gradient,
  children,
  style,
}) => (
  <View style={[styles.menuSurface, style]}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.menuCardBg}
    />
    {children}
  </View>
);

const useAccordionAnimation = (open: boolean) => {
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: open ? 1 : 0,
      useNativeDriver: false,
      bounciness: 10,
      speed: 14,
    }).start();
  }, [anim, open]);

  const contentStyle = {
    height: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.max(contentHeight, 1)],
    }),
    opacity: anim,
    pointerEvents: open ? 'auto' : 'none',
  };

  const arrowStyle = {
    transform: [
      {
        rotate: anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  return {
    arrowStyle,
    contentStyle,
    onLayout: (e: LayoutChangeEvent) =>
      setContentHeight(e.nativeEvent.layout.height),
  };
};

type MenuAccordionProps = {
  open: boolean;
  onToggle: () => void;
  icon: ReactNode;
  label: string;
  title: string;
  gradient: string[];
  iconWrapperStyle?: any;
  children: ReactNode;
};

export const MenuAccordion: React.FC<MenuAccordionProps> = ({
  open,
  onToggle,
  icon,
  label,
  title,
  gradient,
  iconWrapperStyle,
  children,
}) => {
  const { arrowStyle, contentStyle, onLayout } = useAccordionAnimation(open);

  return (
    <MenuSurface gradient={gradient} style={styles.menuAccordionCard}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          styles.menuAccordionHeader,
          pressed && styles.menuAccordionHeaderPressed,
        ]}
      >
        <View style={[styles.menuAccordionIconWrapper, iconWrapperStyle]}>
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuAccordionLabel}>{label}</Text>
          <Text style={styles.menuAccordionTitle}>{title}</Text>
        </View>
        <Animated.View style={arrowStyle}>
          <ChevronDown size={18} color={COLORS.textSub} />
        </Animated.View>
      </Pressable>

      <Animated.View
        style={[styles.menuAccordionContentWrapper, contentStyle]}
      >
        <View style={styles.menuAccordionContent} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    </MenuSurface>
  );
};

type MenuListItemProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export const MenuListItem: React.FC<MenuListItemProps> = ({
  label,
  active,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuListRow,
      active && styles.menuListRowActive,
      pressed && { backgroundColor: 'rgba(0,122,255,0.07)' },
    ]}
  >
    <Text
      style={[styles.menuListLabel, active && styles.menuListLabelActive]}
    >
      {label}
    </Text>
    {active ? <Check size={16} color={COLORS.primary} /> : null}
  </Pressable>
);

type MenuSubItemProps = {
  label: string;
  color: string;
  icon: ReactNode;
  onPress: () => void;
};

export const MenuSubItem: React.FC<MenuSubItemProps> = ({
  label,
  color,
  icon,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuSubItem,
      pressed && { backgroundColor: 'rgba(0,122,255,0.07)' },
    ]}
  >
    <View
      style={[
        styles.menuSubItemIcon,
        { backgroundColor: `${color}15` },
      ]}
    >
      {icon}
    </View>
    <Text style={styles.menuSubItemLabel}>{label}</Text>
  </Pressable>
);

type MenuQuickActionProps = {
  label: string;
  subLabel: string;
  icon: ReactNode;
  iconColor: string;
  gradient: string[];
  onPress: () => void;
};

export const MenuQuickAction: React.FC<MenuQuickActionProps> = ({
  label,
  subLabel,
  icon,
  iconColor,
  gradient,
  onPress,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuQuickActionPressable,
      pressed && styles.menuQuickActionPressablePressed,
    ]}
  >
    <MenuSurface gradient={gradient} style={styles.menuQuickActionCard}>
      <View
        style={[
          styles.menuQuickActionIcon,
          { backgroundColor: `${iconColor}15` },
        ]}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.menuQuickActionTitle}>{label}</Text>
        <Text style={styles.menuQuickActionSub}>{subLabel}</Text>
      </View>
      <ChevronDown
        size={18}
        color={COLORS.textSub}
        style={{ transform: [{ rotate: '-90deg' }] }}
      />
    </MenuSurface>
  </Pressable>
);
