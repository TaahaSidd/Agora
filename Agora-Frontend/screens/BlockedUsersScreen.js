import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Platform,
} from 'react-native';
import { useModeration } from '../hooks/useModeration';
import { COLORS } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import ToastMessage from '../components/ToastMessage';
import LoadingSpinner from '../components/LoadingSpinner';

const BlockedUsersScreen = ({ navigation }) => {
    const { fetchBlockedUsers, unblockUser, loading } = useModeration();
    const [blockedList, setBlockedList] = useState([]);
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });

    const showToast = ({ type, title, message }) =>
        setToast({ visible: true, type, title, message });

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchBlockedUsers();
            setBlockedList(data.blocked || []);
        };
        loadData();
    }, []);

    const handleUnblock = async (user) => {
        await unblockUser(user.id, () => {
            setBlockedList(prev => prev.filter(u => u.id !== user.id));
            showToast({
                type: 'success',
                title: 'User Unblocked',
                message: `${user.name}'s listings will now appear in your feed.`,
            });
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.light.bg} />
            <AppHeader title="Blocked Users" onBack={() => navigation.goBack()} />

            <FlatList
                data={blockedList}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Privacy Control</Text>
                        <Text style={styles.heroSubtitle}>
                            Users in this list cannot message you or see your listings. You will not see their content in your feed.
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.centered}>
                            <LoadingSpinner />
                        </View>
                    ) : (
                        <View style={styles.centered}>
                            <View style={styles.emptyIconWrapper}>
                                <Ionicons name="shield-checkmark-outline" size={28} color={COLORS.primary} />
                            </View>
                            <Text style={styles.emptyTitle}>Clean Slate</Text>
                            <Text style={styles.emptyText}>You haven't blocked anyone yet.</Text>
                        </View>
                    )
                }
                renderItem={({ item, index }) => (
                    <BlockedUserRow
                        item={item}
                        onUnblock={() => handleUnblock(item)}
                        isLast={index === blockedList.length - 1}
                    />
                )}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
        </View>
    );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const BlockedUserRow = ({ item, onUnblock, isLast }) => (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
        <View style={styles.userInfo}>
            {item.profilePic ? (
                <Image source={{ uri: item.profilePic }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>
                        {item.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
            )}
            <View style={styles.textContainer}>
                <Text style={styles.userName} numberOfLines={1}>{item.name || 'User'}</Text>
                <Text style={styles.userStatus}>Blocked</Text>
            </View>
        </View>

        <TouchableOpacity
            onPress={onUnblock}
            activeOpacity={0.6}
            style={styles.unblockBtn}
        >
            <Text style={styles.unblockBtnText}>Unblock</Text>
        </TouchableOpacity>
    </View>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    // Hero
    hero: {
        marginTop: 8,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },

    // List card wrapper
    listCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: { elevation: 1 },
        }),
    },

    // Rows — flat list style like NotificationScreen
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        backgroundColor: COLORS.light.bg,
    },
    rowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
        gap: 12,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: COLORS.gray100,
    },
    avatarPlaceholder: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: `${COLORS.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    textContainer: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        marginBottom: 2,
    },
    userStatus: {
        fontSize: 11,
        color: COLORS.error,
        fontWeight: '500',
    },

    // Unblock button
    unblockBtn: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: `${COLORS.primary}30`,
        backgroundColor: `${COLORS.primary}08`,
    },
    unblockBtnText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
    },

    // Empty & loading
    centered: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.3,
        marginBottom: 6,
    },
    emptyText: {
        fontSize: 13,
        color: COLORS.gray400,
        textAlign: 'center',
    },
});

export default BlockedUsersScreen;