import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../screens/ChatsScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';

const ChatsStack = createNativeStackNavigator();

export default function ChatStackScreen() {
    return (
        <ChatsStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatsStack.Screen name="ChatScreen" component={ChatScreen} />
            <ChatsStack.Screen name="ChatRoomScreen" component={ChatRoomScreen} />
        </ChatsStack.Navigator>
    );
}
