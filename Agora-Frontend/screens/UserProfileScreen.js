import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { useUserStore } from '../stores/userStore';
import AppHeader from '../components/AppHeader';
import LoadingSpinner from '../components/LoadingSpinner';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const UserProfileScreen = ({ navigation, route }) => {
    const { currentUser, loading: userLoading, isGuest, fetchUser } = useUserStore();
    const { profileImage } = route.params || {};
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
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title="My Profile" onBack={() => navigation.goBack()} />
                <View style={styles.centered}>
                    <LoadingSpinner />
                </View>
            </SafeAreaView>
        );
    }

    if (!currentUser || isGuest) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title="My Profile" onBack={() => navigation.goBack()} />
                <View style={styles.centered}>
                    <View style={styles.emptyIconWrapper}>
                        <Ionicons name="person-outline" size={28} color={COLORS.gray400} />
                    </View>
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
                        onPress={() => navigation.navigate('EditProfileScreen', {
                            user: currentUser,
                            profileImage: currentUser?.avatar,
                        })}
                        style={styles.editButton}
                        activeOpacity={0.6}
                    >
                        <Ionicons name="create-outline" size={18} color={COLORS.primary} />
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
                            source={{ uri: currentUser?.avatar || profileImage || 'https://i.pravatar.cc/100' }}
                            style={styles.avatar}
                            cachePolicy="disk"
                        />
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                        </View>
                    </View>
                    <Text style={styles.userName}>
                        {currentUser.name || 'User'}
                    </Text>
                    <Text style={styles.userEmail}>
                        {currentUser.email || 'email@example.com'}
                    </Text>
                </View>

                {/* Personal Information */}
                <InfoCard
                    iconName="person"
                    iconColor={COLORS.primary}
                    title="Personal Information"
                >
                    <InfoRow
                        icon="person-outline"
                        label="Full Name"
                        value={currentUser.name || 'N/A'}
                    />
                    <InfoRow
                        icon="mail-outline"
                        label="Email"
                        value={currentUser.email || 'N/A'}
                    />
                    <InfoRow
                        icon="call-outline"
                        label="Phone"
                        value={currentUser.mobileNumber || 'Not provided'}
                        isLast
                    />
                </InfoCard>

                {/* College Information */}
                <InfoCard
                    iconName="school"
                    iconColor={COLORS.warning}
                    title="College Information"
                >
                    <InfoRow
                        icon="school-outline"
                        label="College"
                        value={currentUser.collegeName || 'N/A'}
                        isLast
                    />
                </InfoCard>
            </ScrollView>
        </SafeAreaView>
    );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const InfoCard = ({ iconName, iconColor, title, children }) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, { backgroundColor: `${iconColor}12` }]}>
                <Ionicons name={iconName} size={18} color={iconColor} />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {children}
    </View>
);

const InfoRow = ({ icon, label, value, isLast }) => (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
        <View style={styles.infoLeft}>
            <Ionicons name={icon} size={16} color={COLORS.gray400} />
            <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    scrollContainer: {
        paddingTop: 8,
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },

    // Empty state
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
    },

    // Edit button
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${COLORS.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Profile header
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 14,
    },
    avatar: {
        width: 84,
        height: 84,
        borderRadius: 24,
        backgroundColor: COLORS.gray100,
        borderWidth: 1,
        borderColor: COLORS.gray100,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -3,
        right: -3,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 3,
    },
    userEmail: {
        fontSize: 13,
        color: COLORS.gray400,
        fontWeight: '400',
    },

    // Cards
    card: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        gap: 10,
    },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
    },

    // Info rows
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 11,
        minHeight: 42,
    },
    infoRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoLabel: {
        fontSize: 13,
        color: COLORS.gray400,
        fontWeight: '400',
    },
    infoValue: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.light.text,
        letterSpacing: -0.1,
        maxWidth: '55%',
        textAlign: 'right',
    },
});

export default UserProfileScreen;