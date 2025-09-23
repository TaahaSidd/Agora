import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const notifications = [
    { id: '1', title: 'User accepted your request', description: 'John Doe accepted your friend request.', time: '2h ago', icon: 'person-checkmark-outline' },
    { id: '2', title: 'New Offers', description: 'Get 50% off on your next purchase.', time: '5h ago', icon: 'pricetag-outline' },
    { id: '3', title: 'Message from Sarah', description: "Hey! Let's catch up soon.", time: '1d ago', icon: 'chatbubble-ellipses-outline' },
];

const NotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
        <View style={styles.iconWrapper}>
            <Icon name={item.icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.textWrapper}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
    </View>
);

export default function NotificationScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Explore')} >
                    <Icon name="arrow-back" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NotificationItem item={item} />}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingHorizontal: 16,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        top: 50,
        padding: 8,
        borderRadius: 20,
    },
    headerTitle: {
        flex: 1,
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#222',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
        shadowColor: '#00000014',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#E6F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textWrapper: {
        flex: 1,
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        marginBottom: 2,
    },
    description: {
        fontSize: 14,
        color: '#555',
    },
    time: {
        fontSize: 12,
        color: '#999',
        marginLeft: 8,
    },
});
