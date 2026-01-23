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
    const { reviews = [], productName, productId } = route.params || {};
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
            showToast({
                type: 'error',
                title: 'Failed',
                message: 'Could not submit review. Please try again.'
            });
        }
    };

    const FilterChip = ({ label, value, isActive }) => (
        <TouchableOpacity
            style={[styles.filterChip, isActive && styles.filterChipActive]}
            onPress={() => setFilterRating(value)}
        >
            {value !== 'all' && (
                <Ionicons
                    name="star"
                    size={14}
                    color={isActive ? COLORS.primary : COLORS.light.textTertiary}
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
        >
            <Text style={[styles.sortOptionText, isActive && styles.sortOptionTextActive]}>
                {label}
            </Text>
            {isActive && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <AppHeader title="Reviews & Ratings" onBack={() => navigation.goBack()} />

            <FlatList
                data={filteredReviews.filter(r => r && r.id)}
                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
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
                                <Text style={styles.totalReviews}>{localReviews.length} Reviews</Text>
                            </View>

                            <View style={styles.ratingRight}>
                                {ratingBreakdown.map(item => (
                                    <View key={item.star} style={styles.ratingBarRow}>
                                        <Text style={styles.ratingBarLabel}>{item.star}★</Text>
                                        <View style={styles.ratingBarTrack}>
                                            <View style={[styles.ratingBarFill, { width: `${item.percentage}%` }]} />
                                        </View>
                                        <Text style={styles.ratingBarCount}>{item.count}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <Button
                            title="Write a Review"
                            variant="primary"
                            icon="create-outline"
                            onPress={() => setReviewModalVisible(true)}
                            style={styles.writeReviewButton}
                        />

                        <View style={styles.filterSection}>
                            <Text style={styles.sectionTitle}>Filter by Rating</Text>
                            <View style={styles.filterChips}>
                                {['all', '5', '4', '3', '2', '1'].map(val => (
                                    <FilterChip key={val} label={val === 'all' ? 'All' : val} value={val} isActive={filterRating === val} />
                                ))}
                            </View>
                        </View>

                        <View style={styles.sortSection}>
                            <Text style={styles.sectionTitle}>Sort By</Text>
                            <View style={styles.sortOptions}>
                                <SortOption label="Most Recent" value="recent" isActive={sortBy === 'recent'} />
                                <SortOption label="Highest Rating" value="highest" isActive={sortBy === 'highest'} />
                                <SortOption label="Lowest Rating" value="lowest" isActive={sortBy === 'lowest'} />
                            </View>
                        </View>
                    </>
                }
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.reviewUserInfo}>
                                <View style={styles.reviewAvatar}>
                                    <Text style={styles.reviewAvatarText}>{item.reviewerName?.charAt(0) || '?'}</Text>
                                </View>
                                <View>
                                    <Text style={styles.reviewUser}>{item.reviewerName || 'Anonymous'}</Text>
                                    <View style={styles.reviewRatingRow}>
                                        {[...Array(5)].map((_, i) => (
                                            <Ionicons key={i} name={i < item.rating ? 'star' : 'star-outline'} size={12} color={COLORS.warning} />
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.reviewDate}>
                                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </Text>
                        </View>
                        <Text style={styles.reviewComment}>{item.comment}</Text>
                    </View>
                )}
            />

            <InputModal
                visible={reviewModalVisible}
                type="review"
                enableRating
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
    safeArea: { flex: 1, backgroundColor: COLORS.light.bg },
    listContainer: { padding: 16, paddingBottom: 40 },
    ratingSummaryCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    ratingLeft: {
        alignItems: 'center',
        paddingRight: 20,
        borderRightWidth: 1,
        borderRightColor: COLORS.light.border,
        minWidth: 100,
    },
    avgRatingNumber: { fontSize: 48, fontWeight: '800', color: COLORS.light.text },
    ratingStarsRow: { flexDirection: 'row', marginVertical: 4 },
    totalReviews: { fontSize: 12, color: COLORS.light.textSecondary, fontWeight: '600' },
    ratingRight: { flex: 1, paddingLeft: 20, justifyContent: 'center' },
    ratingBarRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    ratingBarLabel: { fontSize: 12, fontWeight: '700', color: COLORS.light.textSecondary, width: 25 },
    ratingBarTrack: { flex: 1, height: 6, backgroundColor: COLORS.light.bg, borderRadius: 3, marginHorizontal: 8, overflow: 'hidden' },
    ratingBarFill: { height: '100%', backgroundColor: COLORS.warning, borderRadius: 3 },
    ratingBarCount: { fontSize: 10, fontWeight: '600', color: COLORS.light.textTertiary, width: 20, textAlign: 'right' },
    writeReviewButton: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.light.text, marginBottom: 12 },
    filterSection: { marginBottom: 24 },
    filterChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.light.border,
        gap: 4,
    },
    filterChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
    filterChipText: { fontSize: 14, fontWeight: '600', color: COLORS.light.textSecondary },
    filterChipTextActive: { color: COLORS.primary, fontWeight: '700' },
    sortSection: { marginBottom: 24 },
    sortOptions: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    sortOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12 },
    sortOptionActive: { backgroundColor: COLORS.light.bg },
    sortOptionText: { fontSize: 15, fontWeight: '600', color: COLORS.light.textSecondary },
    sortOptionTextActive: { color: COLORS.primary, fontWeight: '700' },
    reviewCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    reviewUserInfo: { flexDirection: 'row', alignItems: 'center' },
    reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    reviewAvatarText: { fontSize: 14, fontWeight: '800', color: COLORS.white },
    reviewUser: { fontSize: 15, fontWeight: '700', color: COLORS.light.text },
    reviewRatingRow: { flexDirection: 'row', marginTop: 2 },
    reviewDate: { fontSize: 12, color: COLORS.light.textTertiary },
    reviewComment: { fontSize: 14, color: COLORS.light.textSecondary, lineHeight: 20 },
});

export default AllReviewsScreen;