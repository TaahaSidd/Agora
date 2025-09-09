import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpStep1 from '../screens/SignUpStep1';
import SignUpStep2 from '../screens/SignUpStep2';
import SignUpStep3 from '../screens/SignUpStep3';
import SignUpStep4 from '../screens/SignUpStep4';

const Stack = createStackNavigator();

export default function SignUpNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="SignUpStep1"
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: '#003366' },
                headerTintColor: '#fff',
            }}
        >
            <Stack.Screen name="SignUpStep1" component={SignUpStep1} options={{ title: 'Sign Up - Step 1' }} />
            <Stack.Screen name="SignUpStep2" component={SignUpStep2} options={{ title: 'Sign Up - Step 2' }} />
            <Stack.Screen name="SignUpStep3" component={SignUpStep3} options={{ title: 'Sign Up - Step 3' }} />
            <Stack.Screen name="SignUpStep4" component={SignUpStep4} options={{ title: 'Sign Up - Step 4' }} />
        </Stack.Navigator>
    );
}
