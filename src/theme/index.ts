import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 14,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32',
    secondary: '#00639A',
    tertiary: '#7A5E00',
    surface: '#FFFFFF',
    background: '#F6F8FB',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 14,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#76D97E',
    secondary: '#8DCDFF',
    tertiary: '#F3C764',
    surface: '#171A1F',
    background: '#0E1014',
  },
};

