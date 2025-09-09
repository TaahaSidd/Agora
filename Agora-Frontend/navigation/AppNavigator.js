import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SignUpNavigator from '../navigation/SignUpNavigator'; // multi-step signup stack
import { SignUpProvider } from '../context/SignUpContext';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SignUpProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUpNavigator" component={SignUpNavigator} />
                    <Stack.Screen name="Explore" component={ExploreScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SignUpProvider>
    );
}
