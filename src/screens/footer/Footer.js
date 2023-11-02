import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather'

import FooterTab from './FooterTab';
import MMIcon from '../../components/common/Icon';
import Home from '../home/Home';
import MilestoneList from '../milestone/MilestoneList';

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
                        return <Icon name="home" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                name="MilestoneList"
                component={MilestoneList}
                options={{
                    tabBarLabel: 'Milestone',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="flag" size={size} color={color} />;
                    },
                }}
            />
            {/* <Tab.Screen
                //name="ChapterList"
                //component={ChapterList}
                options={{
                    tabBarLabel: 'Book Preview',
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name="book-open" size={size} color={color} />;
                    },
                }}
            />
            <Tab.Screen
                // name="ChapterList"
                //component={ChapterList}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => {
                        return <MMIcon iconName="user-o" iconSize={size} iconColor={color} />;
                    },
                }}
            /> */}
        </Tab.Navigator>
    );
}