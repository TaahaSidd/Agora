import React, {useEffect, useRef, useState} from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import Button from '../components/Button';
import Card from '../components/Cards';
import LoadingSpinner from '../components/LoadingSpinner';
import BottomSheetMenu from '../components/BottomSheetMenu';
import ReputationModal from '../components/ReputationModal';
import ToastMessage from "../components/ToastMessage";
import ModalComponent from "../components/Modal";

import {useAverageRating} from '../hooks/useAverageRating';
import {useSellerProfile} from '../hooks/useSellerProfile';
import {useModeration} from "../hooks/useModeration";
import {apiDelete, apiGet, apiPost} from '../services/api';
import {useUserStore} from "../stores/userStore";

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';


//subtle animations
const ProfileScreen = ({navigation, route}) => {
    const {sellerId} = route.params;
    const {currentUser, loading: currentUserLoading, isGuest} = useUserStore();
    const {seller, listings, loading} = useSellerProfile(sellerId);

    const [isFollowing, setIsFollowing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const {rating} = useAverageRating('seller', sellerId);
    const [followersCount, setFollowersCount] = useState(0);
    const [filter, setFilter] = useState('all');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
    const {blockUser} = useModeration();

    const scaleValue = useRef(new Animated.Value(0.95)).current;
    const opacityValue = useRef(new Animated.Value(0.6)).current;

    const scaleValues = useRef({
        all: new Animated.Value(1),
        available: new Animated.Value(1),
        sold: new Animated.Value(1),
    }).current;

    const handlePress = (filterType) => {
        // Animate the pressed tab
        Animated.sequence([
            Animated.spring(scaleValues[filterType], {
                toValue: 0.92,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.spring(scaleValues[filterType], {
                toValue: 1,
                friction: 3,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Update filter immediately (no delay!)
        setFilter(filterType);
    };

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    const handleBlockPress = () => {
        setShowMenu(false);
        setIsBlockModalVisible(true);
    };

    const handleBlockConfirm = async () => {
        setIsBlockModalVisible(false);

        await blockUser(sellerId, () => {
            showToast({
                type: 'success',
                title: 'User Blocked',
                message: `${seller?.firstName || 'User'} has been removed from your feed.`
            });

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{name: 'MainLayout'}],
                });
            }, 1500);
        });
    };

    const getMilestones = (listings, followers, rating) => {
        const milestones = [];

        if (listings.length >= 1) milestones.push({id: 1, label: 'First Sale', icon: 'rocket', color: '#F59E0B'});
        if (listings.length >= 10) milestones.push({id: 2, label: 'Power Seller', icon: 'flame', color: '#EF4444'});
        if (followers >= 20) milestones.push({id: 3, label: 'Campus Star', icon: 'star', color: '#3B82F6'});
        if (rating >= 4.8 && listings.length > 5) milestones.push({
            id: 4,
            label: 'Top Trusted',
            icon: 'shield-checkmark',
            color: '#10B981'
        });

        return milestones;
    };

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
            showToast({
                type: 'info',
                title: 'Login Required',
                message: 'Please log in to follow sellers',
            });
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

    const getBannerGradient = (rating) => {
        if (rating >= 4.5) {
            return ['#7C3AED', '#EC4899', '#F59E0B'];
        } else if (rating >= 3.5) {
            return ['#1E3A8A', '#3B82F6', '#10B981'];
        } else if (rating >= 2.5) {
            return ['#EA580C', '#F59E0B', '#FCD34D'];
        } else {
            return ['#374151', '#4B5563', '#6B7280'];
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
                        colors={getBannerGradient(ratingValue)}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.banner}
                    >
                        <View style={styles.patternOverlay}>
                            <Ionicons name="grid" size={200} color="rgba(255,255,255,0.03)"/>
                        </View>
                    </LinearGradient>

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
                        {/* Listings */}
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{listings?.length || 0}</Text>
                            <Text style={styles.statLabel}>Listings</Text>
                        </View>

                        <View style={styles.statDivider}/>

                        {/* Followers */}
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{followersCount}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>

                        <View style={styles.statDivider}/>

                        {/* Rating - Now Tappable */}
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => setShowRatingModal(true)}
                            activeOpacity={0.7}
                        >
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
                        </TouchableOpacity>
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

                <View style={styles.badgeSection}>
                    <Text style={styles.badgeTitle}>Campus Achievements</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.badgeScroll}>
                        {getMilestones(listings, followersCount, ratingValue).map(badge => (
                            <View
                                key={badge.id}
                                style={[
                                    styles.badgePill,
                                    {borderColor: badge.color + '40'}
                                ]}
                            >
                                <Ionicons name={badge.icon} size={14} color={badge.color}/>
                                <Text style={styles.badgeLabel}>{badge.label}</Text>
                            </View>
                        ))}
                    </ScrollView>
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
                        {/* All Tab */}
                        <Animated.View style={{ transform: [{ scale: scaleValues.all }] }}>
                            <TouchableOpacity
                                style={[
                                    styles.filterTab,
                                    filter === 'all' && styles.filterTabActive,
                                ]}
                                onPress={() => handlePress('all')}
                                activeOpacity={0.8}
                            >
                                <Animated.Text
                                    style={[
                                        styles.filterText,
                                        filter === 'all' && styles.filterTextActive,
                                    ]}
                                >
                                    All
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Available Tab */}
                        <Animated.View style={{ transform: [{ scale: scaleValues.available }] }}>
                            <TouchableOpacity
                                style={[
                                    styles.filterTab,
                                    filter === 'available' && styles.filterTabActive,
                                ]}
                                onPress={() => handlePress('available')}
                                activeOpacity={0.8}
                            >
                                <Animated.Text
                                    style={[
                                        styles.filterText,
                                        filter === 'available' && styles.filterTextActive,
                                    ]}
                                >
                                    Available
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Sold Tab */}
                        <Animated.View style={{ transform: [{ scale: scaleValues.sold }] }}>
                            <TouchableOpacity
                                style={[
                                    styles.filterTab,
                                    filter === 'sold' && styles.filterTabActive,
                                ]}
                                onPress={() => handlePress('sold')}
                                activeOpacity={0.8}
                            >
                                <Animated.Text
                                    style={[
                                        styles.filterText,
                                        filter === 'sold' && styles.filterTextActive,
                                    ]}
                                >
                                    Sold
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>
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
                onBlock={handleBlockPress}
            />

            <ModalComponent
                visible={isBlockModalVisible}
                type="delete"
                title="Block User?"
                message={`Are you sure? You and ${seller?.firstName || 'this user'} will no longer see each other's content.`}
                primaryButtonText="Block"
                secondaryButtonText="Cancel"
                onPrimaryPress={handleBlockConfirm}
                onSecondaryPress={() => setIsBlockModalVisible(false)}
                onClose={() => setIsBlockModalVisible(false)}
            />

            <ReputationModal
                visible={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                rating={ratingValue}
                onRatePress={() => {
                    setShowRatingModal(false);
                    navigation.navigate('AllReviewsScreen', {sellerId});
                }}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({...toast, visible: false})}
                />
            )}
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
    patternOverlay: {
        position: 'absolute',
        top: -20,
        right: -40,
        opacity: 0.5,
        transform: [{rotate: '15deg'}],
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

    bigRatingBadge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalRatingTitle: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 8,
    },
    modalRatingMsg: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    rateUserCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.cardElevated,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        gap: 8,
    },
    rateUserCTAText: {
        color: COLORS.primary,
        fontWeight: '800',
        fontSize: 14,
    },

    badgeSection: {
        marginTop: THEME.spacing.md,
        paddingHorizontal: THEME.spacing.lg,
        marginBottom: THEME.spacing.md,
    },
    badgeTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.dark.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: THEME.spacing.sm,
    },
    badgeScroll: {
        paddingVertical: 4,
        gap: 10, // Adds spacing between badges
    },
    badgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.cardElevated,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        // Shadow to give it that "sticker" lift
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginRight: 8, // Backup for older RN versions
    },
    badgeLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginLeft: 6,
    },
});

export default ProfileScreen;