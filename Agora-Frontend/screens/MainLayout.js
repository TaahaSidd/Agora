import React, {useRef} from 'react';
import {Animated, View} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useUserStore} from "../stores/userStore";

import ExploreScreen from './ExploreScreen';
import MyListingsScreen from "./MyListingsScreen";
import AddListingScreen from './AddListingScreen';
import ChatsScreen from './ChatsScreen';
import SettingsScreen from './SettingsScreen';
import AnimatedBottomNavBar from '../components/AnimatedBottomNav';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsLayout({scrollY, isGuest, isPending}) {

    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
            tabBar={(props) => <AnimatedBottomNavBar {...props} scrollY={scrollY} isGuest={isGuest}
                                                     isPending={isPending}/>}
        >
            <Tab.Screen name="Explore">
                {(props) => <ExploreScreen {...props} scrollY={scrollY}/>}
            </Tab.Screen>

            <Tab.Screen name="My-Listings">
                {(props) => <MyListingsScreen {...props} scrollY={scrollY}/>}
            </Tab.Screen>

            <Tab.Screen name="Chats">
                {(props) => <ChatsScreen {...props} scrollY={scrollY}/>}
            </Tab.Screen>

            <Tab.Screen name="Settings">
                {(props) => (
                    <SettingsScreen
                        {...props}
                        scrollY={scrollY}
                        isGuest={isGuest}
                        isPending={isPending}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

export default function MainLayout({route, navigation}) {

    const scrollY = useRef(new Animated.Value(0)).current;
    const isGuest = route?.params?.guest ?? false;

    const {currentUser} = useUserStore();
    const isPending = currentUser?.verificationStatus === 'PENDING';

    // console.log('👤 Current User:', currentUser);
    // console.log('📋 Verification Status:', currentUser?.verificationStatus);
    // console.log('🔍 isPending:', isPending);

    return (
        <View style={{flex: 1}}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Tabs">
                    {(props) => (
                        <TabsLayout
                            {...props}
                            scrollY={scrollY}
                            isGuest={isGuest}
                            isPending={isPending}
                            navigation={navigation}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="AddListingScreen" component={AddListingScreen}/>
            </Stack.Navigator>
        </View>
    );
}
