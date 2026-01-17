import {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

import {SignUpProvider} from './context/SignUpContext';
import {FavoritesProvider} from './context/FavoritesContext';
import {useUserStore} from './stores/userStore';
import {ChatBlockingProvider} from "./context/ChatBlockingProvider";

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import LoginScreenOtp from './screens/LoginScreenOtp';
import ForgotPassword from './screens/ForgotPasswordScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import CompleteProfileScreen from "./screens/CompleteProfileScreen";
import SignUpNavigator from './navigation/SignUpNavigator';
import MainLayout from './screens/MainLayout';
import ChatRoomScreen from './screens/ChatRoomScreen';
import AddListingScreen from './screens/AddListingScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import AllListingsScreen from './screens/AllListingsScreen';
import MakeOfferScreen from './screens/MakeOfferScreen';
import SearchScreen from './screens/SearchScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';
import CategoryScreen from './screens/CategoryScreen';
import MyListingsScreen from './screens/MyListingsScreen';
import EditListingScreen from './screens/EditListingScreen';
import AllReviewsScreen from './screens/AllReviewsScreen';
import UserRatingScreen from './screens/UserRatingScreen';
import BlockedUsersScreen from './screens/BlockedUsersScreen';
import ReportUserScreen from './screens/ReportUserScreen';
import ReportListingScreen from './screens/ReportListingScreen';
import ReportHistoryScreen from './screens/ReportHistoryScreen';
import SafetyCenterScreen from "./screens/SafetyCenterScreen";
import FavoritesScreen from './screens/FavoritesScreen';
import FAQScreen from './screens/FAQScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import SupportScreen from './screens/SupportScreen';
import AboutScreen from './screens/AboutScreen';

import {COLORS} from './utils/colors';

const Stack = createNativeStackNavigator();

function SignUpFlowWrapper() {
    return (
        <SignUpProvider>
            <SignUpNavigator/>
        </SignUpProvider>
    );
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default function App() {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [initialRoute, setInitialRoute] = useState('Splash');

    const notificationListener = useRef();
    const responseListener = useRef();
    const navigationRef = useRef();

    const {fetchUser, currentUser, logout} = useUserStore();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');

            if (!token) {
                console.log('🚫 No token found');
                setInitialRoute('Splash');
                setIsCheckingAuth(false);
                return;
            }

            console.log('✅ Token found, fetching user...');
            await fetchUser();

            // Wait a bit for fetchUser to complete
            setTimeout(() => {
                setIsCheckingAuth(false);
            }, 500);

        } catch (error) {
            console.error('Auth check failed:', error);
            setInitialRoute('Splash');
            setIsCheckingAuth(false);
        }
    };

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('📩 Notification received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('👆 User tapped notification:', response);

            const data = response.notification.request.content.data;
            console.log('📦 Notification data:', data);

            if (navigationRef.current) {
                if (data.type === 'LISTING_LIKED' && data.listingId) {
                    navigationRef.current.navigate('ProductDetailsScreen', {
                        listingId: data.listingId
                    });
                } else if (data.type === 'REVIEW' && data.listingId) {
                    navigationRef.current.navigate('ProductDetailsScreen', {
                        listingId: data.listingId
                    });
                } else if (data.type === 'FOLLOW') {
                    navigationRef.current.navigate('ProfileScreen');
                } else if (data.type === 'SYSTEM_UPDATE') {
                    navigationRef.current.navigate('Notification');
                } else {
                    navigationRef.current.navigate('Notification');
                }
            }
        });

        return () => {
            if (notificationListener.current) notificationListener.current.remove();
            if (responseListener.current) responseListener.current.remove();
        };
    }, []);

    if (isCheckingAuth) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <FavoritesProvider>
                <ChatBlockingProvider>
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator
                            screenOptions={{headerShown: false}}
                            initialRouteName={initialRoute}
                        >
                            {/* Auth Screens */}
                            <Stack.Screen name="Splash" component={SplashScreen}/>
                            <Stack.Screen name="Onboarding" component={OnboardingScreen}/>
                            <Stack.Screen name="SignUp" component={SignUpScreen}/>
                            <Stack.Screen name="Login" component={LoginScreen}/>
                            <Stack.Screen name="LoginOtp" component={LoginScreenOtp}/>
                            <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
                            <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen}/>
                            <Stack.Screen name="CompleteProfileScreen" component={CompleteProfileScreen}/>
                            <Stack.Screen name="SignUpFlow" component={SignUpFlowWrapper}/>

                            {/* Main App Screens */}
                            <Stack.Screen name="MainLayout" component={MainLayout}/>
                            <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen}/>
                            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen}/>
                            <Stack.Screen name="MakeOfferScreen" component={MakeOfferScreen}/>
                            <Stack.Screen name="Search" component={SearchScreen}/>
                            <Stack.Screen name="Notification" component={NotificationScreen}/>
                            <Stack.Screen name="ProfileScreen" component={ProfileScreen}/>
                            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen}/>
                            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen}/>
                            <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen}/>
                            <Stack.Screen name="AddListingScreen" component={AddListingScreen}/>
                            <Stack.Screen name="AllListingsScreen" component={AllListingsScreen}/>
                            <Stack.Screen name="CategoryScreen" component={CategoryScreen}/>
                            <Stack.Screen name="MyListingsScreen" component={MyListingsScreen}/>
                            <Stack.Screen name="EditListingScreen" component={EditListingScreen}/>
                            <Stack.Screen name="ReportUserScreen" component={ReportUserScreen}/>
                            <Stack.Screen name="UserRatingScreen" component={UserRatingScreen}/>
                            <Stack.Screen name="SafetyCenterScreen" component={SafetyCenterScreen}/>
                            <Stack.Screen name="AllReviewsScreen" component={AllReviewsScreen}/>
                            <Stack.Screen name="ReportListingScreen" component={ReportListingScreen}/>
                            <Stack.Screen name="BlockedUsersScreen" component={BlockedUsersScreen}/>
                            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen}/>
                            <Stack.Screen name="ReportHistoryScreen" component={ReportHistoryScreen}/>
                            <Stack.Screen name="FAQScreen" component={FAQScreen}/>
                            <Stack.Screen name="SupportScreen" component={SupportScreen}/>
                            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen}/>
                            <Stack.Screen name="AboutScreen" component={AboutScreen}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </ChatBlockingProvider>
            </FavoritesProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1},
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark?.bg || '#000',
    },
});