import React, {useEffect, useState, useMemo} from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {signInAnonymously} from 'firebase/auth';
import {auth} from '../firebase/firebaseConfig';

import {useUserStore} from "../stores/userStore";
import {useChatRooms} from '../hooks/useChatRooms';
import {useChatNotifications} from '../hooks/useChatNotifications';
import {useMarkChatAsRead} from '../hooks/useMarkChatAsRead';
import {deleteChatForMe} from "../utils/chatService";
import { useChatBlocking } from '../context/ChatBlockingProvider';

import LoadingSpinner from '../components/LoadingSpinner';
import ModalComponent from '../components/Modal';
import ToastMessage from '../components/ToastMessage';
import AppHeader from '../components/AppHeader';
import SearchInput from '../components/SearchInput';
import Button from '../components/Button';

import CloudsSvg from '../assets/svg/clouds.svg'

import {COLORS} from '../utils/colors';

const sanitizeEmail = (email) => email.replace(/\./g, '_');

// Chat Skeleton Loader Component
const ChatItemSkeleton = () => {
    const shimmerAnimation = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(Animated.timing(shimmerAnimation, {
            toValue: 1, duration: 1500, useNativeDriver: true,
        })).start();
    }, []);

    const opacity = shimmerAnimation.interpolate({
        inputRange: [0, 0.5, 1], outputRange: [0.3, 0.6, 0.3],
    });

    return (<View style={styles.chatItem}>
        <Animated.View style={[styles.skeletonImage, {opacity}]}/>

        <View style={styles.chatContent}>
            <View style={styles.topRow}>
                <Animated.View style={[styles.skeletonName, {opacity}]}/>
                <Animated.View style={[styles.skeletonTime, {opacity}]}/>
            </View>
            <Animated.View style={[styles.skeletonUserName, {opacity}]}/>
            <Animated.View style={[styles.skeletonMessage, {opacity}]}/>
        </View>
    </View>);
};

const ChatScreen = ({scrollY}) => {
    const navigation = useNavigation();
    const {currentUser, loading, fetchUser, isGuest} = useUserStore();
    const { isUserBlocked, blockedUserIds } = useChatBlocking();
    const markChatAsRead = useMarkChatAsRead();
    useChatNotifications(currentUser?.email, currentUser?.id);

    useEffect(() => {
        if (currentUser && !auth.currentUser) {
            signInAnonymously(auth)
                .then(() => console.log('✅ Firebase Auth ready'))
                .catch(err => console.error('❌ Firebase Auth error:', err));
        }
    }, [currentUser]);

    const {chatRooms, loading: chatsLoading, error} = useChatRooms(currentUser?.email);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState('all');
    const [modalVisible, setModalVisible] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [openingChat, setOpeningChat] = useState(false);
    const isFetchingChats = chatsLoading;

    if (loading) {
        return (<SafeAreaView style={styles.safeArea}>
            <AppHeader title="Messages"/>
            <View style={styles.loadingContainer}>
                <LoadingSpinner size="large" color={COLORS.primary}/>
            </View>
        </SafeAreaView>);
    }

    if (isGuest || !currentUser) {
        return (<SafeAreaView style={styles.safeArea}>
            <AppHeader title="Messages"/>
            <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={80} color={COLORS.dark.textTertiary}/>
                <Text style={styles.emptyTitle}>Log in Required</Text>
                <Text style={styles.emptyText}>
                    Please log in to view and send messages
                </Text>
                <Button
                    title="Log In"
                    variant="primary"
                    icon="log-in-outline"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        </SafeAreaView>);
    }

    if (error) {
        console.error('Chat rooms error:', error);
    }

    const onRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1000);
    };

    const formatTime = (timestamp) => {
        if (!timestamp || timestamp.seconds == null) return '';
        const date = new Date(timestamp.seconds * 1000);
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
        return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
    };

    // const filteredChats = chatRooms.filter(chat => {
    //     const otherUser = chat.participantsInfo?.find(p => p.id !== currentUser.email);
    //     const listingTitle = chat.listing?.title || '';
    //     const matchesSearch = otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || listingTitle.toLowerCase().includes(searchQuery.toLowerCase());
    //
    //     if (filter === 'unread') {
    //         const sanitizedEmail = sanitizeEmail(currentUser.email);
    //         const userLastRead = chat.lastRead?.[sanitizedEmail]?.seconds ?? 0;
    //         const lastMsgTimestamp = chat.lastMessage?.createdAt?.seconds ?? 0;
    //         const isUnread = lastMsgTimestamp > 0 && lastMsgTimestamp > userLastRead && chat.lastMessage?.senderId !== currentUser.email;
    //         return matchesSearch && isUnread;
    //     }
    //
    //     return matchesSearch;
    // });

    const filteredChatRooms = useMemo(() => {
        if (!chatRooms) return [];

        return chatRooms.filter(chat => {
            const otherUser = chat.participantsInfo?.find(p => p.id !== currentUser.email);

            if (!otherUser) return true;

            const otherUserId = otherUser.userId;

            if (!otherUserId) {
                console.warn('Missing userId in chat:', chat.id);
                return true;
            }

            const isBlocked = isUserBlocked(otherUserId);

            if (isBlocked) {
                console.log('🚫 Hiding blocked chat with userId:', otherUserId);
            }

            return !isBlocked;
        });
    }, [chatRooms, blockedUserIds, currentUser]);

    const unreadCount = chatRooms.filter(chat => {
        const sanitizedEmail = sanitizeEmail(currentUser.email);
        const userLastRead = chat.lastRead?.[sanitizedEmail]?.seconds ?? 0;
        const lastMsgTimestamp = chat.lastMessage?.createdAt?.seconds ?? 0;
        return lastMsgTimestamp > 0 && lastMsgTimestamp > userLastRead && chat.lastMessage?.senderId !== currentUser.email;
    }).length;

    const handleChatPress = async (item) => {
        if (openingChat) return;

        setOpeningChat(true);

        const otherUser = item.participantsInfo?.find(p => p.id !== currentUser.email);

        const sanitizedEmail = sanitizeEmail(currentUser.email);
        try {
            await markChatAsRead(item.id, sanitizedEmail);
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }

        navigation.navigate('ChatRoomScreen', {
            roomId: item.id,
            sellerName: otherUser?.name || 'Seller',
            sellerId: otherUser?.id,
            sellerAvatar: otherUser?.avatar || null,
            productInfo: item.listing ? {
                id: item.listingId,
                sellerId: otherUser?.userId,
                name: item.listing.title,
                title: item.listing.title,
                price: item.listing.price,
                images: item.listing.imageUrl || [],
                imageUrl: item.listing.imageUrl || [],
                ...item.listing,
            } : null,
        });

        setOpeningChat(false);
    };

    const handleLongPress = (chat) => {
        setChatToDelete(chat);
        setModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (chatToDelete) {
            try {
                console.log('Hiding chat', chatToDelete.id);
                await deleteChatForMe(chatToDelete.id, currentUser.email);
                console.log('Chat hidden successfully');
                setModalVisible(false);
                setChatToDelete(null);
                setToastVisible(true);
            } catch (error) {
                console.error('Failed to hide chat:', error);
            }
        }
    };

    const renderChatItem = ({item, index}) => {
        const otherUser = item.participantsInfo?.find(p => p.id !== currentUser.email);
        const lastMessage = item.lastMessage?.text || 'No messages yet';
        const listingTitle = item.listing?.title || 'Item';

        const getImageUri = () => {
            if (!item.listing?.imageUrl?.[0]) return null;
            const firstImage = item.listing.imageUrl[0];
            return typeof firstImage === 'string' ? firstImage : firstImage.uri || firstImage.url;
        };

        const imageUri = getImageUri();

        const sanitizedEmail = sanitizeEmail(currentUser.email);
        const userLastRead = item.lastRead?.[sanitizedEmail]?.seconds ?? 0;
        const lastMsgTimestamp = item.lastMessage?.createdAt?.seconds ?? 0;
        const isUnread = lastMsgTimestamp > 0 && lastMsgTimestamp > userLastRead && item.lastMessage?.senderId !== currentUser.email;

        // console.log('Chat unread check:', {
        //     chatId: item.id,
        //     sanitizedEmail,
        //     userLastRead,
        //     lastMsgTimestamp,
        //     isUnread,
        //     lastReadData: item.lastRead?.[sanitizedEmail],
        // });

        return (<TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleChatPress(item)}
            onLongPress={() => handleLongPress(item)}
            activeOpacity={0.7}
        >
            {/* Listing Image with Avatar Badge */}
            <View style={styles.imageContainer}>
                {/* Product Image */}
                <Image
                    source={imageUri ? {uri: imageUri} : require('../assets/LW.jpg')}
                    style={styles.productImage}
                />
                {/* User Avatar Badge */}
                <View style={styles.avatarBadge}>
                    <Image
                        source={otherUser?.avatar ? {uri: otherUser.avatar} : require('../assets/defaultProfile.png')}
                        style={styles.avatarSmall}
                    />
                </View>
            </View>

            {/* Chat Content */}
            <View style={styles.chatContent}>
                {/* Listing Title & Time */}
                <View style={styles.topRow}>
                    <Text style={styles.listingTitle} numberOfLines={1}>
                        {listingTitle}
                    </Text>
                    <Text style={styles.time}>{formatTime(item.lastMessage?.createdAt)}</Text>
                </View>

                {/* User Name */}
                <Text style={styles.userName} numberOfLines={1}>
                    with {otherUser?.name || 'Unknown Seller'}
                </Text>

                {/* Last Message */}
                <View style={styles.messageRow}>
                    {item.lastMessage?.senderId === currentUser.email && (<Ionicons
                        name="checkmark-done"
                        size={14}
                        color="#9CA3AF"
                        style={{marginRight: 4}}
                    />)}
                    <Text
                        style={[styles.lastMessage, isUnread && styles.lastMessageUnread]}
                        numberOfLines={1}
                    >
                        {lastMessage}
                    </Text>
                </View>
            </View>

            {/* Unread badge */}
            {isUnread && (<View style={styles.unreadBadge}>
                <View style={styles.unreadDot}/>
            </View>)}

            {/* Chevron */}
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" style={styles.chevron}/>
        </TouchableOpacity>);
    };

    const renderEmptyState = () => (<View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
            <CloudsSvg width={180} height={180}/>
        </View>
        <Text style={styles.emptyTitle}>No active chats... yet!</Text>
        <Text style={styles.emptyText}>
            Found something you like? Message the seller to ask questions, negotiate prices, or arrange a meeting on
            campus.
        </Text>
        <Button
            title="Browse Listings"
            variant="primary"
            icon="compass-outline"
            onPress={() => navigation.navigate('Explore')}
        />
    </View>);

    const renderSkeletonLoader = () => (<View style={styles.skeletonContainer}>
        {[1, 2, 3, 4, 5].map((item) => (<ChatItemSkeleton key={item}/>))}
    </View>);

    return (<SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <AppHeader title="Messages"/>

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
        {chatRooms.length > 0 && (<View style={styles.filterContainer}>
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
                        <Text
                            style={[styles.filterBadgeText, filter === 'all' && styles.filterBadgeTextActive]}>
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
                            <Text
                                style={[styles.filterBadgeText, filter === 'unread' && styles.filterBadgeTextActive]}>
                                {unreadCount}
                            </Text>
                        </View>)}
                </TouchableOpacity>
            </View>
        </View>)}

        {/* Content Area */}
        {isFetchingChats ? (renderSkeletonLoader()) : filteredChatRooms.length === 0 && chatRooms.length === 0 ? (renderEmptyState()) : filteredChatRooms.length === 0 && searchQuery ? (
            <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={80} color={COLORS.dark.textTertiary}/>
                <Text style={styles.emptyTitle}>No Results Found</Text>
                <Text style={styles.emptyText}>
                    Try searching with a different name or item
                </Text>
            </View>) : filteredChatRooms.length === 0 && filter === 'unread' ? (<View style={styles.emptyState}>
            <Ionicons name="checkmark-done-outline" size={80} color={COLORS.dark.textTertiary}/>
            <Text style={styles.emptyTitle}>All Caught Up!</Text>
            <Text style={styles.emptyText}>
                You have no unread messages
            </Text>
        </View>) : (<Animated.FlatList
            data={filteredChatRooms}
            keyExtractor={(item) => item.id}
            renderItem={renderChatItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 16}}
            scrollEventThrottle={16}
            onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {useNativeDriver: true})}
            refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
            />}
        />)}

        <ModalComponent
            visible={modalVisible}
            type="delete"
            title="Delete Chat?"
            message={`Are you sure you want to delete this conversation? This action cannot be undone.`}
            onPrimaryPress={handleConfirmDelete}
            onSecondaryPress={() => {
                setModalVisible(false);
                setChatToDelete(null);
            }}
        />

        {toastVisible && (<ToastMessage
            type="info"
            message="Chat deleted"
            onHide={() => setToastVisible(false)}
        />)}

        {/* Global Loading Overlay - ONE for all chats */}
        {openingChat && (
            <View style={styles.globalLoadingOverlay}>
                <View style={styles.loadingCard}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                    <Text style={styles.loadingText}>Opening chat...</Text>
                </View>
            </View>
        )}
    </SafeAreaView>);
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1, backgroundColor: COLORS.dark.bg,
    }, loadingContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.dark.bg,
    }, searchContainer: {
        paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.dark.card,
    }, filterContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: COLORS.dark.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    }, filterTabs: {
        flexDirection: 'row', gap: 8,
    }, filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.dark.bgElevated,
        gap: 6,
    }, filterTabActive: {
        backgroundColor: COLORS.dark.cardElevated, borderWidth: 1, borderColor: COLORS.primary,
    }, filterText: {
        fontSize: 14, fontWeight: '600', color: COLORS.dark.textSecondary,
    }, filterTextActive: {
        color: COLORS.primary,
    }, filterBadge: {
        backgroundColor: COLORS.dark.bgElevated,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
    }, filterBadgeActive: {
        backgroundColor: COLORS.primary,
    }, filterBadgeText: {
        fontSize: 12, fontWeight: '700', color: COLORS.dark.textSecondary,
    }, filterBadgeTextActive: {
        color: COLORS.white,
    }, chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: COLORS.dark.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    }, imageContainer: {
        position: 'relative', marginRight: 12,
    }, productImage: {
        width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.dark.bgElevated,
    }, avatarBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: COLORS.dark.card,
        borderWidth: 2,
        borderColor: COLORS.dark.card,
        alignItems: 'center',
        justifyContent: 'center',
    }, avatarSmall: {
        width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.dark.bgElevated,
    }, chatContent: {
        flex: 1, marginRight: 8,
    }, topRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3,
    }, listingTitle: {
        fontSize: 16, fontWeight: '700', color: COLORS.dark.text, flex: 1, marginRight: 8, letterSpacing: -0.3,
    }, userName: {
        fontSize: 13, fontWeight: '500', color: COLORS.dark.textTertiary, marginBottom: 4, letterSpacing: -0.1,
    }, time: {
        fontSize: 12, color: COLORS.dark.textSecondary, fontWeight: '600',
    }, messageRow: {
        flexDirection: 'row', alignItems: 'center',
    }, lastMessage: {
        fontSize: 14, color: COLORS.dark.textSecondary, flex: 1, lineHeight: 18,
    }, lastMessageUnread: {
        color: COLORS.dark.text, fontWeight: '600',
    }, unreadBadge: {
        marginRight: 4,
    }, unreadDot: {
        width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary,
    }, chevron: {
        marginLeft: 4,
    }, emptyState: {
        alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 100,
    }, emptyIcon: {
        width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    }, emptyTitle: {
        fontSize: 22, fontWeight: '800', color: COLORS.dark.text, marginBottom: 8,
    }, emptyText: {
        fontSize: 15, color: COLORS.dark.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 16,
    }, globalLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingCard: {
        backgroundColor: COLORS.dark.card,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: COLORS.dark.text,
        fontSize: 14,
        fontWeight: '600',
    }, // Skeleton styles
    skeletonContainer: {
        flex: 1, backgroundColor: COLORS.dark.bg,
    }, skeletonImage: {
        width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.dark.cardElevated, marginRight: 12,
    }, skeletonName: {
        width: 140, height: 16, borderRadius: 8, backgroundColor: COLORS.dark.cardElevated,
    }, skeletonUserName: {
        width: 100,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.dark.cardElevated,
        marginTop: 4,
        marginBottom: 6,
    }, skeletonTime: {
        width: 40, height: 12, borderRadius: 6, backgroundColor: COLORS.dark.cardElevated,
    }, skeletonMessage: {
        width: '75%', height: 14, borderRadius: 7, backgroundColor: COLORS.dark.cardElevated,
    },
});

export default ChatScreen;