import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { SignUpProvider } from './context/SignUpContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { saveExpoPushToken } from './services/notificationTokenService';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import LoginScreenOtp from './screens/LoginScreenOtp';
import ForgotPassword from './screens/ForgotPasswordScreen';
import OTPScreen from './screens/OTPVerificationScreen';
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
import ReportUserScreen from './screens/ReportUserScreen';
import ReportListingScreen from './screens/ReportListingScreen';
import ReferralScreen from './screens/ReferralScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import FAQScreen from './screens/FAQScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import SupportScreen from './screens/SupportScreen';
import AboutScreen from './screens/AboutScreen';

const Stack = createNativeStackNavigator();

// ----------------------------
// FIXED WRAPPER
// ----------------------------
function SignUpFlowWrapper() {
  return (
    <SignUpProvider>
      <SignUpNavigator />
    </SignUpProvider>
  );
}

// Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {

  const notificationListener = useRef();
  const responseListener = useRef();
  const navigationRef = useRef();


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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">

            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="LoginOtp" component={LoginScreenOtp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="OTPScreen" component={OTPScreen} />

            <Stack.Screen name="SignUpFlow" component={SignUpFlowWrapper} />

            <Stack.Screen name="MainLayout" component={MainLayout} />
            <Stack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
            <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
            <Stack.Screen name="MakeOfferScreen" component={MakeOfferScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
            <Stack.Screen name="AddListingScreen" component={AddListingScreen} />
            <Stack.Screen name="AllListingsScreen" component={AllListingsScreen} />
            <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
            <Stack.Screen name="MyListingsScreen" component={MyListingsScreen} />
            <Stack.Screen name="EditListingScreen" component={EditListingScreen} />
            <Stack.Screen name="ReportUserScreen" component={ReportUserScreen} />
            <Stack.Screen name="ReferralScreen" component={ReferralScreen} />
            <Stack.Screen name="AllReviewsScreen" component={AllReviewsScreen} />
            <Stack.Screen name="ReportListingScreen" component={ReportListingScreen} />
            <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
            <Stack.Screen name="FAQScreen" component={FAQScreen} />
            <Stack.Screen name="SupportScreen" component={SupportScreen} />
            <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
            <Stack.Screen name="AboutScreen" component={AboutScreen} />

          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}

// const registerPushTokenForUser = async (userId) => {
//   if (!Constants.isDevice) return;

//   // Skip if Notifications.getExpoPushTokenAsync is undefined (Expo Go)
//   if (!Notifications.getExpoPushTokenAsync) {
//     console.log("Skipping push token registration (Expo Go)");
//     return;
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//   if (existingStatus !== "granted") {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//   if (finalStatus !== "granted") return;

//   const token = (await Notifications.getExpoPushTokenAsync()).data;
//   console.log('User push token:', token);

//   // Send to backend
//   saveExpoPushToken(userId, token);

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
// };

const styles = StyleSheet.create({
  container: { flex: 1 },
});

