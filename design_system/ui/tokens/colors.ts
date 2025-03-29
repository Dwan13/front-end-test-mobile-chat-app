import { useColorScheme } from '@/hooks/useColorScheme';

const baseColors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    black: '#000000',
  },
  background: {
    paper: '#F5F5F5',
    elevated: '#FFFFFF',
    black: '#000000',
  },
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(255, 255, 255, 0.1)',
  },
  border: {
    default: '#E0E0E0',
  },
};

// Paletas de colores temáticos
const themeColors = {
  light: {
    textInverse: '#000000',
    backgroundDefault: '#FFFFFF',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    textInverse: '#FFFFFF',
    backgroundDefault: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
} as const;

// Hook que devuelve los colores del tema actual
export const getColors = () => {
  const theme = useColorScheme() ?? 'light';

  return {
    ...baseColors,
    text: {
      ...baseColors.text,
      inverse: themeColors[theme].textInverse, // Asigna solo el valor correcto
    },
    background: {
      ...baseColors.background,
      default: themeColors[theme].backgroundDefault,
    },
    ...themeColors[theme],
  };
};

export const colors = getColors();
