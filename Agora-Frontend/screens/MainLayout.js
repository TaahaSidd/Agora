// import React, { useRef } from 'react';
// import { Animated, View, StyleSheet } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import ExploreScreen from './ExploreScreen';
// import ActivityScreen from './ActivityScreen';
// import AddListingScreen from './AddListingScreen';
// import ChatsScreen from './ChatsScreen';
// import SettingsScreen from './SettingsScreen';
// import AnimatedBottomNavBar from '../components/AnimatedBottomNav';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// function TabsLayout({ scrollY }) {
//     return (
//         <Tab.Navigator
//             screenOptions={{ headerShown: false }}
//             tabBar={(props) => <AnimatedBottomNavBar {...props} scrollY={scrollY} />}
//         >
//             <Tab.Screen name="Explore">
//                 {(props) => <ExploreScreen {...props} scrollY={scrollY} />}
//             </Tab.Screen>
//             <Tab.Screen name="Activity">
//                 {(props) => <ActivityScreen {...props} scrollY={scrollY} />}
//             </Tab.Screen>
//             <Tab.Screen name="Chats">
//                 {(props) => <ChatsScreen {...props} scrollY={scrollY} />}
//             </Tab.Screen>
//             <Tab.Screen name="Settings">
//                 {(props) => <SettingsScreen {...props} scrollY={scrollY} />}
//             </Tab.Screen>
//         </Tab.Navigator>
//     );
// }

// export default function MainLayout() {
//     const scrollY = useRef(new Animated.Value(0)).current;

//     return (
//         <View style={{ flex: 1 }}>
//             <Stack.Navigator screenOptions={{ headerShown: false }}>
//                 {/* This is your normal tab layout */}
//                 <Stack.Screen name="Tabs">
//                     {(props) => <TabsLayout {...props} scrollY={scrollY} />}
//                 </Stack.Screen>

//                 {/* CreateListing screen – no bottom nav */}
//                 <Stack.Screen name="AddListingScreen" component={AddListingScreen} />
//             </Stack.Navigator>
//         </View>
//     );
// }

import React, { useRef } from 'react';
import { Animated, View, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from './ExploreScreen';
import ActivityScreen from './ActivityScreen';
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

            <Tab.Screen name="Activity">
                {(props) => <ActivityScreen {...props} scrollY={scrollY} />}
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
