import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const notifications = [
    {
        id: '1',
        title: 'User accepted your request',
        description: 'John Doe accepted your friend request.',
        time: '2h ago',
        icon: 'person-checkmark-outline',
    },
    {
        id: '2',
        title: 'New Offers',
        description: 'Get 50% off on your next purchase.',
        time: '5h ago',
        icon: 'pricetag-outline',
    },
    {
        id: '3',
        title: 'Message from Sarah',
        description: 'Hey! Let\'s catch up soon.',
        time: '1d ago',
        icon: 'chatbubble-ellipses-outline',
    },
];

const NotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
        <Icon name={item.icon} size={30} color="#007AFF" style={{ marginRight: 10 }} />
        <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
    </View>
);

export default function NotificationScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationItem item={item} />}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            {/* Bottom Tab Navigation Bar */}
            <View style={styles.bottomTab}>
                <TouchableOpacity style={styles.tabButton}>
                    <Icon name="home-outline" size={24} color="#444" />
                    <Text style={styles.tabText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton}>
                    <Icon name="bar-chart-outline" size={24} color="#444" />
                    <Text style={styles.tabText}>Activity</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.plusButton}>
                    <Icon name="add" size={36} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton}>
                    <Icon name="chatbubble-outline" size={24} color="#444" />
                    <Text style={styles.tabText}>Chats</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabButton}>
                    <Icon name="settings-outline" size={24} color="#444" />
                    <Text style={styles.tabText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    time: {
        fontSize: 12,
        color: '#999',
        marginLeft: 10,
    },
    bottomTab: {
        height: 70,
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 12,
        marginTop: 2,
        color: '#444',
    },
    plusButton: {
        width: 60,
        height: 60,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 5,
    },
});
