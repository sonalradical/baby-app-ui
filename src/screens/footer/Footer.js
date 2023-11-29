import React, { useState } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import MMIcon from '../../components/common/Icon';
import FooterTab from './FooterTab';
import Home from '../home/Home';
import MilestoneList from '../milestone/MilestoneList';
import BookPreview from '../book/BookPreview';
import Profile from '../Profile/Profile';

const Tab = createBottomTabNavigator();

export default function Footer() {
    const theme = useTheme();
    const [isFooterVisible, setIsFooterVisible] = useState(true);

    const updateFooterVisibility = (isVisible) => {
        setIsFooterVisible(isVisible);
    };

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
                    return isFooterVisible && < Animated.View style={{ opacity: isFooterVisible ? 1 : 0 }}>
                        <FooterTab navigation={navigation} state={state} descriptors={descriptors} insets={insets} />
                    </Animated.View>
                }}
            >
                <Tab.Screen
                    name="Home"
                    options={{
                        tabBarLabel: 'Chapters',
                        tabBarIcon: ({ color, size }) => {
                            return <Ionicons name="bookmarks-outline" size={size} color={color} />;
                        },
                    }}
                >
                    {({ route }) => <Home route={route} updateFooterVisibility={updateFooterVisibility} />}
                </Tab.Screen>
                <Tab.Screen
                    name="MilestoneList"
                    options={{
                        tabBarLabel: 'Milestone',
                        tabBarIcon: ({ color, size }) => <Icon name="flag" size={size} color={color} />,
                    }}
                >
                    {({ route }) => <MilestoneList route={route} updateFooterVisibility={updateFooterVisibility} />}
                </Tab.Screen>
                <Tab.Screen
                    name="BookPreview"
                    options={{
                        tabBarLabel: 'Book Preview',
                        tabBarIcon: ({ color, size }) => {
                            return <Icon name="book-open" size={size} color={color} />;
                        },
                    }}
                >
                    {({ route }) => <BookPreview route={route} updateFooterVisibility={updateFooterVisibility} />}
                </Tab.Screen>
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