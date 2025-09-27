import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import ExploreScreen from '../screens/ExploreScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ChatScreen from '../screens/ChatsScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import UserProfileScreen from '../screens/UserProfileScreen';

import SignUpNavigator from './SignUpNavigator';
import { SignUpProvider } from '../context/SignUpContext';

import ChatStackScreen from './ChatStackScreen';

import { COLORS } from '../utils/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: { height: 60 },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={ExploreScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome5 name="home" size={24} color={focused ? COLORS.primary : '#8e8e93'} solid={focused} />
                    ),
                }}
            />
            <Tab.Screen
                name="ActivityTab"
                component={NotificationScreen}
                options={{
                    tabBarLabel: 'Activity',
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons name="timeline" size={24} color={focused ? COLORS.primary : '#8e8e93'} />
                    ),
                }}
            />
            <Tab.Screen
                name="PlusTab"
                component={ExploreScreen}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: () => (
                        <Ionicons name="add" size={32} color="#fff" style={{ backgroundColor: COLORS.primary, borderRadius: 20, padding: 6 }} />
                    ),
                }}
            />
            <Tab.Screen
                name="ChatsTab"
                component={ChatStackScreen}
                options={{
                    tabBarLabel: 'Chats',
                    tabBarIcon: ({ focused }) => (
                        <Feather name="message-square" size={24} color={focused ? COLORS.primary : '#8e8e93'} />
                    ),
                }}
            />
            <Tab.Screen
                name="SettingsTab"
                component={SettingsScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="settings-outline" size={24} color={focused ? COLORS.primary : '#8e8e93'} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <SignUpProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
                    {/* Splash & Auth */}
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="SignUp" component={SignUpNavigator} />

                    {/* Main app with Tabs */}
                    <Stack.Screen name="MainTabs" component={MainTabs} />

                    {/* Screens outside tabs */}
                    <Stack.Screen name='ChatScreen' component={ChatScreen} />
                    <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
                    <Stack.Screen name="Search" component={SearchScreen} />
                    <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SignUpProvider>
    );
}
