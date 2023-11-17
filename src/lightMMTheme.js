import { DefaultTheme, configureFonts } from 'react-native-paper';

// custom theme
const fontConfig = {
  default: {
    fontFamily: 'MaisonNeue-Book',
    letterSpacing: 0.05,
    fontSize: 15,
    color: '#153634',
  },
  displayLarge: {
    fontSize: 50, // Large headings
    fontWeight: 400, // Bold style for emphasis
    fontFamily: 'MaisonNeue-Book',
    color: '#000',
  },
  headlineMedium: {
    fontSize: 20, // Secondary headings
    fontWeight: 600, // Bold style for emphasis
    color: '#153634',
    fontFamily: 'TangerineRegular',
  },
  displayMedium: {
    fontSize: 20, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: '#153634',
    fontFamily: 'MaisonNeue-Book',
  },
  // Labels
  labelLarge: {
    fontSize: 22, // Secondary headings
    fontWeight: 600, // Bold style for emphasis
    color: '#153634',
    lineHeight: 22,
    fontFamily: 'MaisonNeue-Bold',
  },
  labelMedium: {
    fontSize: 12, // Secondary headings
    fontWeight: 400, // Bold style for emphasis
    color: '#153634',
    fontFamily: 'MaisonNeue-Book',
  },
  headlineSmall: {
    fontSize: 20, // Secondary headings
    fontWeight: 500, // Bold style for emphasis
    color: '#000',
    fontFamily: 'MaisonNeue-Bold',
  },
  titleMedium: {
    fontWeight: 500,
    color: '#153634',
  },
  headlineLarge: {
    fontFamily: 'TangerineRegular',
    fontWeight: 600,
    fontSize: 28, // Secondary headings
    color: '#153634',
  }
};

export const lightMMTheme = {
  ...DefaultTheme,
  roundness: 2, // Define your desired roundness
  colors: {
    ...DefaultTheme.colors,
    primary: '#9E8CCC', // Main primary colors
    secondary: '#F68D43', // Main secondary color
    background: '#F8F4E9', // Default background color
    secondaryContainer: '#FFFFFF',
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