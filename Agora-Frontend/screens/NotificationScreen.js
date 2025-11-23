import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";
import { apiGet } from "../services/api";
import { useCurrentUser } from "../hooks/useCurrentUser";

import AppHeader from "../components/AppHeader";

import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";

import RelaxSVG from '../assets/svg/RelaxSVG.svg';

const STORAGE_KEY = "notifications";

const NotificationItem = ({ item, onPress }) => {
    const getIconColor = (type) => {
        switch (type) {
            case 'message': return '#3B82F6';
            case 'offer': return '#10B981';
            case 'alert': return '#EF4444';
            case 'info': return '#8B5CF6';
            default: return COLORS.primary;
        }
    };

    const getIconBg = (type) => {
        switch (type) {
            case 'message': return '#DBEAFE';
            case 'offer': return '#D1FAE5';
            case 'alert': return '#FEE2E2';
            case 'info': return '#EDE9FE';
            default: return '#EFF6FF';
        }
    };

    return (
        <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
            activeOpacity={0.7}
        >
            <View style={[styles.iconWrapper, { backgroundColor: getIconBg(item.type) }]}>
                <Icon name={item.icon} size={24} color={getIconColor(item.type)} />
            </View>

            <View style={styles.contentWrapper}>
                <View style={styles.topRow}>
                    <Text style={[styles.title, !item.read && styles.unreadTitle]}>
                        {item.title}
                    </Text>
                    {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.bottomRow}>
                    <Icon name="time-outline" size={12} color="#9CA3AF" />
                    <Text style={styles.time}>{item.time}</Text>
                </View>
            </View>

            <Icon name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>
    );
};

export default function NotificationScreen() {
    const navigation = useNavigation();
    const { user, loading, isGuest } = useCurrentUser();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'unread'

    // useEffect(() => {
    //     const loadNotifications = async () => {
    //         try {
    //             const stored = await AsyncStorage.getItem(STORAGE_KEY);
    //             if (stored) {
    //                 setNotifications(JSON.parse(stored));
    //             } else {
    //                 // Demo notifications
    //                 const initial = [
    //                     {
    //                         id: "1",
    //                         title: "New Message",
    //                         description: "John Doe sent you a message about iPhone listing",
    //                         time: "2h ago",
    //                         icon: "chatbubble-ellipses",
    //                         type: "message",
    //                         read: false
    //                     },
    //                     {
    //                         id: "2",
    //                         title: "Offer Received",
    //                         description: "Someone made an offer of ₹5000 on your laptop",
    //                         time: "5h ago",
    //                         icon: "pricetag",
    //                         type: "offer",
    //                         read: false
    //                     },
    //                     {
    //                         id: "3",
    //                         title: "Listing Approved",
    //                         description: "Your listing 'Gaming Mouse' has been approved and is now live",
    //                         time: "1d ago",
    //                         icon: "checkmark-circle",
    //                         type: "info",
    //                         read: true
    //                     },
    //                     {
    //                         id: "4",
    //                         title: "Price Drop Alert",
    //                         description: "Item on your wishlist dropped to ₹1200",
    //                         time: "2d ago",
    //                         icon: "trending-down",
    //                         type: "alert",
    //                         read: true
    //                     },
    //                 ];
    //                 setNotifications(initial);
    //                 await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    //             }
    //         } catch (e) {
    //             console.error("Failed to load notifications:", e);
    //         }
    //     };
    //     loadNotifications();
    // }, []);

    useEffect(() => {
        if (loading || isGuest) return;  // wait until user loads

        const loadNotifications = async () => {
            try {

                const data = await apiGet(`/notifications/${user.id}`);
                setNotifications(data);
            } catch (e) {
                console.error("Failed to load notifications:", e);
            }
        };

        loadNotifications();
    }, [user, loading, isGuest]);


    const handlePressNotification = async (id) => {
        const updated = notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleMarkAllRead = async () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        setNotifications(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleClearAll = async () => {
        setNotifications([]);
        await AsyncStorage.removeItem(STORAGE_KEY);
    };

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;


    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <RelaxSVG width={200} height={200} />
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyText}>
                You have no new notifications. We'll let you know when something comes up!
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />

            {/* Header */}
            <AppHeader
                onBack={() =>
                    navigation.canGoBack()
                        ? navigation.goBack()
                        : navigation.navigate("Explore")
                }
                centerComponent={
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: COLORS.dark.text, fontSize: 20, fontWeight: '700' }}>
                            Notifications
                        </Text>

                        {unreadCount > 0 && (
                            <View style={[styles.unreadBadge, { marginLeft: 6 }]}>
                                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                }
                rightComponent={
                    <TouchableOpacity activeOpacity={0.7}>
                        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.dark.textSecondary} />
                    </TouchableOpacity>
                }
            />

            {/* Filter Tabs */}
            {notifications.length > 0 && (
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'all' && styles.activeFilter]}
                        onPress={() => setFilter('all')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'unread' && styles.activeFilter]}
                        onPress={() => setFilter('unread')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
                            Unread ({unreadCount})
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Actions Row */}
            {notifications.length > 0 && (
                <View style={styles.actionsRow}>
                    {unreadCount > 0 && (
                        <TouchableOpacity
                            onPress={handleMarkAllRead}
                            style={styles.actionButton}
                            activeOpacity={0.7}
                        >
                            <Icon name="checkmark-done" size={16} color={COLORS.primary} />
                            <Text style={styles.actionText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={handleClearAll}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                    >
                        <Icon name="trash-outline" size={16} color="#EF4444" />
                        <Text style={[styles.actionText, { color: '#EF4444' }]}>Clear all</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Notifications List */}
            <FlatList
                data={filteredNotifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <NotificationItem item={item} onPress={handlePressNotification} />
                )}
                ListEmptyComponent={renderEmptyState}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.dark.bgElevated,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
        marginTop: StatusBar.currentHeight || 0,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.dark.text,
    },
    unreadBadge: {
        backgroundColor: COLORS.error,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        paddingHorizontal: 6,
    },
    unreadBadgeText: {
        color: COLORS.dark.text,
        fontSize: 11,
        fontWeight: '700',
    },
    moreButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        backgroundColor: COLORS.dark.card,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: COLORS.dark.bgElevated,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.divider,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.dark.card,
    },
    activeFilter: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
    },
    activeFilterText: {
        color: COLORS.dark.text,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: COLORS.dark.bgElevated,
        gap: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
        flexGrow: 1,
    },
    notificationCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    unreadCard: {
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
        backgroundColor: COLORS.dark.card,
    },
    contentWrapper: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
        flex: 1,
    },
    unreadTitle: {
        fontWeight: '800',
        color: COLORS.dark.text,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        marginLeft: 8,
    },
    description: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        marginBottom: 6,
        lineHeight: 18,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 12,
        color: COLORS.dark.textQuaternary,
        marginLeft: 4,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing['3xl'],
    },
    emptyTitle: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginTop: THEME.spacing.lg,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
    },
    emptyText: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textTertiary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.base * THEME.lineHeight.relaxed,
        maxWidth: 300,
    },
});