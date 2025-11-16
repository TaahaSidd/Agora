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
            console.log("Raw review response:", res);
            if (res) {
                const newReview = res.data || res;
                if (newReview && newReview.id) {
                    console.log('New Review Object:', newReview);
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

    const renderReviewItem = ({ item }) => (
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
                                    name={i < item.rating ? "star" : "star-outline"}
                                    size={14}
                                    color="#FCD34D"
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
            <Text style={styles.reviewComment}>{item.comment}</Text>
        </View>
    );


    const FilterChip = ({ label, value, isActive }) => (
        <TouchableOpacity
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => setFilterRating(value)}
            activeOpacity={0.7}
        >
            {value !== 'all' && (
                <Ionicons
                    name="star"
                    size={14}
                    color={isActive ? COLORS.primary : '#9CA3AF'}
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
            activeOpacity={0.7}
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
                <Ionicons name="chatbox-ellipses-outline" size={60} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
            <Text style={styles.emptyText}>
                Be the first to share your experience with this item!
            </Text>
            <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => setReviewModalVisible(true)}
                activeOpacity={0.8}
            >
                <Ionicons name="create" size={18} color="#fff" />
                <Text style={styles.emptyButtonText}>Write First Review</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
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
                                                        color="#FCD34D"
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
                                                color="#FCD34D"
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
                                    <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                    <Text style={styles.noResultsText}>No reviews with this rating yet</Text>
                                    <TouchableOpacity
                                        style={styles.clearFilterButton}
                                        onPress={() => setFilterRating('all')}
                                        activeOpacity={0.7}
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
                // userName={listing?.title || "this item"}
                message="How was this item?"
                placeholder="Share your experience with this product..."
                multiline={true}
                onPrimaryPress={(comment, rating) => handleSubmitReview(rating, comment)}
                onSecondaryPress={() => setReviewModalVisible(false)}
                onClose={() => setReviewModalVisible(false)}
            />

            {
                toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({ ...toast, visible: false })}
                    />
                )
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    ratingSummaryCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    ratingLeft: {
        alignItems: 'center',
        paddingRight: 24,
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
        minWidth: 100,
    },
    avgRatingNumber: {
        fontSize: 48,
        fontWeight: '800',
        color: '#111827',
        lineHeight: 56,
    },
    ratingStarsRow: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    totalReviews: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
        textAlign: 'center',
    },
    ratingRight: {
        flex: 1,
        paddingLeft: 24,
        justifyContent: 'center',
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingBarLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
        width: 30,
    },
    ratingBarTrack: {
        flex: 1,
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        marginHorizontal: 8,
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: '#FCD34D',
        borderRadius: 4,
    },
    ratingBarCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        width: 25,
        textAlign: 'right',
    },
    writeReviewButton: {
        marginBottom: 12,
    },
    filterSection: {
        marginBottom: 20,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
    },
    filterChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        gap: 4,
    },
    filterChipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterChipTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    sortSection: {
        marginBottom: 20,
    },
    sortTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
    },
    sortOptions: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    sortOptionActive: {
        backgroundColor: '#EFF6FF',
    },
    sortOptionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    sortOptionTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    resultsHeader: {
        marginBottom: 16,
    },
    resultsText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    reviewCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    reviewUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    reviewAvatarText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
    reviewUser: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    reviewRatingRow: {
        flexDirection: 'row',
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    reviewComment: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
        elevation: 1,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        marginLeft: 8,
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 12,
        marginBottom: 16,
    },
    clearFilterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
    },
    clearFilterText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
});

export default AllReviewsScreen;