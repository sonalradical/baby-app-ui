import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'

import AppNavigator from './src/navigation/AppNavigator';
import MMColors from './src/helpers/Colors';
import AxiosService from './src/services/AxiosService';
import { store } from './src/redux/Store/configureStores';

export default function App() {

  useEffect(() => {
    // Hide the splash screen when your app is ready
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <RootSiblingParent>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: MMColors.secondary }]}>
          <StatusBar backgroundColor={MMColors.secondary} color={MMColors.black} barStyle="dark-content" />
          <AppNavigator />
        </SafeAreaView>
      </RootSiblingParent>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});