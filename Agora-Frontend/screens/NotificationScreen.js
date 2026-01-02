import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Ionicons";

import {useNavigation} from "@react-navigation/native";
import {apiGet, apiPatch, apiDelete} from "../services/api";
import {useUserStore} from "../stores/userStore";
import {useNotificationCount} from "../hooks/useNotificationCount";

import AppHeader from "../components/AppHeader";
import {COLORS} from "../utils/colors";

import RelaxSVG from '../assets/svg/RelaxSVG.svg';

const getNotificationIcon = (type) => {
    const normalized = type?.toLowerCase().replace(/_/g, '');
    const icons = {
        'listingliked': 'heart',
        'listingsold': 'checkmark-circle',
        'listingapproved': 'shield-checkmark',
        'listingrejected': 'close-circle',
        'newlisting': 'add-circle',
        'message': 'chatbubble-ellipses',
        'offer': 'pricetag',
        'pricedrop': 'trending-down',
        'order': 'receipt',
        'payment': 'card',
        'follow': 'person-add',
        'review': 'star',
        'alert': 'alert-circle',
        'info': 'information-circle',
    };
    return icons[normalized] || 'notifications';
};

const getIconColor = (type) => {
    const normalized = type?.toLowerCase().replace(/_/g, '');
    const colors = {
        'listingliked': '#EC4899',
        'listingsold': '#10B981',
        'listingapproved': '#10B981',
        'listingrejected': '#EF4444',
        'message': '#3B82F6',
        'offer': '#10B981',
        'pricedrop': '#F59E0B',
        'follow': '#EC4899',
        'review': '#F59E0B',
        'alert': '#EF4444',
    };
    return colors[normalized] || '#8B5CF6';
};

const formatTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.floor(diffDays / 7)}w`;
};

const NotificationItem = ({item, onPress}) => {
    const iconName = getNotificationIcon(item.type);
    const iconColor = getIconColor(item.type);

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={styles.notificationItem}
            activeOpacity={0.6}
        >
            {/* Left indicator for unread */}
            {!item.read && <View style={styles.unreadIndicator}/>}

            {/* Icon */}
            <View style={[styles.iconContainer, {backgroundColor: iconColor + '15'}]}>
                <Icon name={iconName} size={22} color={iconColor}/>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={[styles.title, !item.read && styles.unreadTitle]} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>

            {/* Unread dot */}
            {!item.read && <View style={styles.unreadDot}/>}
        </TouchableOpacity>
    );
};

export default function NotificationScreen() {
    const navigation = useNavigation();
    const {currentUser, loading, isGuest} = useUserStore();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const {unreadCount, refresh} = useNotificationCount(currentUser, loading, isGuest);

    const loadNotifications = async () => {
        if (!currentUser?.id) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const data = await apiGet(`/notifications/${currentUser.id}`);

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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!currentUser || isGuest) {
            setIsLoading(false);
            return;
        }
        loadNotifications();
    }, [currentUser, loading, isGuest]);

    const handleNotificationPress = async (notification) => {
        if (!notification?.id) return;

        // Mark as read immediately in UI
        if (!notification.read) {
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? {...n, read: true} : n)
            );
            apiPatch(`/notifications/read/${notification.id}`).catch(console.error);
            refresh();
        }

        // Navigate based on type
        switch (notification.type) {
            case 'LISTING_LIKED':
            case 'REVIEW':
                if (notification.listingsId) {
                    navigation.navigate('ProductDetailsScreen', {listingId: notification.listingsId});
                }
                break;
            case 'FOLLOW':
                navigation.navigate('ProfileScreen');
                break;
        }
    };

    const handleMarkAllRead = async () => {
        if (!currentUser?.id || unreadCount === 0) return;

        try {
            setNotifications(prev => prev.map(n => ({...n, read: true})));
            await apiPatch(`/notifications/mark-all-read/${currentUser.id}`);
            refresh();
        } catch (error) {
            console.error("Failed to mark all as read:", error);
            loadNotifications();
        }
    };

    const handleClearAll = async () => {
        if (!currentUser?.id) return;

        try {
            setNotifications([]);
            await apiDelete(`/notifications/clear/${currentUser.id}`);
            refresh();
        } catch (error) {
            console.error("Failed to clear notifications:", error);
            loadNotifications();
        }
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <RelaxSVG width={180} height={180}/>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyText}>
                {filter === 'unread'
                    ? "No unread notifications"
                    : "You have no notifications yet"}
            </Text>
        </View>
    );

    const renderLoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary}/>
        </View>
    );

    return (
        <SafeAreaProvider style={styles.container}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>

            {/* Header */}
            <AppHeader
                onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Explore")}
                centerComponent={
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>Notifications</Text>
                        {unreadCount > 0 && (
                            <View style={styles.headerBadge}>
                                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </View>
                }
            />

            {/* Filters */}
            {notifications.length > 0 && (
                <View style={styles.filterBar}>
                    <View style={styles.filterTabs}>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'all' && styles.activeTab]}
                            onPress={() => setFilter('all')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'all' && styles.activeText]}>
                                All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'unread' && styles.activeTab]}
                            onPress={() => setFilter('unread')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'unread' && styles.activeText]}>
                                Unread
                            </Text>
                            {unreadCount > 0 && (
                                <View style={styles.filterBadge}>
                                    <Text style={styles.filterBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Actions */}
                    <View style={styles.actions}>
                        {unreadCount > 0 && (
                            <TouchableOpacity onPress={handleMarkAllRead} style={styles.actionBtn}>
                                <Icon name="checkmark-done" size={18} color={COLORS.primary}/>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={handleClearAll} style={styles.actionBtn}>
                            <Icon name="trash-outline" size={18} color="#EF4444"/>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* List */}
            {isLoading ? (
                renderLoadingState()
            ) : (
                <FlatList
                    data={filteredNotifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <NotificationItem item={item} onPress={handleNotificationPress}/>
                    )}
                    ListEmptyComponent={renderEmptyState}
                    contentContainerStyle={[
                        styles.listContent,
                        filteredNotifications.length === 0 && styles.listContentEmpty
                    ]}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.dark.text,
    },
    headerBadge: {
        backgroundColor: COLORS.error,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    headerBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.dark.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    filterTabs: {
        flexDirection: 'row',
        gap: 8,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.dark.bg,
        gap: 6,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
    },
    activeText: {
        color: '#fff',
    },
    filterBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    filterBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.dark.bg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    listContentEmpty: {
        flexGrow: 1,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: COLORS.dark.card,
        borderRadius: 12,
        marginBottom: 8,
        position: 'relative',
    },
    unreadIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
        backgroundColor: COLORS.primary,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        marginBottom: 2,
    },
    unreadTitle: {
        color: COLORS.dark.text,
        fontWeight: '700',
    },
    description: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        lineHeight: 18,
        marginBottom: 4,
    },
    time: {
        fontSize: 12,
        color: COLORS.dark.textQuaternary,
        fontWeight: '500',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginTop: 24,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.dark.textTertiary,
        textAlign: 'center',
    },
});