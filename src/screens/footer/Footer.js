import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../home/Home';
import ChapterList from '../chapter/ChapterList';
import MMIcon from '../../components/common/Icon';
import FooterTab from './FooterTab';

const Tab = createBottomTabNavigator();

export default function Footer() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
            }}
            tabBar={({ navigation, state, descriptors, insets }) => {
                return <FooterTab navigation={navigation} state={state} descriptors={descriptors} insets={insets} />
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => {
                        return <MMIcon iconName="home" iconSize={size} iconColor={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="ChapterList"
                component={ChapterList}
                options={{
                    tabBarLabel: 'Chapter',
                    tabBarIcon: ({ color, size }) => {
                        return <MMIcon iconName="book" iconSize={size} iconColor={color} />;
                    },
                }}
            />
        </Tab.Navigator>
    );
}