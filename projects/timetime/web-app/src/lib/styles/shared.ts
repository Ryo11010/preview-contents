import { Dimensions, Platform, StyleSheet } from 'react-native';
import { COLORS, layout, radius, spacing } from '../../app/designTokens';
import { LOGIN_COLORS, LOGIN_FONT_SIZES, LOGIN_RADIUS, LOGIN_SPACING } from '../../app/styleConstants';
import { LiquidTheme } from '../../app/liquid-ui';

export const isWeb = Platform.OS === 'web';
export const webFixedPosition = (isWeb ? 'fixed' : 'absolute') as any;
const { height: WINDOW_HEIGHT } = Dimensions.get('window');
export const SCROLL_MIN_HEIGHT = WINDOW_HEIGHT + spacing.lg;

export const commonShadow = LiquidTheme.shadowSoft;

export const inputShell = {
  borderWidth: 1,
  borderColor: COLORS.cardBorder,
  backgroundColor: '#fff',
  borderRadius: radius.lg,
};

export const inputTextBase = {
  color: COLORS.textMain,
  outlineStyle: 'none' as const,
  outlineWidth: 0,
};

export const inputFocusFrameStyle = {
  borderColor: COLORS.primary,
  ...(isWeb
    ? {
        boxShadow: '0 0 0 2px rgba(0,122,255,0.16)',
      }
    : {
        shadowColor: COLORS.primary,
        shadowOpacity: 0.16,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }),
};

export const menuCardShadow = isWeb
  ? {
      boxShadow:
        '0 12px 24px -14px rgba(0,0,0,0.16), 0 6px 14px -12px rgba(0,0,0,0.12)',
    }
  : {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    };

export const adminCardShadow = isWeb
  ? {
      boxShadow:
        '0 10px 22px -16px rgba(0,0,0,0.16), 0 6px 12px -14px rgba(0,0,0,0.12)',
    }
  : {
      shadowColor: '#000',
      shadowOpacity: 0.07,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 6 },
      elevation: 5,
    };

export const selectBackdropPosition = (isWeb ? 'fixed' : 'absolute') as any;

export const sharedImports = {
  StyleSheet,
  COLORS,
  layout,
  radius,
  spacing,
  LOGIN_COLORS,
  LOGIN_FONT_SIZES,
  LOGIN_RADIUS,
  LOGIN_SPACING,
};
