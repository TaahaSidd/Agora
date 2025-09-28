import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignUpProvider } from './context/SignUpContext';
import Toast from 'react-native-toast-message';

import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpNavigator from './navigation/SignUpNavigator';
import ExploreScreen from './screens/ExploreScreen';
import ActivityScreen from './screens/ActivityScreen';
import ChatsScreen from './screens/ChatsScreen';
import ChatRoomScreen from './screens/ChatRoomScreen';
import SettingsScreen from './screens/SettingsScreen';
import SearchScreen from './screens/SearchScreen'
import NotificationScreen from './screens/NotificationScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AddListingScreen from './screens/AddListingScreen';
import MakeOfferScreen from './screens/MakeOfferScreen';

import BottomNavBar from './components/BottomNavBar';

const Stack = createNativeStackNavigator();
const ProductStack = createNativeStackNavigator();

function ProductStackScreen() {
  return (
    <ProductStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductStack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
      <ProductStack.Screen name="MakeOfferScreen" component={MakeOfferScreen} />
    </ProductStack.Navigator>
  );
}

function MainLayout({ navigation }) {
  const [activeScreen, setActiveScreen] = useState('Home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home':
        return <ExploreScreen navigation={navigation} />;
      case 'Activity':
        return <ActivityScreen navigation={navigation} />;
      case 'Chats':
        return <ChatsScreen navigation={navigation} />;
      case 'Settings':
        return <SettingsScreen navigation={navigation} />;
      default:
        return <ExploreScreen navigation={navigation} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <BottomNavBar active={activeScreen} setActive={setActiveScreen} />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUpFlow">
            {() => (
              <SignUpProvider>
                <SignUpNavigator />
              </SignUpProvider>
            )}
          </Stack.Screen>

          <Stack.Screen name="MainLayout" component={MainLayout} />

          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />

          {/* Wrap the nested stack navigator inside a screen */}
          <Stack.Screen name="ProductStack" component={ProductStackScreen} />

          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
          <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
          <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
          <Stack.Screen name="AddListingScreen" component={AddListingScreen} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});
