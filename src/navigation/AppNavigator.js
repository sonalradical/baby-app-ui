// navigation library
import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '../services/NavigationServices';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { setLogin } from '../redux/Slice/AuthSlice';

import MMConstants from '../helpers/Constants';
import MMUtils from '../helpers/Utils';

import MMSpinner from '../components/common/Spinner';

// auth screens
import Login from '../screens/auth/Login';
import OTPView from '../screens/auth/OTPView';
import SignUp from '../screens/auth/SignUp';

// app screens
import Home from '../screens/home/Home';
import AddBaby from '../screens/babyProfile/AddBaby';
import Logout from '../screens/auth/Logout';
import ChapterList from '../screens/chapter/ChapterList';
import Quiz from '../screens/quiz/Quiz';
import Footer from '../screens/footer/Footer';
import Header from '../screens/header/Header';

// Auth Stack Screens
const AuthStack = createStackNavigator();
function AuthStackNavigator() {
    return (
        <NavigationContainer independent>
            <AuthStack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false
                }}
            >
                <AuthStack.Screen name="Login" component={Login} />
                <AuthStack.Screen name="SignUp" component={SignUp} />
                <AuthStack.Screen name="Otp" component={OTPView} />
            </AuthStack.Navigator>
        </NavigationContainer>
    );
}


// App Stack 
const AppStack = createStackNavigator();
function AppStackNavigator() {
    return (
        <NavigationContainer independent>
            <AppStack.Navigator
                initialRouteName="Footer"
                screenOptions={{
                    header: (props) => <Header {...props} />
                }}
            >
                <AppStack.Screen
                    name="Logout"
                    component={Logout}
                />
                <AppStack.Screen
                    name="AddBaby"
                    component={AddBaby}
                    options={{ headerShown: false }}
                />
                <AppStack.Screen
                    name="ChapterList"
                    component={ChapterList}
                    options={{ headerShown: false }}
                />
                <AppStack.Screen
                    name="Quiz"
                    component={Quiz}
                    options={{ headerShown: false }}
                />
                <AppStack.Screen
                    name="Footer"
                    component={Footer}
                />

            </AppStack.Navigator>
        </NavigationContainer>
    );
}

export default function AppNavigator() {
    const { isLoading, isLoggedOut, accessToken } = useSelector((state) => state.AuthReducer.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        initApp();
    }, []);

    const initApp = async () => {
        const accessToken = await MMUtils.getItemFromStorage(MMConstants.storage.accessToken);
        const existingUserDetail = await MMUtils.getItemFromStorage(MMConstants.storage.userDetail);

        if (accessToken && existingUserDetail) {
            dispatch(setLogin({
                accessToken,
                userDetail: JSON.parse(existingUserDetail),
                isLoading: false,
                isLoggedOut: false
            }));
        } else {
            dispatch(setLogin({ isLoading: false }));
        }
    }

    if (isLoading) {
        return <MMSpinner />;
    }

    return (
        <PaperProvider>
            <NavigationContainer ref={navigationRef}>
                {(_.isNil(accessToken)) ? <AuthStackNavigator /> : <AppStackNavigator />}
            </NavigationContainer>
        </PaperProvider>
    );
}
