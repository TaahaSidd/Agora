import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    Animated,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useCurrentUser } from '../hooks/useCurrentUser';
import { useChatRooms } from '../hooks/useChatRooms';
import { useMarkChatAsRead } from '../hooks/useMarkChatAsRead';

import LoadingSpinner from '../components/LoadingSpinner';
import AppHeader from '../components/AppHeader';
import SearchInput from '../components/SearchInput';
import Button from '../components/Button';

import GraduationHats from '../assets/svg/graduationhats.svg';
import CloudsSvg from '../assets/svg/clouds.svg'

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const ChatScreen = ({ scrollY }) => {
    const navigation = useNavigation();
    const { user, loading } = useCurrentUser();
    const chatRooms = useChatRooms(String(user?.id));
    const markChatAsRead = useMarkChatAsRead();

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');

    if (loading) {
        return <LoadingSpinner />;
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const filteredChats = chatRooms.filter(chat => {
        const otherUser = chat.participantsInfo?.find(p => p.id !== user.email);
        const matchesSearch = otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'unread') {
            const userLastRead = chat.lastRead?.[user.email]?.seconds || 0;
            const lastMsgTimestamp = chat.lastMessage?.createdAt?.seconds || 0;
            const isUnread = lastMsgTimestamp > userLastRead && chat.lastMessage?.senderId !== user.email;
            return matchesSearch && isUnread;
        }

        return matchesSearch;
    });

    const unreadCount = chatRooms.filter(chat => {
        const userLastRead = chat.lastRead?.[user.email]?.seconds || 0;
        const lastMsgTimestamp = chat.lastMessage?.createdAt?.seconds || 0;
        return lastMsgTimestamp > userLastRead && chat.lastMessage?.senderId !== user.email;
    }).length;

    const handleChatPress = (item) => {
        const otherUser = item.participantsInfo?.find(p => p.id !== user.email);

        navigation.navigate('ChatRoomScreen', {
            roomId: item.id,
            sellerName: otherUser?.name || 'Seller',
            sellerId: otherUser?.id,
            productInfo: item.listing ? {
                name: item.listing.title,
                price: `₹${item.listing.price}`,
                image: item.listing.imageUrl?.[0] ? { uri: item.listing.imageUrl[0] } : require('../assets/LW.jpg'),
            } : null,
        });

        markChatAsRead(item.id, user.email);
    };

    const handleDeleteChat = (chatId) => {
        console.log('Delete chat:', chatId);
    };

    const renderChatItem = ({ item, index }) => {
        const otherUser = item.participantsInfo?.find(p => p.id !== user.email);
        const lastMessage = item.lastMessage?.text || 'No messages yet';

        const userLastRead = item.lastRead?.[user.email]?.seconds || 0;
        const lastMsgTimestamp = item.lastMessage?.createdAt?.seconds || 0;
        const isUnread = lastMsgTimestamp > userLastRead && item.lastMessage?.senderId !== user.email;

        return (
            <TouchableOpacity
                style={styles.chatItem}
                onPress={() => handleChatPress(item)}
                onLongPress={() => {
                    console.log('Long press menu');
                }}
                activeOpacity={0.7}
            >
                {/* Avatar with online status */}
                <View style={styles.avatarContainer}>
                    <Image
                        source={
                            otherUser?.avatar
                                ? { uri: otherUser.avatar }
                                : require('../assets/defaultProfile.png')
                        }
                        style={styles.avatar}
                    />
                    {/* Online indicator - you can make this dynamic */}
                    <View style={styles.onlineDot} />
                </View>

                {/* Chat Content */}
                <View style={styles.chatContent}>
                    <View style={styles.topRow}>
                        <Text style={styles.name} numberOfLines={1}>
                            {otherUser?.name || 'Unknown User'}
                        </Text>
                        <Text style={styles.time}>{formatTime(lastMsgTimestamp)}</Text>
                    </View>

                    <View style={styles.messageRow}>
                        {item.lastMessage?.senderId === user.email && (
                            <Ionicons
                                name="checkmark-done"
                                size={14}
                                color="#9CA3AF"
                                style={{ marginRight: 4 }}
                            />
                        )}
                        <Text
                            style={[styles.lastMessage, isUnread && styles.lastMessageUnread]}
                            numberOfLines={1}
                        >
                            {lastMessage}
                        </Text>
                    </View>

                    {/* Product preview tag */}
                    {item.listing && (
                        <View style={styles.productTag}>
                            <Ionicons name="cube-outline" size={12} color="#6B7280" />
                            <Text style={styles.productTagText} numberOfLines={1}>
                                {item.listing.title}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Unread badge */}
                {isUnread && (
                    <View style={styles.unreadBadge}>
                        <View style={styles.unreadDot} />
                    </View>
                )}

                {/* Chevron */}
                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={styles.chevron} />
            </TouchableOpacity>
        );
    };
    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
                <CloudsSvg width={180} height={180} />
            </View>
            <Text style={styles.emptyTitle}>No Conversations Yet</Text>
            <Text style={styles.emptyText}>
                Start chatting with sellers by messaging them from product listings
            </Text>
            <Button
                title="Browse Listings"
                variant="primary"
                icon="compass-outline"
                onPress={() => navigation.navigate('MainLayout')}
            />
        </View>
    );

    const ListHeader = () => (
        <>
            <AppHeader title="Messages" />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <SearchInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search conversations..."
                    onClear={() => setSearchQuery('')}
                />
            </View>

            {/* Filter Tabs */}
            {chatRooms.length > 0 && (
                <View style={styles.filterContainer}>
                    <View style={styles.filterTabs}>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
                            onPress={() => setFilter('all')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                                All
                            </Text>
                            <View style={[styles.filterBadge, filter === 'all' && styles.filterBadgeActive]}>
                                <Text style={[styles.filterBadgeText, filter === 'all' && styles.filterBadgeTextActive]}>
                                    {chatRooms.length}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
                            onPress={() => setFilter('unread')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'unread' && styles.filterTextActive]}>
                                Unread
                            </Text>
                            {unreadCount > 0 && (
                                <View style={[styles.filterBadge, filter === 'unread' && styles.filterBadgeActive]}>
                                    <Text style={[styles.filterBadgeText, filter === 'unread' && styles.filterBadgeTextActive]}>
                                        {unreadCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Animated.FlatList
                data={filteredChats}
                keyExtractor={(item) => item.id}
                renderItem={renderChatItem}
                ListEmptyComponent={renderEmptyState}
                ListHeaderComponent={ListHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 16 }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
            />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.dark.card,
    },
    filterContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
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
        backgroundColor: COLORS.dark.bgElevated,
        gap: 6,
    },
    filterTabActive: {
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
    },
    filterTextActive: {
        color: COLORS.primary,
    },
    filterBadge: {
        backgroundColor: COLORS.dark.bgElevated,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
    },
    filterBadgeActive: {
        backgroundColor: COLORS.primary,
    },
    filterBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.dark.textSecondary,
    },
    filterBadgeTextActive: {
        color: COLORS.white,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: COLORS.dark.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 12,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.dark.bgElevated,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.success,
        borderWidth: 2.5,
        borderColor: COLORS.dark.card,
    },
    chatContent: {
        flex: 1,
        marginRight: 8,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.dark.text,
        flex: 1,
        marginRight: 8,
    },
    time: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    lastMessage: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        flex: 1,
        lineHeight: 18,
    },
    lastMessageUnread: {
        color: COLORS.dark.text,
        fontWeight: '600',
    },
    productTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bgElevated,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        gap: 4,
        marginTop: 2,
    },
    productTagText: {
        fontSize: 11,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    unreadBadge: {
        marginRight: 4,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    chevron: {
        marginLeft: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    emptyIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 16,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
        elevation: 1,
    },
    emptyButtonText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
});

export default ChatScreen;