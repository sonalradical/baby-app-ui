// navigation library
import React, { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '../services/NavigationServices';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import { setLogin } from '../redux/Slice/AuthSlice';

import MMUtils from '../helpers/Utils';
import MMEnums from '../helpers/Enums';

import MMSpinner from '../components/common/Spinner';

import lightMMTheme from '../lightMMTheme'
// auth screens
import Login from '../screens/auth/Login';
import OTPView from '../screens/auth/OTPView';
import SignUp from '../screens/auth/SignUp';

// app screens
import AddBaby from '../screens/babyProfile/AddBaby';
import Logout from '../screens/auth/Logout';
import ChapterQuiz from '../screens/quiz/ChapterQuiz';
import Footer from '../screens/footer/Footer';
import Header from '../screens/header/Header';
import ChapterList from '../screens/chapter/ChapterList';
import MilestoneQuiz from '../screens/milestone/MilestoneQuiz';

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
                    name="AddBaby"
                    component={AddBaby}
                    options={{ headerShown: false }}
                />
                <AppStack.Screen
                    name="ChapterQuiz"
                    component={ChapterQuiz}
                    options={{ headerShown: false }}
                />
                <AppStack.Screen
                    name="MilestoneQuiz"
                    component={MilestoneQuiz}
                    options={{ headerShown: false }}
                />
                <AppStack.Screen
                    name="ChapterList"
                    component={ChapterList}
                />
                <AppStack.Screen
                    name="Footer"
                    component={Footer}
                />
                <AppStack.Screen
                    name="Logout"
                    component={Logout}
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
        const accessToken = await MMUtils.getItemFromStorage(MMEnums.storage.accessToken);
        const existingUserDetail = await MMUtils.getItemFromStorage(MMEnums.storage.userDetail);

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
        <PaperProvider theme={lightMMTheme}>
            <NavigationContainer ref={navigationRef}>
                {(_.isNil(accessToken)) ? <AuthStackNavigator /> : <AppStackNavigator />}
            </NavigationContainer>
        </PaperProvider>
    );
}
