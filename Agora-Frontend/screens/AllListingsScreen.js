import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {apiGet} from '../services/api';

import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const AllListingsScreen = ({navigation}) => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCondition, setSelectedCondition] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('recent');

    const PAGE_SIZE = 20;

    const categories = [
        {id: 'all', name: 'All Categories', icon: 'apps-outline'},
        {id: 'textbooks', name: 'Textbooks & Study Materials', icon: 'book-outline'},
        {id: 'electronics', name: 'Electronics & Gadgets', icon: 'laptop-outline'},
        {id: 'clothing', name: 'Clothing & Accessories', icon: 'shirt-outline'},
        {id: 'furniture', name: 'Furniture & Dorm Supplies', icon: 'bed-outline'},
        {id: 'stationery', name: 'Stationery & Office Supplies', icon: 'pencil-outline'},
    ];

    const conditions = [
        {id: 'all', name: 'All Conditions'},
        {id: 'NEW', name: 'New'},
        {id: 'USED', name: 'Used'},
        {id: 'GOOD', name: 'Good'},
        {id: 'REFURBISHED', name: 'Refurbished'},
        {id: 'REPAIRED', name: 'Repaired'},
        {id: 'DAMAGED', name: 'Damaged'},
    ];

    const priceRanges = [
        {id: 'all', name: 'All Prices'},
        {id: '0-100', name: 'Under ₹100'},
        {id: '100-500', name: '₹100 - ₹500'},
        {id: '500-1000', name: '₹500 - ₹1,000'},
        {id: '1000-5000', name: '₹1,000 - ₹5,000'},
        {id: '5000+', name: 'Above ₹5,000'},
    ];

    const sortOptions = [
        {id: 'recent', name: 'Most Recent'},
        {id: 'price-low', name: 'Price: Low to High'},
        {id: 'price-high', name: 'Price: High to Low'},
        {id: 'popular', name: 'Most Popular'},
    ];

    // Fetch listings with pagination
    const fetchListings = async (page = 0, isRefresh = false) => {
        if (loading || loadingMore) return;
        if (!hasMore && !isRefresh && page > 0) return;

        try {
            if (page === 0) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await apiGet('/listing/all', {page, size: PAGE_SIZE});

            //console.log('API Response:', response);

            const rawItems = response?.content || [];
            const totalPagesFromApi = response?.totalPages || 0;

            const formattedItems = rawItems.map(item => ({
                ...item,
                title: item.title || 'Unnamed Item',
                name: item.title || item.name || 'Unnamed Item',
                price: `₹ ${item.price || 0}`,
                actualPrice: Number(item.price) || 0,
                images: item.imageUrl && item.imageUrl.length > 0
                    ? item.imageUrl.map(url => ({uri: url}))
                    : [],
            }));

            if (isRefresh || page === 0) {
                setItems(formattedItems);
                setFilteredItems(formattedItems);
            } else {
                setItems(prev => [...prev, ...formattedItems]);
                setFilteredItems(prev => [...prev, ...formattedItems]);
            }

            setCurrentPage(page);
            setTotalPages(totalPagesFromApi);
            setHasMore(page + 1 < totalPagesFromApi);

        } catch (error) {
            console.error('Error fetching listings:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchListings(0);
    }, []);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            fetchListings(currentPage + 1);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setCurrentPage(0);
        setHasMore(true);
        fetchListings(0, true);
    };

    const applyFilters = (itemsToFilter) => {
        let updated = [...itemsToFilter];

        // Category filter
        if (selectedCategory !== 'all') {
            updated = updated.filter(item =>
                item.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Condition filter
        if (selectedCondition !== 'all') {
            updated = updated.filter(item =>
                item.itemCondition?.toUpperCase() === selectedCondition.toUpperCase()
            );
        }

        // Price filter
        if (priceRange !== 'all') {
            if (priceRange.includes('+')) {
                const min = parseInt(priceRange);
                updated = updated.filter(item => {
                    const price = parseFloat(item.actualPrice || item.price || 0);
                    return price >= min;
                });
            } else {
                const [min, max] = priceRange.split('-').map(Number);
                updated = updated.filter(item => {
                    const price = parseFloat(item.actualPrice || item.price || 0);
                    return price >= min && price <= max;
                });
            }
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                updated.sort((a, b) => {
                    const priceA = parseFloat(a.actualPrice || a.price || 0);
                    const priceB = parseFloat(b.actualPrice || b.price || 0);
                    return priceA - priceB;
                });
                break;
            case 'price-high':
                updated.sort((a, b) => {
                    const priceA = parseFloat(a.actualPrice || a.price || 0);
                    const priceB = parseFloat(b.actualPrice || b.price || 0);
                    return priceB - priceA;
                });
                break;
            case 'recent':
                updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'popular':
                updated.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
        }

        return updated;
    };

    const handleApplyFilters = () => {
        setFilterModalVisible(false);
        const filtered = applyFilters(items);
        setFilteredItems(filtered);
    };

    const handleResetFilters = () => {
        setSelectedCategory('all');
        setSelectedCondition('all');
        setPriceRange('all');
        setSortBy('recent');
        setFilteredItems(items);
        setFilterModalVisible(false);
    };

    const activeFiltersCount = [
        selectedCategory !== 'all',
        selectedCondition !== 'all',
        priceRange !== 'all',
        sortBy !== 'recent',
    ].filter(Boolean).length;

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLORS.primary}/>
                <Text style={styles.footerLoaderText}>Loading more...</Text>
            </View>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={60} color="#D1D5DB"/>
            </View>
            <Text style={styles.emptyTitle}>No Listings Found</Text>
            <Text style={styles.emptyText}>
                Try adjusting your filters or check back later for new items!
            </Text>
            <Button
                title="Reset Filters"
                onPress={handleResetFilters}
                variant="primary"
                size="medium"
                fullWidth={false}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content"/>
            <AppHeader title="All Listings" onBack={() => navigation.goBack()}/>

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="options-outline" size={20} color={COLORS.primary}/>
                    <Text style={styles.filterButtonText}>Filters</Text>
                    {activeFiltersCount > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => setFilterModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="swap-vertical-outline" size={20} color="#6B7280"/>
                    <Text style={styles.sortButtonText}>
                        {sortOptions.find(s => s.id === sortBy)?.name}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Listings Grid */}
            {loading && currentPage === 0 ? (
                <View style={styles.loadingContainer}>
                    <LoadingSpinner/>
                    <Text style={styles.loadingText}>Loading listings...</Text>
                </View>
            ) : filteredItems.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={filteredItems}
                    renderItem={({item}) => <Card item={item}/>}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    numColumns={2}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingBottom: 60,
                        marginTop: 20,
                    }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}

            {/* Filter Bottom Sheet */}
            <Modal
                visible={filterModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable
                        style={styles.modalOverlayTouchable}
                        onPress={() => setFilterModalVisible(false)}
                    />
                    <View style={styles.bottomSheet}>
                        <View style={styles.handleBar}/>

                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Filters & Sort</Text>
                            <TouchableOpacity
                                onPress={() => setFilterModalVisible(false)}
                                style={styles.closeButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={24} color="#6B7280"/>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.sheetContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Sort By */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Sort By</Text>
                                <View style={styles.optionsGrid}>
                                    {sortOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[
                                                styles.optionChip,
                                                sortBy === option.id && styles.optionChipSelected
                                            ]}
                                            onPress={() => setSortBy(option.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.optionChipText,
                                                sortBy === option.id && styles.optionChipTextSelected
                                            ]}>
                                                {option.name}
                                            </Text>
                                            {sortBy === option.id && (
                                                <Ionicons name="checkmark" size={16} color={COLORS.primary}/>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Category */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Category</Text>
                                <View style={styles.optionsGrid}>
                                    {categories.map((category) => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[
                                                styles.categoryChip,
                                                selectedCategory === category.id && styles.categoryChipSelected
                                            ]}
                                            onPress={() => setSelectedCategory(category.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons
                                                name={category.icon}
                                                size={16}
                                                color={selectedCategory === category.id ? COLORS.primary : '#6B7280'}
                                            />
                                            <Text style={[
                                                styles.categoryChipText,
                                                selectedCategory === category.id && styles.categoryChipTextSelected
                                            ]}>
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Condition */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Condition</Text>
                                <View style={styles.optionsGrid}>
                                    {conditions.map((condition) => (
                                        <TouchableOpacity
                                            key={condition.id}
                                            style={[
                                                styles.optionChip,
                                                selectedCondition === condition.id && styles.optionChipSelected
                                            ]}
                                            onPress={() => setSelectedCondition(condition.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.optionChipText,
                                                selectedCondition === condition.id && styles.optionChipTextSelected
                                            ]}>
                                                {condition.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Price Range */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Price Range</Text>
                                <View style={styles.optionsGrid}>
                                    {priceRanges.map((range) => (
                                        <TouchableOpacity
                                            key={range.id}
                                            style={[
                                                styles.optionChip,
                                                priceRange === range.id && styles.optionChipSelected
                                            ]}
                                            onPress={() => setPriceRange(range.id)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={[
                                                styles.optionChipText,
                                                priceRange === range.id && styles.optionChipTextSelected
                                            ]}>
                                                {range.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={{height: 20}}/>
                        </ScrollView>

                        <View style={styles.sheetFooter}>
                            <Button
                                title="Clear All"
                                variant="outline"
                                style={{flex: 1}}
                                onPress={handleResetFilters}
                            />

                            <Button
                                title="Apply Filters"
                                variant="primary"
                                style={{flex: 1}}
                                onPress={handleApplyFilters}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: THEME.spacing.screenPadding,
        paddingVertical: THEME.spacing.itemGap,
        backgroundColor: COLORS.dark.cardElevated,
        borderBottomWidth: THEME.borderWidth.hairline,
        borderBottomColor: COLORS.dark.border,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing[2] + 2,
        borderRadius: THEME.borderRadius.md,
        marginRight: THEME.spacing.itemGap,
        position: 'relative',
    },
    filterButtonText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.primary,
        marginLeft: THEME.spacing[1] + 2,
    },
    filterBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: COLORS.error,
        width: 20,
        height: 20,
        borderRadius: THEME.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: THEME.borderWidth.medium,
        borderColor: COLORS.dark.card,
    },
    filterBadgeText: {
        fontSize: THEME.fontSize.xs - 1,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.white,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: COLORS.dark.bgElevated,
        paddingHorizontal: THEME.spacing.itemGap,
        paddingVertical: THEME.spacing[2] + 2,
        borderRadius: THEME.borderRadius.md,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    sortButtonText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
        marginLeft: THEME.spacing[1] + 2,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
    },
    loadingText: {
        marginTop: THEME.spacing.itemGap,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    footerLoaderText: {
        marginTop: 8,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlayTouchable: {
        flex: 1,
        backgroundColor: COLORS.dark.overlay,
    },
    bottomSheet: {
        width: '100%',
        backgroundColor: COLORS.dark.card,
        borderTopLeftRadius: THEME.borderRadius['2xl'],
        borderTopRightRadius: THEME.borderRadius['2xl'],
        maxHeight: '85%',
        borderTopWidth: THEME.borderWidth.hairline,
        borderTopColor: COLORS.dark.border,
        ...THEME.shadows.xl,
        paddingBottom: 0,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.dark.border,
        borderRadius: THEME.borderRadius.xs,
        alignSelf: 'center',
        marginTop: THEME.spacing.itemGap,
        marginBottom: THEME.spacing[2],
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.screenPadding,
        paddingVertical: THEME.spacing.md,
        borderBottomWidth: THEME.borderWidth.hairline,
        borderBottomColor: COLORS.dark.border,
    },
    sheetTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        letterSpacing: THEME.letterSpacing.tight,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    sheetContent: {
        paddingHorizontal: THEME.spacing.screenPadding,
        paddingTop: THEME.spacing.itemGap,
        maxHeight: '60%',
    },
    filterSection: {
        marginBottom: THEME.spacing.sectionGap,
    },
    filterSectionTitle: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.itemGap,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -THEME.spacing[1],
    },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingHorizontal: THEME.spacing.sm + 2,
        paddingVertical: THEME.spacing[2] + 2,
        borderRadius: THEME.borderRadius.md,
        marginHorizontal: THEME.spacing[1],
        marginBottom: THEME.spacing[2],
        borderWidth: THEME.borderWidth.medium,
        borderColor: COLORS.dark.border,
    },
    optionChipSelected: {
        backgroundColor: COLORS.dark.cardElevated,
        borderColor: COLORS.primary,
    },
    optionChipText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
    },
    optionChipTextSelected: {
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.bold,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingHorizontal: THEME.spacing.itemGap,
        paddingVertical: THEME.spacing[2] + 2,
        borderRadius: THEME.borderRadius.md,
        marginHorizontal: THEME.spacing[1],
        marginBottom: THEME.spacing[2],
        borderWidth: THEME.borderWidth.medium,
        borderColor: COLORS.dark.border,
    },
    categoryChipSelected: {
        backgroundColor: COLORS.dark.cardElevated,
        borderColor: COLORS.primary,
    },
    categoryChipText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
        marginLeft: THEME.spacing[1] + 2,
    },
    categoryChipTextSelected: {
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.bold,
    },
    sheetFooter: {
        flexDirection: 'row',
        paddingHorizontal: THEME.spacing.screenPadding,
        paddingVertical: THEME.spacing.md,
        paddingBottom: THEME.spacing.lg,
        borderTopWidth: THEME.borderWidth.hairline,
        borderTopColor: COLORS.dark.border,
        gap: THEME.spacing.itemGap,
        backgroundColor: COLORS.dark.card,
    },
});

export default AllListingsScreen;