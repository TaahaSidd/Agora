import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomNavBar from '../components/BottomNavBar';

import ExploreScreen from '../screens/ExploreScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddListingScreen from '../screens/AddListingScreen';
import EditListingScreen from '../screens/EditListingScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function MainLayout() {
    const [activeTab, setActiveTab] = React.useState('Home');

    return (
        <View style={styles.container}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {activeTab === 'Home' && (
                    <Stack.Screen name="ExploreScreen">
                        {() => <ExploreScreen activeTab={activeTab} />}
                    </Stack.Screen>
                )}
                {activeTab === 'Activity' && (
                    <Stack.Screen name="ActivityScreen" component={ActivityScreen} />
                )}
                {activeTab === 'Chats' && (
                    <>
                        <Stack.Screen name="ChatsMain" component={ChatsScreen} />
                        <Stack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
                    </>
                )}
                {activeTab === 'Settings' && (
                    <>
                        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
                        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
                        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
                    </>
                )}
                <Stack.Screen name="AddListingScreen" component={AddListingScreen} />
                <Stack.Screen name="EditListingScreen" component={EditListingScreen} />
                <Stack.Screen name="MyListingsScreen" component={MyListingsScreen} />
            </Stack.Navigator>
            {['Home', 'Activity', 'Chats', 'Settings'].includes(activeTab) && (
                <BottomNavBar active={activeTab} setActive={setActiveTab} />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
});
