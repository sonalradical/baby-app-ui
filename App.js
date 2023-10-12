import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import MMColors from './src/helpers/Colors';
import AxiosService from './src/services/AxiosService';


export default function App() {

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