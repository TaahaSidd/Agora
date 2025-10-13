import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const STORAGE_KEY = "notifications";

// Notification Item Component
const NotificationItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={() => onPress(item.id)} style={styles.notificationItem}>
        <View style={styles.iconWrapper}>
            <Icon name={item.icon} size={24} color={item.read ? "#007AFF" : "#FF3B30"} />
        </View>
        <View style={styles.textWrapper}>
            <Text style={[styles.title, !item.read && styles.unread]}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
        <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
);

export default function NotificationScreen() {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);

    // Load notifications from AsyncStorage
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    setNotifications(JSON.parse(stored));
                } else {
                    // first time — preload demo notifications
                    const initial = [
                        { id: "1", title: "User accepted your request", description: "John Doe accepted your friend request.", time: "2h ago", icon: "person-checkmark-outline", read: false },
                        { id: "2", title: "New Offers", description: "Get 50% off on your next purchase.", time: "5h ago", icon: "pricetag-outline", read: false },
                        { id: "3", title: "Message from Sarah", description: "Hey! Let's catch up soon.", time: "1d ago", icon: "chatbubble-ellipses-outline", read: true },
                    ];
                    setNotifications(initial);
                    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
                }
            } catch (e) {
                console.error("Failed to load notifications:", e);
            }
        };
        loadNotifications();
    }, []);

    // Toggle read/unread
    const handlePressNotification = async (id) => {
        const updated = notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // Clear all notifications
    const handleClearAll = async () => {
        setNotifications([]);
        await AsyncStorage.removeItem(STORAGE_KEY);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.canGoBack()
                            ? navigation.goBack()
                            : navigation.navigate("Explore")
                    }
                >
                    <Icon name="arrow-back" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                {notifications.length > 0 && (
                    <TouchableOpacity onPress={handleClearAll}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Notifications List */}
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationItem item={item} onPress={handlePressNotification} />
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No notifications yet</Text>
                }
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        marginTop:36,
        borderBottomColor: "#eee",
    },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#222" },
    clearText: { fontSize: 14, color: "#007AFF" },
    notificationItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f1f1",
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f2f8ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textWrapper: { flex: 1 },
    title: { fontSize: 16, color: "#222" },
    unread: { fontWeight: "bold" },
    description: { fontSize: 14, color: "#555", marginTop: 2 },
    time: { fontSize: 12, color: "#888", marginLeft: 8 },
    emptyText: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#999" },
});