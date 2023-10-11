/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import AppNavigator from './src/navigation/AppNavigator';
import MMColors from './src/helpers/Colors';


export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <RootSiblingParent>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: MMColors.orange }]}>
        <StatusBar backgroundColor={MMColors.orange} />
        <AppNavigator />
      </SafeAreaView>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});