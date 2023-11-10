import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useTheme } from 'react-native-paper';

import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen'

import AppNavigator from './src/navigation/AppNavigator';
import AxiosService from './src/services/AxiosService';
import { store } from './src/redux/Store/configureStores';


export default function App() {
  const theme = useTheme()

  useEffect(() => {
    // Hide the splash screen when your app is ready
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <Provider store={store}>
      <RootSiblingParent>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.secondaryContainer }]}>
          <StatusBar backgroundColor={theme.colors.secondaryContainer} barStyle="dark-content" />
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