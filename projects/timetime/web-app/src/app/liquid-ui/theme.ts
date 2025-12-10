import { Dimensions, Platform } from 'react-native';

export const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
export const isWeb = Platform.OS === 'web';
export const nativeDriver = Platform.OS !== 'web';

const shadowStrong = isWeb
  ? {
      boxShadow:
        '0 18px 30px rgba(0,0,0,0.14), 0 8px 18px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
    }
  : {
      shadowColor: '#000',
      shadowOpacity: 0.16,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 12,
    };

const shadowSoft = isWeb
  ? {
      boxShadow:
        '0 14px 22px rgba(0,0,0,0.12), 0 6px 14px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)',
    }
  : {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    };

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
  shadowStrong,
  shadowSoft,
};

export type LiquidThemeType = typeof LiquidTheme;
