import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavBar from '../components/BottomNavBar';

import ExploreScreen from '../screens/ExploreScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ChatsScreen from '../screens/ChatsScreen';
import SettingsScreen from '../screens/SettingsScreen';

export default function MainLayout() {
    const [activeTab, setActiveTab] = useState('Home');

    const renderScreen = () => {
        switch (activeTab) {
            case 'Home':
                return <ExploreScreen />;
            case 'Activity':
                return <ActivityScreen />;
            case 'Chats':
                return <ChatsScreen />;
            case 'Settings':
                return <SettingsScreen />;
            default:
                return <ExploreScreen />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>{renderScreen()}</View>
            <BottomNavBar active={activeTab} setActive={setActiveTab} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1 },
});
