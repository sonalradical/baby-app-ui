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
import MMApiService from './src/services/ApiService';
import { store } from './src/redux/Store/configureStores';
import { setLookupData } from './src/redux/Slice/AuthSlice';
const { dispatch } = store;


export default function App() {
  const theme = useTheme()

  useEffect(() => {
    getLookupData();
    // Hide the splash screen when your app is ready
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  const getLookupData = async () => {
    const response = await MMApiService.getLookupData();
    const lookupData = response.data;
    if (lookupData) {
      dispatch(setLookupData(lookupData));
    }
  }

  return (
    <Provider store={store}>
      <RootSiblingParent>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.onPrimary }]}>
          <StatusBar backgroundColor={theme.colors.onPrimary} barStyle="dark-content" />
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