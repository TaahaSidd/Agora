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
        setBlockedList(data.blocked || []);
    };

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
                activeOpacity={0.7}
                style={styles.unblockButton}
            >
                <Text style={styles.unblockButtonText}>Unblock</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.mainContainer}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

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
                                <Ionicons name="shield-checkmark-outline" size={40} color={COLORS.primary} />
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
        backgroundColor: COLORS.light.bg,
    },
    headerSection: {
        marginTop: 20,
        marginBottom: 24,
    },
    listTitle: {
        color: COLORS.light.text,
        fontSize: 22,
        fontWeight: '800',
    },
    subtitle: {
        color: COLORS.light.textSecondary,
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.light.bg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    avatarText: {
        color: COLORS.primary,
        fontSize: 18,
        fontWeight: '700',
    },
    userName: {
        color: COLORS.light.text,
        fontSize: 16,
        fontWeight: '700',
    },
    userStatus: {
        color: COLORS.error,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    unblockButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    unblockButtonText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        color: COLORS.light.text,
        fontSize: 20,
        fontWeight: '800',
    },
    emptySubtext: {
        color: COLORS.light.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 40,
    },
});

export default BlockedUsersScreen;