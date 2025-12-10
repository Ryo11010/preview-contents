import React from 'react';
import { Text, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AppButton } from './buttons';
import { COLORS, spacing } from '../../designTokens';
import { styles } from '../../../lib/styles';

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
