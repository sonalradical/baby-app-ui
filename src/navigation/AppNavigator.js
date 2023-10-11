// navigation library
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '../services/NavigationServices';

// auth screens
import Login from '../screens/auth/Login';
//import OTPView from '../screens/auth/OTPView';
//import SignUp from '../screens/auth/SignUp';


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
                {/* <AuthStack.Screen name="SignUp" component={SignUp} />
                <AuthStack.Screen name="Otp" component={OTPView} /> */}
            </AuthStack.Navigator>
        </NavigationContainer>
    );
}

export default function AppNavigator() {

    return (
        <PaperProvider>
            <NavigationContainer ref={navigationRef}>
                {<AuthStackNavigator />}
            </NavigationContainer>
        </PaperProvider>
    );
}
