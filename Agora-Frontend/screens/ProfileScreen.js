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
import BottomSheetMenu from '../components/BottomSheetMenu';
import ReputationModal from '../components/ReputationModal';
import ToastMessage from "../components/ToastMessage";
import ModalComponent from "../components/Modal";
import ProfileSkeleton from "../components/skeletons/ProfileSkeleton";

import {useAverageRating} from '../hooks/useAverageRating';
import {useSellerProfile} from '../hooks/useSellerProfile';
import {useModeration} from "../hooks/useModeration";
import {useSellerStats} from "../hooks/useSellerStats";
import {apiDelete, apiGet, apiPost} from '../services/api';
import {useUserStore} from "../stores/userStore";

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const ProfileScreen = ({navigation, route}) => {
    const {sellerId} = route.params;
    const {currentUser, loading: currentUserLoading, isGuest} = useUserStore();
    const {seller, listings, loading} = useSellerProfile(sellerId);
    const {stats} = useSellerStats(sellerId);

    const [isFollowing, setIsFollowing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const {rating} = useAverageRating('seller', sellerId);
    const [followersCount, setFollowersCount] = useState(0);
    const [filter, setFilter] = useState('all');
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
    const {blockUser} = useModeration();

    const scaleValues = useRef({
        all: new Animated.Value(1),
        available: new Animated.Value(1),
        sold: new Animated.Value(1),
    }).current;

    const handlePress = (filterType) => {
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
        }
    };

    const getRatingStyle = (rating) => {
        // Light mode uses standard BG colors and slightly darker text for contrast
        if (rating >= 4.5) {
            return {
                bg: '#DCFCE7', // success bg light
                text: '#15803D', // success dark
                border: '#BBF7D0',
            };
        } else if (rating >= 3.5) {
            return {
                bg: '#DBEAFE', // info bg light
                text: '#1D4ED8', // info dark
                border: '#BFDBFE',
            };
        } else if (rating >= 2.5) {
            return {
                bg: '#FEF3C7', // warning bg light
                text: '#B45309', // warning dark
                border: '#FDE68A',
            };
        } else {
            return {
                bg: '#FEE2E2', // error bg light
                text: '#B91C1C', // error dark
                border: '#FECACA',
            };
        }
    };

    const ratingValue = rating || 0;
    const ratingStyle = getRatingStyle(ratingValue);
    const totalReviews = stats.totalReviews;

    const getBannerGradient = (rating) => {
        if (rating >= 4.5) return ['#8B5CF6', '#EC4899', '#F59E0B'];
        if (rating >= 3.5) return ['#2563EB', '#3B82F6', '#10B981'];
        if (rating >= 2.5) return ['#EA580C', '#F59E0B', '#FCD34D'];
        return ['#4B5563', '#6B7280', '#9CA3AF'];
    };

    let sellerAvatar = seller?.profileImage || 'https://i.pravatar.cc/100';

    const filteredListings = filter === 'all' ? listings : listings.filter(item => {
        if (filter === 'available') return item.itemStatus === 'AVAILABLE';
        if (filter === 'sold') return item.itemStatus === 'SOLD';
        return true;
    });

    if (loading) return <ProfileSkeleton/>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>

            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff"/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.headerBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#fff"/>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.bannerSection}>
                    <LinearGradient
                        colors={getBannerGradient(ratingValue)}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={styles.banner}
                    >
                        <View style={styles.patternOverlay}>
                            <Ionicons name="grid" size={200} color="rgba(255,255,255,0.08)"/>
                        </View>
                    </LinearGradient>

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

                <View style={styles.profileInfo}>
                    <Text style={styles.name}>
                        {seller ? `${seller.firstName} ${seller.lastName}` : 'Seller'}
                    </Text>

                    <View style={styles.collegeRow}>
                        <Ionicons name="school" size={16} color={COLORS.light.textTertiary}/>
                        <Text style={styles.collegeName}>
                            {seller?.collegeName || 'College'}
                        </Text>
                    </View>

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
                                    {ratingValue.toFixed(1)}
                                </Text>
                            </View>
                            <Text style={styles.statLabel}>
                                {`${totalReviews} ${totalReviews === 1 ? 'Review' : 'Reviews'}`}
                            </Text>
                        </TouchableOpacity>
                    </View>

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

                <View style={styles.listingsSection}>
                    <View style={styles.listingsHeader}>
                        <Text style={styles.sectionTitle}>Listings</Text>
                        <View style={styles.listingsCount}>
                            <Text style={styles.listingsCountText}>{filteredListings?.length || 0}</Text>
                        </View>
                    </View>

                    <View style={styles.filterContainer}>
                        {['all', 'available', 'sold'].map((type) => (
                            <Animated.View key={type} style={{transform: [{scale: scaleValues[type]}]}}>
                                <TouchableOpacity
                                    style={[
                                        styles.filterTab,
                                        filter === type && styles.filterTabActive,
                                    ]}
                                    onPress={() => handlePress(type)}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.filterText,
                                            filter === type && styles.filterTextActive,
                                        ]}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>

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
                            <Ionicons name="cube-outline" size={48} color={COLORS.light.textTertiary}/>
                            <Text style={styles.emptyText}>No listings found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <BottomSheetMenu
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                type="user"
                title="Profile Options"
                isGuest={isGuest}
                onShare={() => setShowMenu(false)}
                onReport={isOwnProfile ? null : () => {
                    setShowMenu(false);
                    navigation.navigate('ReportUserScreen', {
                        userId: sellerId,
                        userName: seller ? `${seller.firstName} ${seller.lastName}` : 'User',
                    });
                }}
                onBlock={isOwnProfile ? null : handleBlockPress}
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
                isOwnProfile={isOwnProfile}
                isGuest={isGuest}
                onRatePress={() => {
                    setShowRatingModal(false);
                    navigation.navigate('UserRatingScreen', { sellerId, seller });
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
        backgroundColor: COLORS.light.bg,
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
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerSection: {
        position: 'relative',
        height: 240,
    },
    banner: {
        width: '100%',
        height: 200,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        overflow: 'hidden',
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
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: COLORS.light.bg,
        backgroundColor: COLORS.light.card,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: COLORS.light.bg,
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
        color: COLORS.light.text,
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
        color: COLORS.light.textSecondary,
        marginLeft: THEME.spacing[1],
        fontWeight: THEME.fontWeight.medium,
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
        backgroundColor: COLORS.light.card,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.light.text,
        marginBottom: THEME.spacing[1],
    },
    statLabel: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.light.textTertiary,
        fontWeight: THEME.fontWeight.semibold,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.light.border,
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
        color: COLORS.light.text,
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
        backgroundColor: COLORS.light.card,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    filterTabActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.light.textSecondary,
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
        backgroundColor: COLORS.light.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing['3xl'],
        alignItems: 'center',
        marginBottom: THEME.spacing['2xl'],
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    emptyText: {
        fontSize: THEME.fontSize.base,
        color: COLORS.light.textSecondary,
        marginTop: THEME.spacing.md,
        fontWeight: THEME.fontWeight.medium,
    },
});

export default ProfileScreen;