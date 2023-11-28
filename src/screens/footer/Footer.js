import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import MMIcon from '../../components/common/Icon';
import FooterTab from './FooterTab';
import Home from '../home/Home';
import MilestoneList from '../milestone/MilestoneList';
import BookPreview from '../book/BookPreview';
import Profile from '../Profile/Profile';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function Footer() {
    const theme = useTheme();
    return (
        <View style={{
            flex: 1, backgroundColor: theme.colors.background, elevation: 20,
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: -2, height: 4 }
        }}>
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
                        tabBarLabel: 'Chapters',
                        tabBarIcon: ({ color, size }) => {
                            return <Ionicons name="bookmarks-outline" size={size} color={color} />;
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
                <Tab.Screen
                    name="BookPreview"
                    component={BookPreview}
                    options={{
                        tabBarLabel: 'Book Preview',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="book-open" size={size} color={color} />;
                        },
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color, size }) => {
                            return <MMIcon iconName="user-o" iconSize={size} iconColor={color} />;
                        },
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}