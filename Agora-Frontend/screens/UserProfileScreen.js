import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import {Image} from 'expo-image';
import {Ionicons} from '@expo/vector-icons';

import {useUserStore} from '../stores/userStore';
import AppHeader from '../components/AppHeader';

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const UserProfileScreen = ({navigation, route}) => {
    const {currentUser, loading: userLoading, isGuest, fetchUser} = useUserStore();
    const {profileImage} = route.params || {};
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUser();
        setRefreshing(false);
    };

    if (userLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <AppHeader title="My Profile" onBack={() => navigation.goBack()}/>
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                </View>
            </SafeAreaView>
        );
    }

    if (!currentUser || isGuest) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <AppHeader title="My Profile" onBack={() => navigation.goBack()}/>
                <View style={styles.emptyState}>
                    <Ionicons name="person-outline" size={80} color={COLORS.dark.textTertiary}/>
                    <Text style={styles.emptyTitle}>Sign in Required</Text>
                    <Text style={styles.emptyText}>Please log in to view your profile</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader
                title="My Profile"
                onBack={() => navigation.goBack()}
                rightComponent={
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('EditProfileScreen', {
                                user: currentUser,
                                profileImage: currentUser?.avatar
                            })
                        }
                        style={styles.editButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="create-outline" size={22} color={COLORS.primary}/>
                    </TouchableOpacity>
                }
            />

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            >
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{uri: currentUser?.avatar || profileImage || 'https://i.pravatar.cc/100'}}
                            style={styles.avatar}
                            cachePolicy="disk"
                        />
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={28} color={COLORS.success}/>
                        </View>
                    </View>

                    <Text style={styles.userName}>{currentUser.name || 'User'}</Text>
                    <Text style={styles.userEmail}>{currentUser.email || 'email@example.com'}</Text>
                </View>

                {/* Personal Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="person" size={20} color={COLORS.primary}/>
                        </View>
                        <Text style={styles.cardTitle}>Personal Information</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="person-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <Text style={styles.infoLabel}>Full Name</Text>
                        </View>
                        <Text style={styles.infoValue}>{currentUser.name || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <Text style={styles.infoLabel}>Email</Text>
                        </View>
                        <Text style={styles.infoValue} numberOfLines={1}>{currentUser.email || 'N/A'}</Text>
                    </View>

                    <View style={[styles.infoItem, styles.infoItemLast]}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="call-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <Text style={styles.infoLabel}>Phone</Text>
                        </View>
                        <Text style={styles.infoValue}>
                            {currentUser.mobileNumber || 'Not provided'}
                        </Text>
                    </View>
                </View>

                {/* Academic Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, {backgroundColor: COLORS.warning + '15'}]}>
                            <Ionicons name="school" size={20} color={COLORS.warning}/>
                        </View>
                        <Text style={styles.cardTitle}>Academic Information</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="card-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <Text style={styles.infoLabel}>Student ID</Text>
                        </View>
                        <Text style={styles.infoValue}>{currentUser.idCardNo || 'N/A'}</Text>
                    </View>

                    <View style={[styles.infoItem, styles.infoItemLast]}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="school-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <Text style={styles.infoLabel}>College</Text>
                        </View>
                        <Text style={styles.infoValue} numberOfLines={1}>
                            {currentUser.collegeName || 'N/A'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    scrollContainer: {
        paddingBottom: THEME.spacing['3xl'],
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    loadingContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing['2xl'],
    },
    emptyTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginTop: THEME.spacing.lg,
        marginBottom: THEME.spacing[2],
    },
    emptyText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Profile Header
    profileHeader: {
        alignItems: 'center',
        paddingVertical: THEME.spacing['2xl'],
        paddingHorizontal: THEME.spacing.md,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: THEME.spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.dark.card,
        borderWidth: 3,
        borderColor: COLORS.dark.border,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.dark.bg,
        borderRadius: 14,
    },
    userName: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[1],
        textAlign: 'center',
    },
    userEmail: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
        textAlign: 'center',
    },

    // Card Styles
    card: {
        backgroundColor: COLORS.dark.card,
        marginHorizontal: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
        gap: THEME.spacing[3],
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
    },

    // Info Items
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: THEME.spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    infoItemLast: {
        borderBottomWidth: 0,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: THEME.spacing[2],
        flex: 1,
    },
    infoLabel: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
    },
    infoValue: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.text,
        textAlign: 'right',
        flex: 1,
    },
});

export default UserProfileScreen;