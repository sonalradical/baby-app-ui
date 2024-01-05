import React, { useState } from 'react';
import { Animated, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
    const [scaleAnim] = useState(new Animated.Value(0))

    const updateFooterVisibility = (isVisible) => {
        setIsFooterVisible(isVisible);
    };

    React.useEffect(() => {
        Animated.spring(
            scaleAnim,
            {
                toValue: 1,
                friction: 3,
                useNativeDriver: true
            }
        ).start();
    }, [])

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
                    return isFooterVisible && < Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                        <FooterTab navigation={navigation} state={state} descriptors={descriptors} insets={insets} />
                    </Animated.View>
                }}
            >
                <Tab.Screen
                    name="Home"
                    options={{
                        tabBarLabel: 'Chapters',
                        tabBarIcon: ({ color, size }) => {
                            return <MMIcon iconName="bookmarks-outline" iconSize={size} iconColor={color} />;
                        },
                    }}
                >
                    {({ route }) => <Home route={route} updateFooterVisibility={updateFooterVisibility} />}
                </Tab.Screen>
                <Tab.Screen
                    name="MilestoneList"
                    options={{
                        tabBarLabel: 'Milestone',
                        tabBarIcon: ({ color, size }) => {
                            return <MMIcon iconName="flag-outline" iconSize={size} iconColor={color} />;
                        },
                    }}
                >
                    {({ route }) => <MilestoneList route={route} updateFooterVisibility={updateFooterVisibility} />}
                </Tab.Screen>
                <Tab.Screen
                    name="BookPreview"
                    options={{
                        tabBarLabel: 'Book Preview',
                        tabBarIcon: ({ color, size }) => {
                            return <MMIcon iconName="book-outline" iconSize={size} iconColor={color} />;
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
                            return <MMIcon iconName="person-outline" iconSize={size} iconColor={color} />;
                        },
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}