import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Platform, StatusBar, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../components/Button';
import Card from '../components/Cards';
import AppHeader from '../components/AppHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import BottomSheetMenu from '../components/BottomSheetMenu';

import { shareItem } from '../services/share';
import { useAverageRating } from '../hooks/useAverageRating';
import { useSellerProfile } from '../hooks/useSellerProfile';
import { apiPost, apiDelete, apiGet } from '../services/api';
import { useCurrentUser } from "../hooks/useCurrentUser";

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const isAndroid = Platform.OS === 'android';

const ProfileScreen = ({ navigation, route }) => {
    const { sellerId } = route.params;
    const { user: currentUser, loading: currentUserLoading, isGuest } = useCurrentUser();
    const { seller, listings, loading } = useSellerProfile(sellerId);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { rating } = useAverageRating('seller', sellerId);
    const [followersCount, setFollowersCount] = useState(0);
    const isOwnProfile = currentUser?.id === seller?.id;


    const openChatRoom = async () => {
        if (loading) return;
        if (isGuest || !currentUser?.id) {
            showToast({
                type: 'info',
                title: 'Login Required',
                message: 'Please log in to chat with the seller.',
            });
            return;
        }

        if (!product?.seller || !product.seller.id) {
            console.warn("Seller data not loaded yet");
            return;
        }

        try {
            const buyer = {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                avatar: currentUser.avatar || null,
            };

            const seller = {
                id: product.seller.id,
                email: product.seller.userEmail || product.seller.email || String(product.seller.id),
                name: product.seller.firstName
                    ? `${product.seller.firstName} ${product.seller.lastName}`
                    : product.seller.userName || 'Seller',
                avatar: product.seller.avatar || null,
            };

            const roomRef = await getOrCreateChatRoom(product.id, buyer, seller);

            navigation.navigate('ChatRoomScreen', {
                roomId: roomRef.id,
                listing: product,
                sellerName: seller.name,
                sellerId: seller.id,
                sellerAvatar: product.seller.profileImage || product.seller.avatar || null,
            });
        } catch (err) {
            console.error('Failed to open chat room:', err);
        }
    };

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

    let sellerAvatar = seller?.profileImage;
    if (typeof sellerAvatar === 'string' && sellerAvatar.includes('localhost')) {
        sellerAvatar = sellerAvatar.replace('localhost', '192.168.8.15');
    }
    if (!sellerAvatar) {
        sellerAvatar = 'https://i.pravatar.cc/100';
    }

    if (loading) {
        return <LoadingSpinner />;
    }

    const handleReport = () => {
        setShowMenu(false);
        navigation.navigate('ReportUserScreen', {
            userId: sellerId,
            userName: seller ? `${seller.firstName}${seller.lastName}` : 'User',
        });
    };

    const handleBlock = () => {
        setShowMenu(false);
        console.log('Block user');
    };

    const handleShare = () => {
        setShowMenu(false);
        console.log('Share profile');
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />

            {/* Header */}
            <AppHeader
                title="Seller Profile"
                onBack={() => navigation.goBack()}
                rightIcon="ellipsis-vertical"
                onRightPress={() => setShowMenu(true)}
            />

            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: sellerAvatar }} style={styles.avatar} />
                            {seller?.verificationStatus === "VERIFIED" && (
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark" size={12} color="#fff" />
                                </View>
                            )}
                        </View>

                        <View style={styles.profileInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.name}>
                                    {seller ? `${seller.firstName}${seller.lastName}` : 'Seller'}
                                </Text>
                            </View>

                            <View style={styles.collegeRow}>
                                <Ionicons name="school" size={14} color="#6B7280" />
                                <Text style={styles.collegeName}>
                                    {seller?.collegeName || 'College'}
                                </Text>
                            </View>

                            <View style={styles.joinedRow}>
                                <Ionicons name="time-outline" size={14} color="#6B7280" />
                                <Text style={styles.joinedText}>Joined Jan 2025</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{listings?.length || 0}</Text>
                            <Text style={styles.statLabel}>Listings</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{followersCount}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={18} color="#FCD34D" />
                                <Text style={styles.statNumber}>
                                    {loading ? '...' : rating?.toFixed(1) || '0'}
                                </Text>
                            </View>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    {!isOwnProfile && (
                        <View style={styles.actionButtons}>
                            {/* <TouchableOpacity
                                style={[styles.actionBtn, isFollowing && styles.followingBtn]}
                                onPress={handleFollowToggle}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name={isFollowing ? "checkmark-circle" : "person-add"}
                                    size={18}
                                    color={isFollowing ? "#fff" : COLORS.primary}
                                />
                                <Text style={[styles.actionBtnText, isFollowing && styles.followingBtnText]}>
                                    {isFollowing ? "Following" : "Follow"}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.messageBtn}
                                activeOpacity={0.8}
                                onPress={openChatRoom}
                            >
                                <Ionicons name="chatbubble-ellipses" size={18} color="#fff" />
                                <Text style={styles.messageBtnText}>Message</Text>
                            </TouchableOpacity> */}
                            <Button
                                title={isFollowing ? "Following" : "Follow"}
                                onPress={handleFollowToggle}
                                variant={isFollowing ? "primary" : "outline"}
                                icon={isFollowing ? "checkmark-circle" : "person-add"}
                                iconPosition="left"
                                fullWidth={false}
                                style={{ flex: 1 }}
                            />

                            <Button
                                title="Message"
                                onPress={openChatRoom}
                                variant="primary"
                                icon="chatbubble-ellipses"
                                iconPosition="left"
                                fullWidth={false}
                                style={{ flex: 1 }}

                            />
                        </View>
                    )}
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.aboutCard}>
                        <Text style={styles.aboutText}>
                            Hey! I'm a student selling quality items at great prices. All my products are genuine and in excellent condition. Feel free to reach out with any questions!
                        </Text>
                    </View>
                </View>

                {/* Badges */}
                {/* <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.badgesContainer}>
                        <View style={styles.badge}>
                            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
                            <Text style={styles.badgeText}>Verified</Text>
                        </View>
                        <View style={styles.badge}>
                            <Ionicons name="flash" size={20} color="#F59E0B" />
                            <Text style={styles.badgeText}>Fast Reply</Text>
                        </View>
                        <View style={styles.badge}>
                            <Ionicons name="star" size={20} color="#FCD34D" />
                            <Text style={styles.badgeText}>Top Seller</Text>
                        </View>
                    </View>
                </View> */}

                {/* Listings Section */}
                <View style={styles.section}>
                    <View style={styles.listingsHeader}>
                        <Text style={styles.sectionTitle}>Listings</Text>
                        <View style={styles.listingsCount}>
                            <Text style={styles.listingsCountText}>{listings?.length || 0}</Text>
                        </View>
                    </View>

                    {listings && listings.length > 0 ? (
                        <View style={styles.listingsGrid}>
                            {listings.map((item) => (
                                <Card key={item.id} item={item} />
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyListings}>
                            <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No listings yet</Text>
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
                onShare={handleShare}
                onReport={handleReport}
                onBlock={handleBlock}
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
        backgroundColor: COLORS.dark.bg,
    },
    profileCard: {
        backgroundColor: COLORS.dark.card,
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        elevation: 1,
    },
    profileHeader: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.dark.card,
        borderWidth: 3,
        borderColor: COLORS.dark.border,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.dark.bg,
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    name: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
        letterSpacing: -0.3,
    },
    collegeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    collegeName: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        marginLeft: 6,
        fontWeight: '500',
    },
    joinedRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    joinedText: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        marginLeft: 6,
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.dark.divider,
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.dark.divider,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.dark.card,
        borderWidth: 2,
        borderColor: COLORS.primary,
        gap: 6,
    },
    followingBtn: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    actionBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.primary,
    },
    followingBtnText: {
        color: COLORS.dark.text,
    },
    messageBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        gap: 6,
        elevation: 1,
    },
    messageBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
    },
    section: {
        marginTop: 16,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    aboutCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 16,
        elevation: 1,
    },
    aboutText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 22,
        fontWeight: '500',
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 8,
        elevation: 1,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.dark.textSecondary,
    },
    listingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    listingsCount: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    listingsCountText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.dark.text,
    },
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    emptyListings: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 40,
        alignItems: 'center',
        elevation: 1,
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        marginTop: 12,
        fontWeight: '500',
    },
});

export default ProfileScreen;