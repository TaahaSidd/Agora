import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import AppHeader from '../components/AppHeader';
import { apiGet } from '../services/api';
import QuickActions from '../components/QuickActions';
import ProfileSection from '../components/ProfileSection';

import { useUserStats } from '../hooks/useUserStats';
import { useFavorites } from '../hooks/useFavorites';
import { useAverageRating } from '../hooks/useAverageRating';
import { useCurrentUser } from '../hooks/useCurrentUser';

const UserProfileScreen = ({ navigation, route }) => {
    const { user: currentUser, loading: userLoading, isGuest } = useCurrentUser();
    const [user, setUser] = useState(null);
    const { profileImage } = route.params || {};
    const [loading, setLoading] = useState(true);

    const { listingsCount, loading: statsLoading } = useUserStats();
    const { favorites = [], loading: favLoading } = useFavorites();

    const currentUserId = currentUser?.id || null;
    const { rating, loading: ratingLoading } = useAverageRating('user', currentUserId);

    const averageRating = rating ?? 0;

    const statsActions = [
        {
            icon: 'list-outline',
            iconColor: '#2563EB',
            bgColor: '#E0E7FF',
            number: statsLoading || listingsCount == null ? '-' : listingsCount,
            label: 'Listings',
            onPress: () => navigation.navigate('MyListings'),
        },
        {
            icon: 'heart-outline',
            iconColor: '#DC2626',
            bgColor: '#FEE2E2',
            number: favLoading ? '-' : favorites.length,
            label: 'Favorites',
            onPress: () => navigation.navigate('Favorites'),
        },
        {
            icon: 'star-outline',
            iconColor: '#B45309',
            bgColor: '#FEF3C7',
            number: ratingLoading || averageRating == null ? '-' : averageRating.toFixed(1),
            label: 'Rating',
            onPress: () => navigation.navigate('MyReviews'),
        },
    ];

    const fetchProfile = async () => {
        try {
            const data = await apiGet('/profile/myProfile');
            const mappedUser = {
                name: data.username || 'User',
                email: data.userEmail || data.email || 'email@example.com',
                ...data,
            };

            setUser(mappedUser);
            // console.log('------Fetched User Profile:-------', mappedUser);
        } catch (error) {
            console.error('Error fetching profile:', error.response?.data || error.message);
            Alert.alert('Error', 'Unable to fetch profile information.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={{ color: COLORS.gray }}>No profile data found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader title="My Profile" onBack={() => navigation.goBack()} />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header Card */}
                <ProfileSection
                    user={user}
                    profileImage={profileImage || user?.avatar || 'https://i.pravatar.cc/100'}
                    buttonLabel="Edit Profile"
                    onButtonPress={() =>
                        navigation.navigate('EditProfileScreen', { user, profileImage })
                    }
                />
                <QuickActions title="Stats" actions={statsActions} />

                {/* Personal Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconBadge}>
                            <Ionicons name="person" size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Personal Information</Text>
                            <Text style={styles.cardSubtitle}>Your basic details</Text>
                        </View>
                    </View>

                    {/* First Name */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="person-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.infoLabel}>First Name</Text>
                        </View>
                        <Text style={styles.infoValue}>{user.firstName || 'N/A'}</Text>
                    </View>

                    {/* Last Name */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="person-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.infoLabel}>Last Name</Text>
                        </View>
                        <Text style={styles.infoValue}>{user.lastName || 'N/A'}</Text>
                    </View>

                    {/* Email */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.infoLabel}>Email Address</Text>
                        </View>
                        <Text style={styles.infoValue}>{user.userEmail || 'N/A'}</Text>
                    </View>

                    {/* Phone */}
                    <View style={[styles.infoRow, styles.infoRowLast]}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="call-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.infoLabel}>Phone Number</Text>
                        </View>
                        <Text style={styles.infoValue}>{user.mobileNumber || 'N/A'}</Text>
                    </View>
                </View>

                {/* Academic Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBadge, { backgroundColor: '#FEF3C7' }]}>
                            <Ionicons name="school" size={20} color="#CA8A04" />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Academic Information</Text>
                            <Text style={styles.cardSubtitle}>Your student details</Text>
                        </View>
                    </View>

                    {/* Student ID */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="card-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.infoLabel}>Student ID</Text>
                        </View>
                        <Text style={styles.infoValue}>{user.idCardNo || 'N/A'}</Text>
                    </View>

                    {/* College */}
                    <View style={[styles.infoRow, styles.infoRowLast]}>
                        <View style={styles.infoLeft}>
                            <Ionicons name="school-outline" size={18} color="#9CA3AF" />
                            <Text style={styles.infoLabel}>College</Text>
                        </View>
                        <Text style={styles.infoValue}>
                            {user.college?.collegeName || 'N/A'}
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
        padding: 20,
        paddingBottom: 40,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
    },

    // Card Styles
    card: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: COLORS.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },

    iconBadge: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.primaryLightest,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardHeaderText: {
        flex: 1,
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.dark.text,
    },

    cardSubtitle: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        marginTop: 2,
    },

    // Info Row Styles
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },

    infoRowLast: {
        borderBottomWidth: 0,
    },

    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },

    infoLabel: {
        fontSize: 14,
        color: COLORS.dark.textTertiary,
        fontWeight: '500',
    },

    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'right',
        flex: 1,
    },
});

export default UserProfileScreen;