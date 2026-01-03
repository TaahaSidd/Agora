import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import Button from '../components/Button';
import Card from '../components/Cards';
import LoadingSpinner from '../components/LoadingSpinner';
import BottomSheetMenu from '../components/BottomSheetMenu';

import {useAverageRating} from '../hooks/useAverageRating';
import {useSellerProfile} from '../hooks/useSellerProfile';
import {apiPost, apiDelete, apiGet} from '../services/api';
import {useUserStore} from "../stores/userStore";

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const ProfileScreen = ({navigation, route}) => {
    const {sellerId} = route.params;
    const {currentUser, loading: currentUserLoading, isGuest} = useUserStore();
    const {seller, listings, loading} = useSellerProfile(sellerId);

    const [isFollowing, setIsFollowing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const {rating} = useAverageRating('seller', sellerId);
    const [followersCount, setFollowersCount] = useState(0);
    const [filter, setFilter] = useState('all');

    const isOwnProfile = currentUser?.id === seller?.id;

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const res = await apiGet(`/follow/${sellerId}/count`);
                setFollowersCount(res.followers ?? 0);
                setIsFollowing(res.isFollowing ?? false);
            } catch (err) {
                console.error("Fetch followers error:", err);
            }
        };
        fetchFollowers();
    }, [sellerId]);

    const handleFollowToggle = async () => {
        if (!currentUser?.id) {
            alert("Please login first.");
            return;
        }

        try {
            if (isFollowing) {
                await apiDelete(`/follow/unfollow/${sellerId}`);
                setIsFollowing(false);
                setFollowersCount(prev => Math.max(prev - 1, 0));
            } else {
                await apiPost(`/follow/follow/${sellerId}`);
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
            }
        } catch (err) {
            console.error("Follow toggle failed:", err);
            alert("Unable to update follow status.");
        }
    };

    // Get rating badge style
    const getRatingStyle = (rating) => {
        if (rating >= 4.5) {
            return {
                bg: COLORS.successBgDark,
                text: COLORS.success,
                border: COLORS.success + '30',
            };
        } else if (rating >= 3.5) {
            return {
                bg: COLORS.infoBgDark,
                text: COLORS.info,
                border: COLORS.info + '30',
            };
        } else if (rating >= 2.5) {
            return {
                bg: COLORS.warningBgDark,
                text: COLORS.warning,
                border: COLORS.warning + '30',
            };
        } else {
            return {
                bg: COLORS.errorBgDark,
                text: COLORS.error,
                border: COLORS.error + '30',
            };
        }
    };

    let sellerAvatar = seller?.profileImage;
    if (typeof sellerAvatar === 'string' && sellerAvatar.includes('localhost')) {
        sellerAvatar = sellerAvatar.replace('localhost', '192.168.8.15');
    }
    if (!sellerAvatar) {
        sellerAvatar = 'https://i.pravatar.cc/100';
    }

    if (loading) {
        return <LoadingSpinner/>;
    }

    const ratingValue = rating || 0;
    const ratingStyle = getRatingStyle(ratingValue);

    // Filter listings
    const filteredListings = filter === 'all' ? listings : listings.filter(item => {
        if (filter === 'available') return item.itemStatus === 'AVAILABLE';
        if (filter === 'sold') return item.itemStatus === 'SOLD';
        return true;
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>

            {/* Floating Header */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.headerBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#fff"/>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Banner + Profile Section */}
                <View style={styles.bannerSection}>
                    {/* Banner with gradient */}
                    <LinearGradient
                        colors={['#1E3A8A', '#3B82F6', '#60A5FA']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.banner}
                    />

                    {/* Avatar - positioned at bottom of banner */}
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarContainer}>
                            <Image source={{uri: sellerAvatar}} style={styles.avatar}/>
                            {seller?.verificationStatus === "VERIFIED" && (
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success}/>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <Text style={styles.name}>
                        {seller ? `${seller.firstName} ${seller.lastName}` : 'Seller'}
                    </Text>

                    <View style={styles.collegeRow}>
                        <Ionicons name="school" size={16} color={COLORS.dark.textTertiary}/>
                        <Text style={styles.collegeName}>
                            {seller?.collegeName || 'College'}
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{listings?.length || 0}</Text>
                            <Text style={styles.statLabel}>Listings</Text>
                        </View>

                        <View style={styles.statDivider}/>

                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{followersCount}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>

                        <View style={styles.statDivider}/>

                        <View style={styles.statItem}>
                            <View style={[
                                styles.ratingBadge,
                                {
                                    backgroundColor: ratingStyle.bg,
                                    borderColor: ratingStyle.border,
                                }
                            ]}>
                                <Ionicons name="star" size={14} color={ratingStyle.text}/>
                                <Text style={[styles.ratingText, {color: ratingStyle.text}]}>
                                    {loading ? '...' : ratingValue.toFixed(1)}
                                </Text>
                            </View>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>

                    {/* Follow Button */}
                    {!isOwnProfile && (
                        <Button
                            title={isFollowing ? "Following" : "Follow"}
                            onPress={handleFollowToggle}
                            variant={isFollowing ? "primary" : "outline"}
                            icon={isFollowing ? "checkmark-circle" : "person-add"}
                            iconPosition="left"
                            fullWidth
                            size="medium"
                        />
                    )}
                </View>

                {/* Listings Section */}
                <View style={styles.listingsSection}>
                    <View style={styles.listingsHeader}>
                        <Text style={styles.sectionTitle}>Listings</Text>
                        <View style={styles.listingsCount}>
                            <Text style={styles.listingsCountText}>{filteredListings?.length || 0}</Text>
                        </View>
                    </View>

                    {/* Filter Tabs */}
                    <View style={styles.filterContainer}>
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
                            style={[styles.filterTab, filter === 'available' && styles.filterTabActive]}
                            onPress={() => setFilter('available')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'available' && styles.filterTextActive]}>
                                Available
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterTab, filter === 'sold' && styles.filterTabActive]}
                            onPress={() => setFilter('sold')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.filterText, filter === 'sold' && styles.filterTextActive]}>
                                Sold
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Listings Grid */}
                    {filteredListings && filteredListings.length > 0 ? (
                        <View style={styles.listingsGrid}>
                            {filteredListings.map((item) => (
                                <Card
                                    key={item.id}
                                    item={item}
                                    onPress={() => navigation.navigate('ProductDetailsScreen', {item})}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyListings}>
                            <Ionicons name="cube-outline" size={48} color={COLORS.dark.textTertiary}/>
                            <Text style={styles.emptyText}>No listings found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Sheet Menu */}
            <BottomSheetMenu
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                type="user"
                title="Profile Options"
                onShare={() => {
                    setShowMenu(false);
                    console.log('Share profile');
                }}
                onReport={() => {
                    setShowMenu(false);
                    navigation.navigate('ReportUserScreen', {
                        userId: sellerId,
                        userName: seller ? `${seller.firstName} ${seller.lastName}` : 'User',
                    });
                }}
                onBlock={() => {
                    setShowMenu(false);
                    console.log('Block user');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        flex: 1,
    },
    floatingHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + THEME.spacing.xs : 50,
        paddingHorizontal: THEME.spacing.md,
        paddingBottom: THEME.spacing.xs,
        zIndex: 10,
    },
    headerBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.transparentBlack50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerSection: {
        position: 'relative',
        height: 200,
    },
    banner: {
        width: '100%',
        height: 160,
    },
    avatarWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: COLORS.dark.bg,
        backgroundColor: COLORS.dark.card,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: COLORS.dark.bg,
        borderRadius: 12,
    },
    profileInfo: {
        paddingHorizontal: THEME.spacing.lg,
        paddingTop: THEME.spacing.md,
        alignItems: 'center',
    },
    name: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
    },
    collegeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.lg,
    },
    collegeName: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        marginLeft: THEME.spacing[1],
        fontWeight: THEME.fontWeight.medium,
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[1],
    },
    statLabel: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.semibold,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.dark.border,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing[2],
        paddingVertical: THEME.spacing[1],
        borderRadius: THEME.borderRadius.pill,
        borderWidth: 1,
        gap: 4,
        marginBottom: THEME.spacing[1],
    },
    ratingText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
    },
    listingsSection: {
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing.md,
    },
    listingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.md,
    },
    sectionTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
    },
    listingsCount: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: THEME.spacing[3],
        paddingVertical: THEME.spacing[1],
        borderRadius: THEME.borderRadius.pill,
    },
    listingsCountText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.bold,
        color: '#fff',
    },
    filterContainer: {
        flexDirection: 'row',
        gap: THEME.spacing[2],
        marginBottom: THEME.spacing.lg,
    },
    filterTab: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing[2],
        borderRadius: THEME.borderRadius.pill,
        backgroundColor: COLORS.dark.card,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    filterTabActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
    },
    filterTextActive: {
        color: '#fff',
    },
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing['2xl'],
    },
    emptyListings: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing['3xl'],
        alignItems: 'center',
        marginBottom: THEME.spacing['2xl'],
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    emptyText: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        marginTop: THEME.spacing.md,
        fontWeight: THEME.fontWeight.medium,
    },
});

export default ProfileScreen;