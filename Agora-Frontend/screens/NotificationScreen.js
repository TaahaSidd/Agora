import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { apiDelete, apiGet, apiPatch } from '../services/api';
import { useUserStore } from '../stores/userStore';
import { useNotificationCount } from '../hooks/useNotificationCount';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../utils/colors';
import RelaxSVG from '../assets/svg/RelaxSVG.svg';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getNotificationMeta = (type) => {
    const normalized = type?.toLowerCase().replace(/_/g, '');
    const map = {
        listingliked: { icon: 'heart', color: '#EC4899' },
        listingsold: { icon: 'checkmark-circle', color: '#10B981' },
        listingapproved: { icon: 'shield-checkmark', color: '#10B981' },
        listingrejected: { icon: 'close-circle', color: COLORS.error },
        newlisting: { icon: 'add-circle', color: COLORS.primary },
        message: { icon: 'chatbubble-ellipses', color: COLORS.primary },
        offer: { icon: 'pricetag', color: '#8B5CF6' },
        pricedrop: { icon: 'trending-down', color: '#F59E0B' },
        order: { icon: 'receipt', color: '#3B82F6' },
        payment: { icon: 'card', color: '#10B981' },
        follow: { icon: 'person-add', color: '#8B5CF6' },
        review: { icon: 'star', color: '#F59E0B' },
        alert: { icon: 'alert-circle', color: COLORS.error },
        info: { icon: 'information-circle', color: COLORS.primary },
    };
    return map[normalized] || { icon: 'notifications', color: COLORS.primary };
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

// ─── Notification Item ─────────────────────────────────────────────────────────

const NotificationItem = ({ item, onPress, isLast }) => {
    const { icon, color } = getNotificationMeta(item.type);
    const isRead = item.read;

    return (
        <TouchableOpacity
            onPress={() => onPress(item)}
            style={[styles.notifRow, !isLast && styles.notifRowBorder]}
            activeOpacity={0.6}
        >
            <View style={[
                styles.iconWrapper,
                { backgroundColor: isRead ? COLORS.gray100 : `${color}12` },
            ]}>
                <Ionicons
                    name={icon}
                    size={18}
                    color={isRead ? COLORS.gray400 : color}
                />
            </View>

            <View style={styles.textContent}>
                <View style={styles.titleRow}>
                    <Text
                        numberOfLines={1}
                        style={[styles.title, !isRead && styles.titleUnread]}
                    >
                        {item.title}
                    </Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text numberOfLines={2} style={styles.description}>
                    {item.description}
                </Text>
            </View>

            {!isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function NotificationScreen() {
    const navigation = useNavigation();
    const { currentUser, loading, isGuest } = useUserStore();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const { unreadCount, refresh } = useNotificationCount(currentUser?.id, loading, isGuest);

    const loadNotifications = async () => {
        if (!currentUser?.id) return;
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
            console.error('Failed to load notifications:', e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!currentUser || isGuest) return;
        loadNotifications();
    }, [currentUser, loading, isGuest]);

    const handleNotificationPress = async (notification) => {
        if (!notification?.id) return;
        if (!notification.read) {
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
            );
            apiPatch(`/notifications/read/${notification.id}`).catch(console.error);
            refresh();
        }
        switch (notification.type) {
            case 'LISTING_LIKED':
            case 'REVIEW':
                if (notification.listingsId) {
                    navigation.navigate('ProductDetailsScreen', { listingId: notification.listingsId });
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
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            await apiPatch(`/notifications/mark-all-read/${currentUser.id}`);
            refresh();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
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
            console.error('Failed to clear notifications:', error);
            loadNotifications();
        }
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    if (isGuest || !currentUser) {
        return (
            <SafeAreaProvider style={styles.container}>
                <AppHeader title="Notifications" onBack={() => navigation.goBack()} />
                <View style={styles.centered}>
                    <View style={styles.emptyIconWrapper}>
                        <Ionicons name="notifications-outline" size={28} color={COLORS.gray400} />
                    </View>
                    <Text style={styles.emptyTitle}>Sign in Required</Text>
                    <Text style={styles.emptyText}>Please log in to view your notifications</Text>
                    <Button
                        title="Log In"
                        variant="primary"
                        icon="log-in-outline"
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider style={styles.container}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />

            <AppHeader
                onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Explore')}
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
                rightComponent={
                    notifications.length > 0 && (
                        <TouchableOpacity onPress={handleClearAll} style={styles.headerAction}>
                            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                        </TouchableOpacity>
                    )
                }
            />

            {/* Filter bar */}
            {notifications.length > 0 && (
                <View style={styles.filterBar}>
                    <View style={styles.filterTabs}>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                            onPress={() => setFilter('all')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                                All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
                            onPress={() => setFilter('unread')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
                                Unread
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {unreadCount > 0 && (
                        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.6}>
                            <Text style={styles.markAllText}>Mark all read</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {isLoading ? (
                <View style={styles.centered}>
                    <LoadingSpinner size="medium" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredNotifications}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <NotificationItem
                            item={item}
                            onPress={handleNotificationPress}
                            isLast={index === filteredNotifications.length - 1}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <RelaxSVG width={140} height={100} />
                            <Text style={styles.emptyTitle}>All Caught Up!</Text>
                            <Text style={styles.emptyText}>
                                {filter === 'unread'
                                    ? "You've read everything. Time to relax!"
                                    : "We'll ping you when something happens."}
                            </Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaProvider>
    );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },

    // Header
    headerCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.3,
    },
    headerBadge: {
        backgroundColor: COLORS.error,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    headerBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '700',
    },
    headerAction: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${COLORS.error}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Filter bar
    filterBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    filterTabs: {
        flexDirection: 'row',
        backgroundColor: COLORS.gray100,
        padding: 3,
        borderRadius: 10,
        gap: 2,
    },
    filterTab: {
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 8,
    },
    filterTabActive: {
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.gray400,
    },
    filterTextActive: {
        color: COLORS.light.text,
        fontWeight: '600',
    },
    markAllText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },

    // List
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 40,
    },

    // Flat list rows — no cards
    notifRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
    },
    notifRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    textContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    title: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.gray400,
        flex: 1,
        marginRight: 8,
    },
    titleUnread: {
        fontWeight: '600',
        color: COLORS.light.text,
    },
    time: {
        fontSize: 11,
        color: COLORS.gray300,
    },
    description: {
        fontSize: 12,
        color: COLORS.gray400,
        lineHeight: 17,
    },
    unreadDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        flexShrink: 0,
    },

    // Empty & loading
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: 100,
    },
    emptyIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.light.text,
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    emptyText: {
        fontSize: 13,
        color: COLORS.gray400,
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 20,
    },
});