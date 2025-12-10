import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import { Check, ChevronDown, Search as SearchIcon } from 'lucide-react-native';
import { createPortal } from 'react-dom';
import { LiquidSegmentControl } from '../../liquid-ui';
import { GlassCard } from './cards';
import { COLORS, spacing } from '../../designTokens';
import type { IconComponent, ViewMode } from '../../types';
import { styles } from '../../styles';
import { useTextFieldFocus } from '../../hooks/useTextFieldFocus';

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
    <FieldWrapper style={style}>
      <GlassCard style={[styles.searchCard, focused && styles.inputFocusFrame]} shadowless>
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
    </FieldWrapper>
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
  const { height: windowHeight } = useWindowDimensions();
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

  const availableBelow =
    anchorRect != null
      ? windowHeight - anchorRect.y - anchorRect.height - spacing.md
      : undefined;
  const dropdownListStyle =
    availableBelow != null
      ? { maxHeight: Math.max(160, Math.min(availableBelow, 320)) }
      : undefined;

  const optionItems = options.map((opt) => {
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
  });

  const dropdown = (
    <View style={[styles.selectDropdown, styles.cardShadowSoft]}>
      <ScrollView style={[styles.selectList, dropdownListStyle]}>
        {optionItems}
      </ScrollView>
    </View>
  );

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
                      <ScrollView style={[styles.selectList, dropdownListStyle]}>
                        {optionItems}
                      </ScrollView>
                    </View>
                  </>,
                  document.body,
                )
              : null}
            {Platform.OS === 'web' && !anchorRect && (
              <>
                <Pressable
                  style={styles.selectBackdrop}
                  onPress={() => setOpen(false)}
                />
                {dropdown}
              </>
            )}
            {Platform.OS !== 'web' && (
              <Modal
                visible
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
              >
                <View style={styles.selectModalOverlay}>
                  <Pressable
                    style={styles.selectBackdrop}
                    onPress={() => setOpen(false)}
                  />
                  {anchorRect ? (
                    <View
                      style={[
                        styles.selectDropdown,
                        styles.cardShadowSoft,
                        styles.selectDropdownFloating,
                        {
                          top: anchorRect.y + anchorRect.height + spacing.xs,
                          left: anchorRect.x,
                          width: anchorRect.width,
                        },
                      ]}
                    >
                      <ScrollView style={[styles.selectList, dropdownListStyle]}>
                        {optionItems}
                      </ScrollView>
                    </View>
                  ) : (
                    dropdown
                  )}
                </View>
              </Modal>
            )}
          </>
        )}
      </View>
    </FieldWrapper>
  );
};
