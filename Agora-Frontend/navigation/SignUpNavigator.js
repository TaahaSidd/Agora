import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpStep1 from '../screens/SignUpStep1';
import SignUpStep2 from '../screens/SignUpStep2';
import SignUpStep3 from '../screens/SignUpStep3';
import SignUpStep4 from '../screens/SignUpStep4';

const Stack = createNativeStackNavigator();

export default function SignUpNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="SignUpStep1"
            screenOptions={{
                headerStyle: { backgroundColor: '#003366' },
                headerTintColor: '#fff',
                headerTitleAlign: 'center',
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name="SignUpStep1"
                component={SignUpStep1}
                options={{ title: 'Sign Up - Step 1', headerBackTitleVisible: false }}
            />
            <Stack.Screen
                name="SignUpStep2"
                component={SignUpStep2}
                options={{ title: 'Sign Up - Step 2', headerBackTitleVisible: false }}
            />
            <Stack.Screen
                name="SignUpStep3"
                component={SignUpStep3}
                options={{ title: 'Sign Up - Step 3', headerBackTitleVisible: false }}
            />
            <Stack.Screen
                name="SignUpStep4"
                component={SignUpStep4}
                options={{ title: 'Sign Up - Step 4', headerBackTitleVisible: false }}
            />
        </Stack.Navigator>
    );
}
