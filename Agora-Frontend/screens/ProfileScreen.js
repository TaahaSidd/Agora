import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Button from '../components/Button';
import Card from '../components/Cards';
import BottomSheetMenu from '../components/BottomSheetMenu';
import ReputationModal from '../components/ReputationModal';
import ToastMessage from '../components/ToastMessage';
import ModalComponent from '../components/Modal';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';
import AgoraSegmentedFilter from '../components/SegmentedFilter';

import { useAverageRating } from '../hooks/useAverageRating';
import { useSellerProfile } from '../hooks/useSellerProfile';
import { useModeration } from '../hooks/useModeration';
import { useSellerStats } from '../hooks/useSellerStats';
import { apiDelete, apiGet, apiPost } from '../services/api';
import { useUserStore } from '../stores/userStore';
import { COLORS } from '../utils/colors';

const FILTER_TYPES = ['all', 'available', 'sold'];

const getRatingStyle = (rating) => {
    if (rating >= 4.5) return { color: COLORS.success, bg: `${COLORS.success}12` };
    if (rating >= 3.5) return { color: COLORS.info, bg: `${COLORS.info}12` };
    if (rating >= 2.5) return { color: COLORS.warning, bg: `${COLORS.warning}12` };
    return { color: COLORS.error, bg: `${COLORS.error}12` };
};

const getBannerGradient = (rating) => {
    if (rating >= 4.5) return ['#8B5CF6', '#EC4899', '#F59E0B'];
    if (rating >= 3.5) return ['#2563EB', '#3B82F6', '#10B981'];
    if (rating >= 2.5) return ['#EA580C', '#F59E0B', '#FCD34D'];
    return ['#4B5563', '#6B7280', '#9CA3AF'];
};

const ProfileScreen = ({ navigation, route }) => {
    const { sellerId } = route.params;
    const { currentUser, isGuest } = useUserStore();
    const { seller, listings, loading } = useSellerProfile(sellerId);
    const { stats } = useSellerStats(sellerId);
    const { rating } = useAverageRating('seller', sellerId);
    const { blockUser } = useModeration();

    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [filter, setFilter] = useState('all');
    const [showMenu, setShowMenu] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [blockModalVisible, setBlockModalVisible] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const res = await apiGet(`/follow/${sellerId}/count`);
                setFollowersCount(res.followers ?? 0);
                setIsFollowing(res.isFollowing ?? false);
            } catch (err) {
                console.error('Fetch followers error:', err);
            }
        };
        fetchFollowers();
    }, [sellerId]);

    const handleFilterPress = (type) => {
        setFilter(type);
    };

    const showToast = (type, title, message) => setToast({ visible: true, type, title, message });

    const handleFollowToggle = async () => {
        if (!currentUser?.id) {
            showToast('info', 'Login Required', 'Please log in to follow sellers.');
            return;
        }
        try {
            if (isFollowing) {
                await apiDelete(`/follow/unfollow/${sellerId}`);
                setIsFollowing(false);
                setFollowersCount(p => Math.max(p - 1, 0));
            } else {
                await apiPost(`/follow/follow/${sellerId}`);
                setIsFollowing(true);
                setFollowersCount(p => p + 1);
            }
        } catch (err) {
            console.error('Follow toggle failed:', err);
        }
    };

    const handleBlockConfirm = async () => {
        setBlockModalVisible(false);
        await blockUser(sellerId, () => {
            showToast('success', 'User Blocked', `${seller?.firstName || 'User'} removed from your feed.`);
            setTimeout(() => navigation.reset({ index: 0, routes: [{ name: 'MainLayout' }] }), 1500);
        });
    };

    const isOwnProfile = currentUser?.id === seller?.id;
    const ratingValue = rating || 0;
    const { color: ratingColor } = getRatingStyle(ratingValue);
    const totalReviews = stats?.totalReviews || 0;
    const avatar = seller?.profileImage || 'https://i.pravatar.cc/100';

    const filteredListings = filter === 'all' ? listings : listings?.filter(item => {
        if (filter === 'available') return item.itemStatus === 'AVAILABLE';
        if (filter === 'sold') return item.itemStatus === 'SOLD';
        return true;
    });

    if (loading) return <ProfileSkeleton />;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Floating header */}
            <View style={styles.floatingHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
                    <Ionicons name="arrow-back" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.headerBtn}>
                    <Ionicons name="ellipsis-vertical" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Banner Section */}
                <View style={styles.bannerSection}>
                    <LinearGradient
                        colors={getBannerGradient(ratingValue)}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                    />

                    <View style={styles.headerContentWrapper}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                            {seller?.verificationStatus === 'VERIFIED' && (
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-sharp" size={10} color={COLORS.white} />
                                </View>
                            )}
                        </View>

                        <View style={styles.titleArea}>
                            <Text style={styles.name} numberOfLines={1}>
                                {seller ? `${seller.firstName} ${seller.lastName}` : 'Seller'}
                            </Text>
                            {seller?.collegeName && (
                                <View style={styles.collegeRow}>
                                    <Text style={styles.collegeName} numberOfLines={1}>{seller.collegeName}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Clean Stats Row (No Card/Background) */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{listings?.length || 0}</Text>
                        <Text style={styles.statLabel}>Listings</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{followersCount}</Text>
                        <Text style={styles.statLabel}>Followers</Text>
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.statItem}
                        onPress={() => setShowRatingModal(true)}
                    >
                        <View style={styles.ratingInline}>
                            <Ionicons name="star" size={16} color={COLORS.warning} />
                            <Text style={styles.statNumber}>{ratingValue.toFixed(1)}</Text>
                        </View>
                        <Text style={styles.statLabel}>{totalReviews} Reviews</Text>
                    </TouchableOpacity>
                </View>

                {/* Primary Action */}
                {!isOwnProfile && (
                    <View style={styles.actionPadding}>
                        <Button
                            title={isFollowing ? 'Following' : 'Follow'}
                            onPress={handleFollowToggle}
                            variant={isFollowing ? 'primary' : 'outline'}
                            icon={isFollowing ? 'checkmark-circle' : 'person-add'}
                            iconPosition="left"
                            fullWidth
                            size="medium"
                        />
                    </View>
                )}

                {/* Listings Section */}
                <View style={styles.listingsSection}>
                    <View style={styles.listingsHeader}>
                        <Text style={styles.sectionTitle}>Seller's Feed</Text>
                        <View style={styles.countPill}>
                            <Text style={styles.countPillText}>{filteredListings?.length || 0} items</Text>
                        </View>
                    </View>

                    <AgoraSegmentedFilter
                        options={FILTER_TYPES}
                        activeFilter={filter}
                        onSelect={handleFilterPress}
                    />

                    {filteredListings?.length > 0 ? (
                        <View style={styles.grid}>
                            {filteredListings.map(item => (
                                <Card
                                    key={item.id}
                                    item={item}
                                    onPress={() => navigation.navigate('ProductDetailsScreen', { item })}
                                />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconWrapper}>
                                <Ionicons name="cube-outline" size={28} color={COLORS.gray400} />
                            </View>
                            <Text style={styles.emptyText}>No listings found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Modals & Toasts */}
            <BottomSheetMenu
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                type="user"
                title="Profile Options"
                isGuest={isGuest}
                onReport={isOwnProfile ? null : () => {
                    setShowMenu(false);
                    navigation.navigate('ReportUserScreen', {
                        userId: sellerId,
                        userName: seller ? `${seller.firstName} ${seller.lastName}` : 'User',
                    });
                }}
                onBlock={isOwnProfile ? null : () => {
                    setShowMenu(false);
                    setBlockModalVisible(true);
                }}
            />
            <ModalComponent
                visible={blockModalVisible}
                type="delete"
                title="Block User?"
                onPrimaryPress={handleBlockConfirm}
                onSecondaryPress={() => setBlockModalVisible(false)}
            />
            <ReputationModal
                visible={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                rating={ratingValue}
                isOwnProfile={isOwnProfile}
            />
            {toast.visible && (
                <ToastMessage
                    {...toast}
                    onHide={() => setToast(p => ({ ...p, visible: false }))}
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
    floatingHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 52 : 36,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        zIndex: 10,
    },
    headerBtn: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerSection: {
        marginBottom: 10,
    },
    banner: {
        width: '100%',
        height: 170,
        borderBottomLeftRadius: 40,
    },
    headerContentWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: -50,
        paddingHorizontal: 20,
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 32,
        borderWidth: 4,
        borderColor: COLORS.light.bg,
        backgroundColor: COLORS.gray100,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 4,
        right: -4,
        backgroundColor: COLORS.success,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 3,
        borderColor: COLORS.light.bg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleArea: {
        flex: 1,
        paddingBottom: 4,
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.light.text,
        letterSpacing: -0.5,
    },
    collegeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    collegeName: {
        fontSize: 13,
        color: COLORS.gray400,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginHorizontal: 20,
        marginTop: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.gray100,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.light.text,
    },
    statLabel: {
        fontSize: 11,
        color: COLORS.gray400,
        fontWeight: '500',
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: COLORS.gray100,
    },
    ratingInline: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionPadding: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    listingsSection: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    listingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.light.text,
    },
    countPill: {
        backgroundColor: `${COLORS.primary}10`,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    countPillText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIconWrapper: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: COLORS.gray50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.gray400,
    },
});

export default ProfileScreen;