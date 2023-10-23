import React from 'react';
import { BackHandler } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PropTypes from 'prop-types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MMUtils from '../../helpers/Utils';
import FooterTab from './FooterTab';
import Home from '../home/Home';
import ChapterList from '../chapter/ChapterList';

export default function Footer({ navigation }) {
    const Tab = createBottomTabNavigator();
    return (
        <SafeAreaProvider>
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={{
                    headerShown: false,
                }}
                tabBar={(props) => <FooterTab {...props} />}
            >
                <Tab.Screen name="Home" component={Home}
                    listeners={{
                        focus: () => BackHandler.addEventListener('hardwareBackPress', MMUtils.handleBackButton)
                        , blur: () => BackHandler.removeEventListener('hardwareBackPress', MMUtils.handleBackButton)
                    }} />
                <Tab.Screen name="ChapterList" component={ChapterList}
                    listeners={{
                        focus: () => BackHandler.addEventListener('hardwareBackPress', MMUtils.handleBackButton)
                        , blur: () => BackHandler.removeEventListener('hardwareBackPress', MMUtils.handleBackButton)
                    }} />

            </Tab.Navigator>
        </SafeAreaProvider>
    );
}

Footer.propTypes = {
    navigation: PropTypes.object,
};
