import { DefaultTheme, configureFonts } from 'react-native-paper';

// custom theme
const fontConfig = {
  default: {
    fontFamily: 'Maison Neue',
    letterSpacing: 0.05,
  },
  displayLarge: {
    fontSize: 50, // Large headings
    fontWeight: 400, // Bold style for emphasis
    fontFamily: 'Wulkan display',
    color: '#000',
  },
  headlineMedium: {
    fontSize: 20, // Secondary headings
    fontWeight: 700, // Bold style for emphasis
    color: '#153634',
    fontFamily: 'Maison Neue',
  },
  displayMedium: {
    fontSize: 20, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: '#153634',
    fontFamily: 'Maison Neue',
  },
  // Labels
  labelLarge: {
    fontSize: 15, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: '#153634',
    fontFamily: 'Maison Neue',
  },
  labelMedium: {
    fontSize: 12, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: '#000',
    fontFamily: 'Wulkan display',
  },
  headlineSmall: {
    fontSize: 20, // Secondary headings
    fontWeight: 500, // Bold style for emphasis
    color: '#000',
    fontFamily: 'Wulkan display',
  },
  titleMedium: {
    fontWeight: 700,
    color: '#153634',
  },
  headlineLarge: {
    fontFamily: 'Wulkan display',
    color: '#000',
  }
};

export const lightMMTheme = {
  ...DefaultTheme,
  roundness: 2, // Define your desired roundness
  colors: {
    ...DefaultTheme.colors,
    primary: '#9E8CCC', // Main primary colors
    accent: '#F68D43', // Main secondary color
    background: '#F8F4E9', // Default background color
    text: {
      primary: '#153634', // Primary text color
      hint: '#C1C1C1', // Hint text color
      disabled: 'rgba(168,128,128,0.38)', // Disabled text color
      secondary: '#000', // Secondary text color
    },
  },
  fonts: configureFonts({ config: fontConfig }),
};

export default lightMMTheme;