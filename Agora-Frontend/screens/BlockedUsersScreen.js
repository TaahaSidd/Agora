import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { useModeration } from '../hooks/useModeration';
import { THEME } from '../utils/theme';
import { COLORS } from "../utils/colors";
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import ToastMessage from "../components/ToastMessage";

const BlockedUsersScreen = ({ navigation }) => {
    const { fetchBlockedUsers, unblockUser, loading } = useModeration();
    const [blockedList, setBlockedList] = useState([]);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    const loadData = async () => {
        const data = await fetchBlockedUsers();
        console.log("BLOCKED USErs = ", data);

        setBlockedList(data.blocked || []);    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUnblock = async (user) => {
        await unblockUser(user.id, () => {
            setBlockedList(prev => prev.filter(u => u.id !== user.id));

            showToast({
                type: 'success',
                title: 'User Unblocked',
                message: `${user.name}'s listings will now show up in your feed.`
            });
        });
    };
    const ListHeader = () => (
        <View style={styles.headerSection}>
            <Text style={styles.listTitle}>Privacy Control</Text>
            <Text style={styles.subtitle}>
                Users in this list cannot message you or see your listings.
                You will not see their content in your feed.
            </Text>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.userInfo}>
                {item.profilePic ? (
                    <Image source={{ uri: item.profilePic }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
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
                onPress={() => handleUnblock(item)}
                activeOpacity={THEME.opacity.pressed}
                style={styles.unblockButton}
            >
                <Text style={styles.unblockButtonText}>Unblock</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="light-content" />

            <AppHeader
                title="Blocked Users"
                onBack={() => navigation.goBack()}
            />

            <FlatList
                data={blockedList}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 40 }} />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Ionicons name="shield-checkmark" size={40} color={COLORS.accent} />
                            </View>
                            <Text style={styles.emptyText}>Clean Slate</Text>
                            <Text style={styles.emptySubtext}>You haven't blocked anyone yet.</Text>
                        </View>
                    )
                }
                renderItem={renderItem}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({...toast, visible: false})}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    headerSection: {
        marginTop: THEME.spacing.md,
        marginBottom: THEME.spacing.lg,
        paddingHorizontal: 4,
    },
    listTitle: {
        color: COLORS.dark.text,
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
    },
    subtitle: {
        color: COLORS.dark.textSecondary,
        fontSize: THEME.fontSize.sm,
        lineHeight: 20,
        marginTop: 6,
    },
    listContent: {
        paddingHorizontal: THEME.spacing.screenPadding,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        padding: THEME.spacing.cardPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.itemGap,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    avatar: {
        width: THEME.avatarSize.md,
        height: THEME.avatarSize.md,
        borderRadius: THEME.borderRadius.avatar,
        marginRight: THEME.spacing.sm,
    },
    avatarPlaceholder: {
        width: THEME.avatarSize.md,
        height: THEME.avatarSize.md,
        borderRadius: THEME.borderRadius.avatar,
        backgroundColor: COLORS.gray800,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: THEME.spacing.sm,
    },
    avatarText: {
        color: COLORS.dark.text,
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
    },
    userName: {
        color: COLORS.dark.text,
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
    },
    userStatus: {
        color: COLORS.errorLight,
        fontSize: THEME.fontSize.xs,
        marginTop: 2,
    },
    unblockButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: THEME.borderRadius.button,
        backgroundColor: COLORS.dark.bg,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    unblockButtonText: {
        color: COLORS.dark.text,
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.dark.card,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        color: COLORS.dark.text,
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
    },
    emptySubtext: {
        color: COLORS.dark.textSecondary,
        fontSize: THEME.fontSize.sm,
        textAlign: 'center',
        marginTop: 8,
    },
});

export default BlockedUsersScreen;