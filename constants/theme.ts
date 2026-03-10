import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#F6F3E8',
    surface: '#FFFDF7',
    surfaceMuted: '#F0EAD6',
    card: '#FFFFFF',
    cardAlt: '#EEF3E0',
    text: '#27311F',
    textMuted: '#667159',
    border: '#D7DEC6',
    tint: '#6F8F43',
    tintStrong: '#4E6E2E',
    accent: '#A7C957',
    accentSoft: '#E4F0C8',
    warning: '#D98F39',
    success: '#5C8A3A',
    icon: '#718061',
    tabIconDefault: '#829176',
    tabIconSelected: '#4E6E2E',
  },
  dark: {
    background: '#182014',
    surface: '#202A1A',
    surfaceMuted: '#2B3722',
    card: '#27311F',
    cardAlt: '#314127',
    text: '#EEF2E6',
    textMuted: '#B8C4A9',
    border: '#415138',
    tint: '#B6D46B',
    tintStrong: '#D5E994',
    accent: '#8DB44C',
    accentSoft: '#3A4A2B',
    warning: '#E2A85B',
    success: '#A8D06E',
    icon: '#B8C4A9',
    tabIconDefault: '#879478',
    tabIconSelected: '#D5E994',
  },
} as const;

export const AppTheme = {
  radius: {
    sm: 12,
    md: 18,
    lg: 24,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  shadow: Platform.select({
    ios: {
      shadowColor: '#4E6E2E',
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    android: {
      elevation: 3,
    },
    default: {
      elevation: 0,
    },
  }),
  maxContentWidth: 960,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Avenir Next', 'Trebuchet MS', 'Segoe UI', sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Avenir Next Rounded', 'Trebuchet MS', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
});
