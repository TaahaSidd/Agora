import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
} from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";
import { apiGet, apiPatch, apiDelete } from "../services/api";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useNotificationCount } from "../hooks/useNotificationCount";

import AppHeader from "../components/AppHeader";

import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";

import RelaxSVG from '../assets/svg/RelaxSVG.svg';

const STORAGE_KEY = "notifications";

const getNotificationIcon = (type) => {
    const normalizedType = type?.toLowerCase().replace(/_/g, '');

    const iconMap = {
        'listingliked': 'heart',
        'listingsold': 'checkmark-circle',
        'listingapproved': 'checkmark-circle',
        'listingrejected': 'close-circle',
        'newlisting': 'add-circle',
        'listingexpired': 'time-outline',

        'message': 'chatbubble-ellipses',
        'newmessage': 'chatbubble',
        'chat': 'chatbubble',
        'reply': 'chatbubbles',

        'offer': 'pricetag',
        'newoffer': 'pricetag',
        'offersent': 'paper-plane',
        'offeraccepted': 'checkmark-circle',
        'offerrejected': 'close-circle',
        'pricedrop': 'trending-down',
        'pricealert': 'notifications',
        'discount': 'gift',

        'order': 'receipt',
        'neworder': 'cart',
        'orderconfirmed': 'checkmark-circle',
        'ordercancelled': 'close-circle',
        'payment': 'card',
        'paymentreceived': 'cash',
        'transaction': 'cash',
        'delivery': 'location',

        'alert': 'alert-circle',
        'warning': 'warning',
        'report': 'flag',
        'reportreceived': 'shield',

        'info': 'information-circle',
        'announcement': 'megaphone',
        'update': 'sync',
        'reminder': 'time',

        'like': 'heart',
        'follow': 'person-add',
        'newfollower': 'person-add',
        'share': 'share-social',
        'comment': 'chatbox',
        'newcomment': 'chatbox',

        'achievement': 'trophy',
        'badge': 'ribbon',
        'reward': 'star',

        'review': 'star',
        'newreview': 'star',
        'rating': 'star-half',
    };

    return iconMap[normalizedType] || 'notifications-outline';
};

const getIconColor = (type) => {
    const normalizedType = type?.toLowerCase().replace(/_/g, '');

    const colorMap = {
        // Listing - Pink/Purple
        'listingliked': '#EC4899',
        'listingsold': '#10B981',
        'listingapproved': '#10B981',
        'listingrejected': '#EF4444',
        'newlisting': '#8B5CF6',
        'listingexpired': '#F59E0B',

        // Messages - Blue
        'message': '#3B82F6',
        'newmessage': '#3B82F6',
        'chat': '#3B82F6',
        'reply': '#3B82F6',
        'comment': '#3B82F6',
        'newcomment': '#3B82F6',

        // Offers/Money - Green
        'offer': '#10B981',
        'newoffer': '#10B981',
        'offersent': '#10B981',
        'offeraccepted': '#10B981',
        'offerrejected': '#EF4444',
        'pricedrop': '#10B981',
        'payment': '#10B981',
        'paymentreceived': '#10B981',
        'transaction': '#10B981',
        'discount': '#10B981',

        // Alerts/Warnings - Red
        'alert': '#EF4444',
        'warning': '#EF4444',
        'report': '#EF4444',
        'reportreceived': '#EF4444',

        // Info - Purple
        'info': '#8B5CF6',
        'announcement': '#8B5CF6',
        'update': '#8B5CF6',

        // Orders - Orange
        'order': '#F59E0B',
        'neworder': '#F59E0B',
        'orderconfirmed': '#10B981',
        'ordercancelled': '#EF4444',
        'delivery': '#F59E0B',

        // Social - Pink
        'like': '#EC4899',
        'follow': '#EC4899',
        'newfollower': '#EC4899',
        'share': '#EC4899',

        // Achievement - Yellow
        'achievement': '#F59E0B',
        'badge': '#F59E0B',
        'reward': '#F59E0B',

        // Review - Yellow
        'review': '#F59E0B',
        'newreview': '#F59E0B',
        'rating': '#F59E0B',

        // Reminder - Yellow
        'reminder': '#F59E0B',
    };

    return colorMap[normalizedType] || COLORS.primary;
};

const getIconBg = (type) => {
    const normalizedType = type?.toLowerCase().replace(/_/g, '');

    // For dark mode, use more subtle backgrounds
    const bgMap = {
        // Listing - Pink/Purple backgrounds
        'listingliked': 'rgba(236, 72, 153, 0.15)',
        'listingsold': 'rgba(16, 185, 129, 0.15)',
        'listingapproved': 'rgba(16, 185, 129, 0.15)',
        'listingrejected': 'rgba(239, 68, 68, 0.15)',
        'newlisting': 'rgba(139, 92, 246, 0.15)',
        'listingexpired': 'rgba(245, 158, 11, 0.15)',

        // Messages - Blue background
        'message': 'rgba(59, 130, 246, 0.15)',
        'newmessage': 'rgba(59, 130, 246, 0.15)',
        'chat': 'rgba(59, 130, 246, 0.15)',
        'reply': 'rgba(59, 130, 246, 0.15)',
        'comment': 'rgba(59, 130, 246, 0.15)',
        'newcomment': 'rgba(59, 130, 246, 0.15)',

        // Offers/Money - Green background
        'offer': 'rgba(16, 185, 129, 0.15)',
        'newoffer': 'rgba(16, 185, 129, 0.15)',
        'offersent': 'rgba(16, 185, 129, 0.15)',
        'offeraccepted': 'rgba(16, 185, 129, 0.15)',
        'offerrejected': 'rgba(239, 68, 68, 0.15)',
        'pricedrop': 'rgba(16, 185, 129, 0.15)',
        'payment': 'rgba(16, 185, 129, 0.15)',
        'paymentreceived': 'rgba(16, 185, 129, 0.15)',
        'transaction': 'rgba(16, 185, 129, 0.15)',
        'discount': 'rgba(16, 185, 129, 0.15)',

        // Alerts - Red background
        'alert': 'rgba(239, 68, 68, 0.15)',
        'warning': 'rgba(239, 68, 68, 0.15)',
        'report': 'rgba(239, 68, 68, 0.15)',
        'reportreceived': 'rgba(239, 68, 68, 0.15)',

        // Info - Purple background
        'info': 'rgba(139, 92, 246, 0.15)',
        'announcement': 'rgba(139, 92, 246, 0.15)',
        'update': 'rgba(139, 92, 246, 0.15)',

        // Orders - Orange background
        'order': 'rgba(245, 158, 11, 0.15)',
        'neworder': 'rgba(245, 158, 11, 0.15)',
        'orderconfirmed': 'rgba(16, 185, 129, 0.15)',
        'ordercancelled': 'rgba(239, 68, 68, 0.15)',
        'delivery': 'rgba(245, 158, 11, 0.15)',

        // Social - Pink background
        'like': 'rgba(236, 72, 153, 0.15)',
        'follow': 'rgba(236, 72, 153, 0.15)',
        'newfollower': 'rgba(236, 72, 153, 0.15)',
        'share': 'rgba(236, 72, 153, 0.15)',

        // Achievement - Yellow background
        'achievement': 'rgba(245, 158, 11, 0.15)',
        'badge': 'rgba(245, 158, 11, 0.15)',
        'reward': 'rgba(245, 158, 11, 0.15)',

        // Review - Yellow background
        'review': 'rgba(245, 158, 11, 0.15)',
        'newreview': 'rgba(245, 158, 11, 0.15)',
        'rating': 'rgba(245, 158, 11, 0.15)',

        // Reminder - Yellow background
        'reminder': 'rgba(245, 158, 11, 0.15)',
    };

    return bgMap[normalizedType] || 'rgba(59, 130, 246, 0.15)';
};

const formatTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
};

const NotificationItem = ({ item, onPress }) => {
    const iconName = getNotificationIcon(item.type);
    const iconColor = getIconColor(item.type);
    const iconBg = getIconBg(item.type);
    const { refresh } = useNotificationCount(0);

    return (
        <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
            activeOpacity={0.7}
        >
            <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
                <Icon name={iconName} size={24} color={iconColor} />
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
    const [filter, setFilter] = useState('all');


    useEffect(() => {
        if (loading || isGuest) return;

        const loadNotifications = async () => {
            try {
                const data = await apiGet(`/notifications/${user.id}`);
                console.log("DATA is --", data);

                const formatted = data.map(noti => ({
                    id: noti.id.toString(),
                    title: noti.title,
                    description: noti.body,
                    type: noti.type,
                    time: formatTime(noti.createdAt),
                    read: noti.read,
                    listingsId: noti.listingsId,
                }));

                setNotifications(formatted);
            } catch (e) {
                console.error("Failed to load notifications:", e);
            }
        };

        loadNotifications();
    }, [user, loading, isGuest]);


    const handlePressNotification = async (id) => {
        try {
            await apiPatch(`/notifications/read/${id}`);

            const updated = notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n
            );
            setNotifications(updated);

            refresh();
        } catch (e) {
            console.log(e);
        }
    };

    const handleMarkAllRead = async () => {
        const updated = notifications.map((n) => ({ ...n, read: true }));
        setNotifications(updated);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const handleClearAll = async () => {
        if (!user?.id) return;

        try {
            await apiDelete(`/notifications/clear/${user.id}`);
            setNotifications([]);
            refresh();
        } catch (error) {
            console.error("Failed to clear notifications:", error);
        }
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
        <SafeAreaProvider style={styles.safeArea}>
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
        </SafeAreaProvider>
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