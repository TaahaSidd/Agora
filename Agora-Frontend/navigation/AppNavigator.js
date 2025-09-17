import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';

import SignUpNavigator from '../navigation/SignUpNavigator';
import { SignUpProvider } from '../context/SignUpContext';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SignUpProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>

                    {/* Splash screen */}
                    <Stack.Screen name="Splash" component={SplashScreen} />

                    {/* Auth / signup flow */}
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpNavigator} />

                    {/* Main app screens */}
                    <Stack.Screen name="Explore" component={ExploreScreen} />
                    <Stack.Screen name="Search" component={SearchScreen} />
                    <Stack.Screen name="Notifications" component={NotificationScreen} />

                    <Stack.Screen name='Settings' component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SignUpProvider>
    );
}
