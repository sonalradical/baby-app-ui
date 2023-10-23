import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import AppNavigator from './src/navigation/AppNavigator';
import MMColors from './src/helpers/Colors';
import AxiosService from './src/services/AxiosService';
import { store } from './src/redux/Store/configureStores';

export default function App() {

  return (
    <Provider store={store}>
      <RootSiblingParent>
        <SafeAreaView style={[styles.safeArea, { backgroundColor: MMColors.orange }]}>
          <StatusBar backgroundColor={MMColors.orange} />
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