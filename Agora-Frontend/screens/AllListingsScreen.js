import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { apiGet } from '../services/api';

import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const AllListingsScreen = ({ navigation }) => {
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

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
        { id: 'all', name: 'All Categories', icon: 'apps-outline' },
        { id: 'textbooks', name: 'Textbooks', icon: 'book-outline' },
        { id: 'electronics', name: 'Electronics', icon: 'laptop-outline' },
        { id: 'clothing', name: 'Clothing', icon: 'shirt-outline' },
        { id: 'furniture', name: 'Furniture', icon: 'bed-outline' },
        { id: 'stationery', name: 'Stationery', icon: 'pencil-outline' },
        { id: 'sports', name: 'Sports', icon: 'basketball-outline' },
        { id: 'bicycles', name: 'Bicycles', icon: 'bicycle-outline' },
        { id: 'food', name: 'Food & Snacks', icon: 'fast-food-outline' },
        { id: 'housing', name: 'Housing', icon: 'home-outline' },
        { id: 'tutoring', name: 'Tutoring', icon: 'school-outline' },
        { id: 'events', name: 'Events', icon: 'ticket-outline' },
        { id: 'miscellaneous', name: 'Misc', icon: 'grid-outline' },
    ];

    const conditions = [
        { id: 'all', name: 'All Conditions' },
        { id: 'NEW', name: 'New' },
        { id: 'USED', name: 'Used' },
        { id: 'GOOD', name: 'Good' },
        { id: 'REFURBISHED', name: 'Refurbished' },
    ];

    const priceRanges = [
        { id: 'all', name: 'All Prices' },
        { id: '0-500', name: 'Under ₹500' },
        { id: '500-1000', name: '₹500 - ₹1k' },
        { id: '1000-2500', name: '₹1k - ₹2.5k' },
        { id: '2500-5000', name: '₹2.5k - ₹5k' },
        { id: '5000-10000', name: '₹5k - ₹10k' },
        { id: '10000+', name: 'Above ₹10k' },
    ];

    const sortOptions = [
        { id: 'recent', name: 'Most Recent' },
        { id: 'price-low', name: 'Price: Low to High' },
        { id: 'price-high', name: 'Price: High to Low' },
        { id: 'popular', name: 'Most Popular' },
    ];

    const fetchListings = async (page = 0, isRefresh = false) => {
        if (loading || loadingMore) return;
        if (!hasMore && !isRefresh && page > 0) return;
        try {
            if (page === 0) setLoading(true); else setLoadingMore(true);
            const response = await apiGet('/listing/all', { page, size: PAGE_SIZE });
            const rawItems = response?.content || [];
            const totalPagesFromApi = response?.totalPages || 0;

            const formattedItems = rawItems.map(item => ({
                ...item,
                title: item.title || 'Unnamed Item',
                name: item.title || item.name || 'Unnamed Item',
                price: `₹ ${item.price || 0}`,
                actualPrice: Number(item.price) || 0,
                images: item.imageUrl && item.imageUrl.length > 0
                    ? item.imageUrl.map(url => ({ uri: url }))
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
            console.error('Error:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchListings(0); }, []);

    const handleLoadMore = () => { if (!loadingMore && hasMore) fetchListings(currentPage + 1); };
    const handleRefresh = () => { setRefreshing(true); setCurrentPage(0); setHasMore(true); fetchListings(0, true); };

    const handleApplyFilters = () => {
        setFilterModalVisible(false);

        let updated = [...items];

        if (selectedCategory !== 'all') {
            updated = updated.filter(item =>
                item.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (selectedCondition !== 'all') {
            updated = updated.filter(item =>
                item.itemCondition?.toUpperCase() === selectedCondition.toUpperCase()
            );
        }

        if (priceRange !== 'all') {
            updated = updated.filter(item => {
                const price = item.actualPrice;
                if (priceRange === '0-500') return price <= 500;
                if (priceRange === '500-1000') return price > 500 && price <= 1000;
                if (priceRange === '1000-2500') return price > 1000 && price <= 2500;
                if (priceRange === '2500-5000') return price > 2500 && price <= 5000;
                if (priceRange === '5000-10000') return price > 5000 && price <= 10000;
                if (priceRange === '10000+') return price > 10000;
                return true;
            });
        }

        updated.sort((a, b) => {
            if (sortBy === 'price-low') {
                return a.actualPrice - b.actualPrice;
            } else if (sortBy === 'price-high') {
                return b.actualPrice - a.actualPrice;
            } else if (sortBy === 'popular') {
                return (b.viewCount || 0) - (a.viewCount || 0);
            } else {
                return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
            }
        });

        setFilteredItems(updated);
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

    const renderFooter = () => (
        loadingMore ? (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.footerLoaderText}>Loading more...</Text>
            </View>
        ) : null
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={60} color={COLORS.light.textTertiary} />
            </View>
            <Text style={styles.emptyTitle}>No Listings Found</Text>
            <Text style={styles.emptyText}>Adjust your filters to see more results.</Text>
            <Button title="Reset Filters" onPress={handleResetFilters} variant="primary" />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <AppHeader title="All Listings" onBack={() => navigation.goBack()} />

            {/* Filter Bar */}
            <View style={styles.filterBar}>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setFilterModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="options-outline" size={20} color={COLORS.primary} />
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
                    <Ionicons name="swap-vertical-outline" size={18} color={COLORS.light.textSecondary} />
                    <Text style={styles.sortButtonText}>
                        {sortOptions.find(s => s.id === sortBy)?.name}
                    </Text>
                </TouchableOpacity>
            </View>

            {loading && currentPage === 0 ? (
                <View style={styles.loadingContainer}>
                    <LoadingSpinner />
                </View>
            ) : filteredItems.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={filteredItems}
                    renderItem={({ item }) => <Card item={item} />}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
                    contentContainerStyle={{ paddingBottom: 60, marginTop: 10 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            )}

            {/* Filter Bottom Sheet */}
            <Modal visible={filterModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <Pressable style={styles.modalOverlayTouchable} onPress={() => setFilterModalVisible(false)} />
                    <View style={styles.bottomSheet}>
                        <View style={styles.handleBar} />
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Filters & Sort</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)} style={styles.closeButton}>
                                <Ionicons name="close" size={22} color={COLORS.light.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
                            <FilterSection title="Sort By">
                                {sortOptions.map(opt => (
                                    <OptionChip
                                        key={opt.id}
                                        label={opt.name}
                                        selected={sortBy === opt.id}
                                        onPress={() => setSortBy(opt.id)}
                                        showCheck
                                    />
                                ))}
                            </FilterSection>

                            <FilterSection title="Price Range">
                                {priceRanges.map(range => (
                                    <OptionChip
                                        key={range.id}
                                        label={range.name}
                                        selected={priceRange === range.id}
                                        onPress={() => setPriceRange(range.id)}
                                    />
                                ))}
                            </FilterSection>

                            <FilterSection title="Category">
                                {categories.map(cat => (
                                    <OptionChip
                                        key={cat.id}
                                        label={cat.name}
                                        selected={selectedCategory === cat.id}
                                        onPress={() => setSelectedCategory(cat.id)}
                                        icon={cat.icon}
                                    />
                                ))}
                            </FilterSection>

                            <FilterSection title="Condition">
                                {conditions.map(cond => (
                                    <OptionChip
                                        key={cond.id}
                                        label={cond.name}
                                        selected={selectedCondition === cond.id}
                                        onPress={() => setSelectedCondition(cond.id)}
                                    />
                                ))}
                            </FilterSection>
                        </ScrollView>

                        <View style={styles.sheetFooter}>
                            <Button title="Reset" variant="outline" style={{ flex: 1 }} onPress={handleResetFilters} />
                            <Button title="Apply" variant="primary" style={{ flex: 1 }} onPress={handleApplyFilters} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const FilterSection = ({ title, children }) => (
    <View style={styles.filterSection}>
        <Text style={styles.filterSectionTitle}>{title}</Text>
        <View style={styles.optionsGrid}>{children}</View>
    </View>
);

const OptionChip = ({ label, selected, onPress, icon, showCheck }) => (
    <TouchableOpacity
        style={[styles.optionChip, selected && styles.optionChipSelected]}
        onPress={onPress}
    >
        {icon && <Ionicons name={icon} size={14} color={selected ? COLORS.primary : COLORS.light.textSecondary} style={{ marginRight: 6 }} />}
        <Text style={[styles.optionChipText, selected && styles.optionChipTextSelected]}>{label}</Text>
        {showCheck && selected && <Ionicons name="checkmark" size={14} color={COLORS.primary} style={{ marginLeft: 6 }} />}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.light.bg },
    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light.border,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '10', // Light primary tint
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        marginRight: 10,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 6,
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: COLORS.error,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    filterBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.white },
    sortButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.light.bg,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    sortButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.textSecondary,
        marginLeft: 6,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    footerLoader: { paddingVertical: 20, alignItems: 'center' },
    footerLoaderText: { marginTop: 4, fontSize: 12, color: COLORS.light.textTertiary },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.light.bg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.light.text, marginBottom: 8 },
    emptyText: { fontSize: 14, color: COLORS.light.textSecondary, textAlign: 'center', marginBottom: 24 },
    modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalOverlayTouchable: { flex: 1 },
    bottomSheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.light.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light.border,
    },
    sheetTitle: { fontSize: 20, fontWeight: '800', color: COLORS.light.text },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.light.bg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetContent: { padding: 20 },
    filterSection: { marginBottom: 24 },
    filterSectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.light.text, marginBottom: 12 },
    optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.light.border,
    },
    optionChipSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '08',
    },
    optionChipText: { fontSize: 13, fontWeight: '600', color: COLORS.light.textSecondary },
    optionChipTextSelected: { color: COLORS.primary, fontWeight: '700' },
    sheetFooter: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.light.border,
        gap: 12,
    },
});

export default AllListingsScreen;