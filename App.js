import React, { useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import MMColors from './src/helpers/Colors';
import AppNavigator from './src/navigation/AppNavigator';
import AxiosService from './src/services/AxiosService';

export default function App() {

  useEffect(() => {
    // Hide the splash screen when your app is ready
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  return (
    <>
      <NativeBaseProvider>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: MMColors.orange }]}>
          <StatusBar backgroundColor={MMColors.orange} />
          <AppNavigator />
        </SafeAreaView>
      </NativeBaseProvider>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});