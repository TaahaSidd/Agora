import React, { useRef } from 'react';
import { Animated, View, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from './ExploreScreen';
import MyListingsScreen from "./MyListingsScreen";
import AddListingScreen from './AddListingScreen';
import ChatsScreen from './ChatsScreen';
import SettingsScreen from './SettingsScreen';
import AnimatedBottomNavBar from '../components/AnimatedBottomNav';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsLayout({ scrollY, isGuest, navigation }) {
    const guestBlocker = () => {
        Alert.alert(
            'Login Required',
            'You need to login to access this feature.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Login', onPress: () => navigation.replace('Login') },
            ]
        );
    };

    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <AnimatedBottomNavBar {...props} scrollY={scrollY} isGuest={isGuest} />}
        >
            <Tab.Screen name="Explore">
                {(props) => <ExploreScreen {...props} scrollY={scrollY} />}
            </Tab.Screen>

            <Tab.Screen name="My-Listings">
                {(props) => <MyListingsScreen {...props} scrollY={scrollY} />}
            </Tab.Screen>

            <Tab.Screen name="Chats">
                {(props) => <ChatsScreen {...props} scrollY={scrollY} />}
            </Tab.Screen>

            <Tab.Screen name="Settings">
                {(props) => (
                    <SettingsScreen
                        {...props}
                        scrollY={scrollY}
                        isGuest={isGuest}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator >
    );
}

export default function MainLayout({ route, navigation }) {
    const scrollY = useRef(new Animated.Value(0)).current;
    const isGuest = route?.params?.guest ?? false;

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Tabs">
                    {(props) => (
                        <TabsLayout
                            {...props}
                            scrollY={scrollY}
                            isGuest={isGuest}
                            navigation={navigation}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="AddListingScreen" component={AddListingScreen} />
            </Stack.Navigator>
        </View>
    );
}
