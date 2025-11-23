import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import { useAddReview } from '../hooks/useAddReview';

import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';
import InputModal from '../components/InputModal';

const AllReviewsScreen = ({ navigation, route }) => {
    const { reviews = [], productName, productId, onAddReview } = route.params || {};
    const { addReview, loading } = useAddReview();
    const [localReviews, setLocalReviews] = useState(reviews);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });

    const showToast = ({ type, title, message }) => {
        setToast({ visible: true, type, title, message });
    };

    const avgRating = localReviews.length > 0
        ? (localReviews.reduce((sum, r) => sum + r.rating, 0) / localReviews.length).toFixed(1)
        : 0;

    const ratingBreakdown = [5, 4, 3, 2, 1].map(star => {
        const count = localReviews.filter(r => r.rating === star).length;
        const percentage = localReviews.length > 0 ? (count / localReviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    // Filter and sort reviews
    const getFilteredReviews = () => {
        let filtered = [...localReviews];
        if (filterRating !== 'all') {
            filtered = filtered.filter(r => r.rating === parseInt(filterRating));
        }
        if (sortBy === 'highest') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'lowest') {
            filtered.sort((a, b) => a.rating - b.rating);
        } else {
            filtered.sort((a, b) => b.id - a.id);
        }
        return filtered;
    };

    const filteredReviews = getFilteredReviews();

    const handleSubmitReview = async (rating, comment) => {
        try {
            const res = await addReview(productId, { rating, comment });
            if (res) {
                const newReview = res.data || res;
                if (newReview && newReview.id) {
                    setLocalReviews(prev => [newReview, ...prev.filter(r => r && r.id)]);
                }
                setReviewModalVisible(false);
                showToast({
                    type: 'success',
                    title: 'Review added!',
                    message: 'Your review has been submitted successfully.'
                });
            }
        } catch (error) {
            if (error.response?.status === 401) {
                showToast({
                    type: 'info',
                    title: 'Sign in required',
                    message: 'Please log in to add a review.'
                });
            } else {
                showToast({
                    type: 'error',
                    title: 'Failed',
                    message: 'Could not submit your review. Please try again.'
                });
            }
        }
    };

    const FilterChip = ({ label, value, isActive }) => (
        <TouchableOpacity
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => setFilterRating(value)}
            activeOpacity={THEME.opacity.hover}
        >
            {value !== 'all' && (
                <Ionicons
                    name="star"
                    size={14}
                    color={isActive ? COLORS.primary : COLORS.gray400}
                />
            )}
            <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const SortOption = ({ label, value, isActive }) => (
        <TouchableOpacity
            style={[styles.sortOption, isActive && styles.sortOptionActive]}
            onPress={() => setSortBy(value)}
            activeOpacity={THEME.opacity.hover}
        >
            <Text style={[styles.sortOptionText, isActive && styles.sortOptionTextActive]}>
                {label}
            </Text>
            {isActive && (
                <Ionicons name="checkmark" size={18} color={COLORS.primary} />
            )}
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="chatbox-ellipses-outline" size={60} color={COLORS.gray500} />
            </View>
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyText}>
                Be the first to share your experience with this item!
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setReviewModalVisible(true)}
                activeOpacity={THEME.opacity.hover}
            >
                <Ionicons name="create" size={18} color={COLORS.white} />
                <Text style={styles.emptyButtonText}>Write First Review</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content" />
            <AppHeader
                title="Reviews & Ratings"
                onBack={() => navigation.goBack()}
            />

            {localReviews.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={filteredReviews.filter(r => r && r.id)}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                    renderItem={({ item }) => {
                        if (!item) return null;
                        return (
                            <View style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewUserInfo}>
                                        <View style={styles.reviewAvatar}>
                                            <Text style={styles.reviewAvatarText}>
                                                {item.reviewerName ? item.reviewerName.charAt(0) : '?'}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.reviewUser}>
                                                {item.reviewerName || 'Anonymous'}
                                            </Text>
                                            <View style={styles.reviewRatingRow}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Ionicons
                                                        key={i}
                                                        name={i < item.rating ? 'star' : 'star-outline'}
                                                        size={14}
                                                        color={COLORS.warning}
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                    </View>
                                    {item.createdAt && (
                                        <Text style={styles.reviewDate}>
                                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.reviewComment}>{item.comment || ''}</Text>
                            </View>
                        );
                    }}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>
                            {/* Rating Summary Card */}
                            <View style={styles.ratingSummaryCard}>
                                <View style={styles.ratingLeft}>
                                    <Text style={styles.avgRatingNumber}>{avgRating}</Text>
                                    <View style={styles.ratingStarsRow}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons
                                                key={i}
                                                name={i < Math.floor(avgRating) ? "star" : "star-outline"}
                                                size={18}
                                                color={COLORS.warning}
                                            />
                                        ))}
                                    </View>
                                    <Text style={styles.totalReviews}>
                                        Based on {localReviews.length} review{localReviews.length !== 1 ? 's' : ''}
                                    </Text>
                                </View>

                                <View style={styles.ratingRight}>
                                    {ratingBreakdown.map(item => (
                                        <View key={item.star} style={styles.ratingBarRow}>
                                            <Text style={styles.ratingBarLabel}>{item.star}★</Text>
                                            <View style={styles.ratingBarTrack}>
                                                <View
                                                    style={[
                                                        styles.ratingBarFill,
                                                        { width: `${item.percentage}%` }
                                                    ]}
                                                />
                                            </View>
                                            <Text style={styles.ratingBarCount}>{item.count}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {/* Write Review Button */}
                            <Button
                                title="Write a Review"
                                variant="primary"
                                size="medium"
                                icon="create-outline"
                                iconPosition="left"
                                onPress={() => setReviewModalVisible(true)}
                                style={styles.writeReviewButton}
                            />

                            {/* Filter + Sort */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterTitle}>Filter by Rating</Text>
                                <View style={styles.filterChips}>
                                    <FilterChip label="All" value="all" isActive={filterRating === 'all'} />
                                    <FilterChip label="5" value="5" isActive={filterRating === '5'} />
                                    <FilterChip label="4" value="4" isActive={filterRating === '4'} />
                                    <FilterChip label="3" value="3" isActive={filterRating === '3'} />
                                    <FilterChip label="2" value="2" isActive={filterRating === '2'} />
                                    <FilterChip label="1" value="1" isActive={filterRating === '1'} />
                                </View>
                            </View>

                            <View style={styles.sortSection}>
                                <Text style={styles.sortTitle}>Sort By</Text>
                                <View style={styles.sortOptions}>
                                    <SortOption label="Most Recent" value="recent" isActive={sortBy === 'recent'} />
                                    <SortOption label="Highest Rating" value="highest" isActive={sortBy === 'highest'} />
                                    <SortOption label="Lowest Rating" value="lowest" isActive={sortBy === 'lowest'} />
                                </View>
                            </View>

                            <View style={styles.resultsHeader}>
                                <Text style={styles.resultsText}>
                                    Showing {filteredReviews.length} of {localReviews.length} review{localReviews.length !== 1 ? 's' : ''}
                                </Text>
                            </View>

                            {filteredReviews.length === 0 && (
                                <View style={styles.noResultsContainer}>
                                    <Ionicons name="search-outline" size={48} color={COLORS.gray500} />
                                    <Text style={styles.noResultsText}>No reviews with this rating yet</Text>
                                    <TouchableOpacity
                                        style={styles.clearFilterButton}
                                        onPress={() => setFilterRating('all')}
                                        activeOpacity={THEME.opacity.hover}
                                    >
                                        <Text style={styles.clearFilterText}>Clear Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    }
                />
            )}

            {/* Add Review Modal */}
            <InputModal
                visible={reviewModalVisible}
                type="review"
                enableRating
                message="How was this item?"
                placeholder="Share your experience with this product..."
                multiline={true}
                onPrimaryPress={(comment, rating) => handleSubmitReview(rating, comment)}
                onSecondaryPress={() => setReviewModalVisible(false)}
                onClose={() => setReviewModalVisible(false)}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({ ...toast, visible: false })}
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
    listContainer: {
        padding: THEME.spacing.screenPadding,
        paddingBottom: THEME.spacing['3xl'],
    },
    ratingSummaryCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        padding: THEME.spacing.sectionGap,
        marginBottom: THEME.spacing.lg,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.sm,
    },
    ratingLeft: {
        alignItems: 'center',
        paddingRight: THEME.spacing.sectionGap,
        borderRightWidth: THEME.borderWidth.hairline,
        borderRightColor: COLORS.dark.border,
        minWidth: 100,
    },
    avgRatingNumber: {
        fontSize: THEME.fontSize['6xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        lineHeight: THEME.fontSize['6xl'] + 8,
    },
    ratingStarsRow: {
        flexDirection: 'row',
        marginVertical: THEME.spacing[2],
    },
    totalReviews: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.semibold,
        textAlign: 'center',
    },
    ratingRight: {
        flex: 1,
        paddingLeft: THEME.spacing.sectionGap,
        justifyContent: 'center',
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing[2],
    },
    ratingBarLabel: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.textSecondary,
        width: 30,
    },
    ratingBarTrack: {
        flex: 1,
        height: 8,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginHorizontal: THEME.spacing[2],
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: COLORS.warning,
        borderRadius: THEME.borderRadius.xs,
    },
    ratingBarCount: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.gray400,
        width: 25,
        textAlign: 'right',
    },
    writeReviewButton: {
        marginBottom: THEME.spacing.itemGap,
    },
    filterSection: {
        marginBottom: THEME.spacing.lg,
    },
    filterTitle: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.itemGap,
    },
    filterChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.spacing[2],
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bgElevated,
        paddingHorizontal: THEME.spacing.sm + 2,
        paddingVertical: THEME.spacing[2],
        borderRadius: THEME.borderRadius.md,
        borderWidth: THEME.borderWidth.medium,
        borderColor: COLORS.dark.border,
        gap: THEME.spacing[1],
    },
    filterChipActive: {
        backgroundColor: COLORS.dark.cardElevated,
        borderColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
    },
    filterChipTextActive: {
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.bold,
    },
    sortSection: {
        marginBottom: THEME.spacing.lg,
    },
    sortTitle: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.itemGap,
    },
    sortOptions: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        padding: THEME.spacing[1],
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.sm,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: THEME.spacing.itemGap,
        paddingHorizontal: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
    },
    sortOptionActive: {
        backgroundColor: COLORS.dark.cardElevated,
    },
    sortOptionText: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
    },
    sortOptionTextActive: {
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.bold,
    },
    resultsHeader: {
        marginBottom: THEME.spacing.md,
    },
    resultsText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
    },
    reviewCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.itemGap,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.sm,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.itemGap,
    },
    reviewUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: THEME.spacing.itemGap,
    },
    reviewAvatarText: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.white,
    },
    reviewUser: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[1],
    },
    reviewRatingRow: {
        flexDirection: 'row',
    },
    reviewDate: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.gray400,
        fontWeight: THEME.fontWeight.medium,
    },
    reviewComment: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
        fontWeight: THEME.fontWeight.medium,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: THEME.spacing['3xl'],
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.lg,
        borderWidth: THEME.borderWidth.thick,
        borderColor: COLORS.dark.border,
    },
    emptyTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[2],
    },
    emptyText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
        marginBottom: THEME.spacing.sectionGap,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: THEME.spacing.sectionGap,
        paddingVertical: THEME.spacing.itemGap,
        borderRadius: THEME.borderRadius.button,
        ...THEME.shadows.md,
    },
    emptyButtonText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        marginLeft: THEME.spacing[2],
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: THEME.spacing['3xl'],
    },
    noResultsText: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
        marginTop: THEME.spacing.itemGap,
        marginBottom: THEME.spacing.md,
    },
    clearFilterButton: {
        paddingHorizontal: THEME.spacing.lg,
        paddingVertical: THEME.spacing[2] + 2,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.md,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    clearFilterText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.textSecondary,
    },
});

export default AllReviewsScreen;