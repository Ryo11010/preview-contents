import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Search as SearchIcon,
} from 'lucide-react-native';
import {
  LiquidButton,
  LiquidCard,
  LiquidSegmentControl,
  LiquidSwitch,
} from '../liquid-ui/liquid-ui_RN';
import { COLORS, spacing } from '../designTokens';
import { PUNCH_TYPE_META } from '../punchMeta';
import type { HistoryEvent, IconComponent, ViewMode } from '../types';
import { styles } from '../styles';
import { useTextFieldFocus } from '../hooks/useTextFieldFocus';
import { createPortal } from 'react-dom';
import { Platform } from 'react-native';

type ButtonVariant = 'primary' | 'danger' | 'ghost' | 'glass';
type ButtonSize = 'md' | 'sm' | 'icon';

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

type SegmentOption = string | { value: string; label: string };
type SegmentControlProps = {
  options: SegmentOption[];
  selected: string | ViewMode;
  onSelect: (value: string) => void;
};

export const SegmentControl: React.FC<SegmentControlProps> = ({
  options,
  selected,
  onSelect,
}) => {
  const normalized = useMemo(
    () =>
      options.map((o) =>
        typeof o === 'string'
          ? { value: o, label: o }
          : { value: o.value, label: o.label },
      ),
    [options],
  );

  return (
    <LiquidSegmentControl
      options={normalized}
      value={String(selected)}
      onChange={onSelect}
    />
  );
};

const FieldWrapper: React.FC<{
  label?: string;
  style?: any;
  children: React.ReactNode;
}> = ({ label, style, children }) => (
  <View style={[styles.fieldContainer, style]}>
    {label && <Text style={styles.fieldLabel}>{label}</Text>}
    {children}
  </View>
);

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  style?: any;
};

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  style,
}) => {
  const { focused, baseInputProps } = useTextFieldFocus();
  const iconColor = focused ? COLORS.primary : COLORS.textSub;

  return (
    <GlassCard style={[styles.searchCard, focused && styles.inputFocusFrame, style]} shadowless>
      <View style={styles.searchRow}>
        <SearchIcon size={16} color={iconColor} />
        <TextInput
          {...baseInputProps}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder ?? '氏名・メール・所属で検索'}
          placeholderTextColor={COLORS.textSub}
          style={styles.searchInput}
        />
      </View>
    </GlassCard>
  );
};

type TextFieldProps = {
  label?: string;
  icon?: IconComponent;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  style?: any;
  onFocus?: () => void;
  onBlur?: () => void;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
};

export const TextField: React.FC<TextFieldProps> = ({
  label,
  icon: Icon,
  placeholder,
  value,
  onChange,
  secureTextEntry,
  keyboardType,
  style,
  onFocus,
  onBlur,
  autoCapitalize,
  autoCorrect,
}) => {
  const { focused, baseInputProps } = useTextFieldFocus({ onFocus, onBlur });
  const iconColor = focused ? COLORS.primary : COLORS.textSub;

  return (
    <FieldWrapper label={label} style={style}>
      <View style={[styles.fieldInner, focused && styles.inputFocusFrame]}>
        {Icon && (
          <Icon size={18} color={iconColor} style={{ marginRight: spacing.xs }} />
        )}
        <TextInput
          {...baseInputProps}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          style={styles.fieldInput}
          placeholderTextColor={COLORS.textSub}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect ?? baseInputProps.autoCorrect}
        />
      </View>
    </FieldWrapper>
  );
};

export type SelectOption = { value: string; label: string };

type SelectFieldProps = {
  label?: string;
  icon?: IconComponent;
  options: SelectOption[];
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: any;
};

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const hasOptions = options.length > 0;
  const text = hasOptions
    ? selected?.label ?? placeholder ?? '選択してください'
    : '選択できません';
  const anchorRef = useRef<View>(null);
  const [anchorRect, setAnchorRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const measureAnchor = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorRect({ x, y, width, height });
    });
  };

  useEffect(() => {
    if (!open) return;
    // re-measure on next frame to account for modal animations or layout shifts
    requestAnimationFrame(measureAnchor);
    measureAnchor();
    if (Platform.OS !== 'web') return;
    const handleRecalc = () => measureAnchor();
    window.addEventListener('scroll', handleRecalc, true);
    window.addEventListener('resize', handleRecalc);
    return () => {
      window.removeEventListener('scroll', handleRecalc, true);
      window.removeEventListener('resize', handleRecalc);
    };
  }, [open]);

  return (
    <FieldWrapper label={label} style={style}>
      <View
        ref={anchorRef}
        style={[styles.selectContainer, open && styles.selectContainerOpen]}
      >
        <Pressable
          disabled={!hasOptions}
          onPress={() => {
            measureAnchor();
            setOpen((o) => !o);
          }}
          style={({ pressed }) => [
            styles.selectField,
            open && styles.selectFieldOpen,
            pressed && hasOptions && styles.selectFieldPressed,
            !hasOptions && styles.selectFieldDisabled,
          ]}
        >
          {Icon && <Icon size={18} color={COLORS.textSub} />}
          <Text
            style={
              hasOptions
                ? selected
                  ? styles.selectValueText
                  : styles.selectPlaceholderText
                : styles.selectDisabledText
            }
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text}
          </Text>
          <ChevronDown
            size={16}
            color={COLORS.textSub}
            style={open ? { transform: [{ rotate: '180deg' }] } : undefined}
          />
        </Pressable>
        {open && (
          <>
            {Platform.OS === 'web' && anchorRect
              ? createPortal(
                  <>
                    <Pressable
                      style={styles.selectBackdrop}
                      onPress={() => setOpen(false)}
                    />
                    <View
                      style={[
                        styles.selectDropdown,
                        styles.cardShadowSoft,
                        {
                          position: 'fixed',
                          top: anchorRect.y + anchorRect.height + spacing.xs,
                          left: anchorRect.x,
                          width: anchorRect.width,
                        },
                      ]}
                    >
                      <ScrollView style={styles.selectList}>
                        {options.map((opt) => {
                          const isActive = opt.value === value;
                          return (
                            <Pressable
                              key={opt.value}
                              onPress={() => {
                                onChange?.(opt.value);
                                setOpen(false);
                              }}
                              style={({ pressed }) => [
                                styles.selectItem,
                                (pressed || isActive) && styles.selectItemActive,
                              ]}
                            >
                              <Text style={styles.selectItemLabel}>{opt.label}</Text>
                              {isActive && <Check size={16} color={COLORS.primary} />}
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </>,
                  document.body,
                )
              : (
                  <>
                    <Pressable
                      style={styles.selectBackdrop}
                      onPress={() => setOpen(false)}
                    />
                    <View style={[styles.selectDropdown, styles.cardShadowSoft]}>
                      <ScrollView style={styles.selectList}>
                        {options.map((opt) => {
                          const isActive = opt.value === value;
                          return (
                            <Pressable
                              key={opt.value}
                              onPress={() => {
                                onChange?.(opt.value);
                                setOpen(false);
                              }}
                              style={({ pressed }) => [
                                styles.selectItem,
                                (pressed || isActive) && styles.selectItemActive,
                              ]}
                            >
                              <Text style={styles.selectItemLabel}>{opt.label}</Text>
                              {isActive && <Check size={16} color={COLORS.primary} />}
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </View>
                  </>
                )}
          </>
        )}
      </View>
    </FieldWrapper>
  );
};

type DateNavigatorProps = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  style?: any;
};

export const DateNavigator: React.FC<DateNavigatorProps> = ({
  label,
  onPrev,
  onNext,
  style,
}) => (
  <View style={[styles.dateNavRoot, style]}>
    <AppButton variant="ghost" size="icon" onPress={onPrev}>
      <ChevronLeft size={22} color={COLORS.textMain} />
    </AppButton>
    <Text style={styles.dateNavLabel}>{label}</Text>
    <AppButton variant="ghost" size="icon" onPress={onNext}>
      <ChevronRight size={22} color={COLORS.textMain} />
    </AppButton>
  </View>
);

type TimelineItemProps = { event: HistoryEvent; isLast: boolean };

export const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast }) => {
  const meta = PUNCH_TYPE_META[event.punchType];
  const Icon = meta.icon;
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineIconColumn}>
        <View style={[styles.timelineDot, { backgroundColor: meta.color }]}>
          <Icon size={14} color="#fff" />
        </View>
        {!isLast && <View style={styles.timelineLine} />}
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineTitle, { color: meta.color }]}>
          {meta.label}
          {event.valid && <Text> ✓</Text>}
        </Text>
        <Text style={styles.timelineSub}>
          {event.punchType.includes('break') ? 'Break Time' : 'Work Time'}
        </Text>
      </View>
      <View style={styles.timelineTimeColumn}>
        <Text style={styles.timelineTime}>{event.time}</Text>
      </View>
    </View>
  );
};

type SettingsHeaderProps = {
  title: string;
  onBack?: () => void;
  action?: React.ReactNode;
};

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  title,
  onBack,
  action,
}) => (
  <View style={styles.settingsHeaderRoot}>
    <View style={styles.settingsHeaderLeft}>
      {onBack && (
        <AppButton
          variant="ghost"
          size="icon"
          onPress={onBack}
          style={{
            marginRight: spacing.sm,
            boxShadow: 'none',
            shadowColor: 'transparent',
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
          }}
        >
          <ChevronLeft size={22} color={COLORS.textMain} />
        </AppButton>
      )}
      <Text style={styles.settingsHeaderTitle}>{title}</Text>
    </View>
    {action}
  </View>
);
