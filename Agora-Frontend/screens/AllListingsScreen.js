import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    StatusBar,
    Modal,
    Pressable,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS } from '../utils/colors';

const AllListingsScreen = ({ navigation }) => {
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedCondition, setSelectedCondition] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [loading, setLoading] = useState(false);

    // Mock data - replace with actual API call
    const listings = [
        // Your listings data here
    ];

    const categories = [
        { id: 'all', name: 'All Categories', icon: 'apps-outline' },
        { id: 'textbooks', name: 'Textbooks', icon: 'book-outline' },
        { id: 'electronics', name: 'Electronics', icon: 'laptop-outline' },
        { id: 'clothing', name: 'Clothing', icon: 'shirt-outline' },
        { id: 'furniture', name: 'Furniture', icon: 'bed-outline' },
        { id: 'stationery', name: 'Stationery', icon: 'pencil-outline' },
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
        { id: '0-100', name: 'Under ₹100' },
        { id: '100-500', name: '₹100 - ₹500' },
        { id: '500-1000', name: '₹500 - ₹1,000' },
        { id: '1000-5000', name: '₹1,000 - ₹5,000' },
        { id: '5000+', name: 'Above ₹5,000' },
    ];

    const sortOptions = [
        { id: 'recent', name: 'Most Recent' },
        { id: 'price-low', name: 'Price: Low to High' },
        { id: 'price-high', name: 'Price: High to Low' },
        { id: 'popular', name: 'Most Popular' },
    ];

    const handleApplyFilters = () => {
        setFilterModalVisible(false);
        // Apply filters logic here
        console.log('Filters applied:', {
            category: selectedCategory,
            condition: selectedCondition,
            priceRange,
            sortBy,
        });
    };

    const handleResetFilters = () => {
        setSelectedCategory('all');
        setSelectedCondition('all');
        setPriceRange('all');
        setSortBy('recent');
    };

    const activeFiltersCount = [
        selectedCategory !== 'all',
        selectedCondition !== 'all',
        priceRange !== 'all',
        sortBy !== 'recent',
    ].filter(Boolean).length;

    const renderListingItem = ({ item }) => (
        <View style={styles.cardWrapper}>
            <Card
                item={item}
                onPress={() => navigation.navigate('ProductDetailsScreen', { item })}
            />
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={60} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyTitle}>No Listings Found</Text>
            <Text style={styles.emptyText}>
                Try adjusting your filters or check back later for new items!
            </Text>
            <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetFilters}
                activeOpacity={0.8}
            >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
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
                    <Ionicons name="swap-vertical-outline" size={20} color="#6B7280" />
                    <Text style={styles.sortButtonText}>
                        {sortOptions.find(s => s.id === sortBy)?.name}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Listings Grid */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <LoadingSpinner />
                    <Text style={styles.loadingText}>Loading listings...</Text>
                </View>
            ) : (
                <FlatList
                    data={listings}
                    renderItem={renderListingItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                />
            )}

            {/* Filter Bottom Sheet */}
            <Modal
                visible={filterModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setFilterModalVisible(false)}
                >
                    <Pressable
                        style={styles.bottomSheet}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Handle Bar */}
                        <View style={styles.handleBar} />

                        {/* Header */}
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Filters & Sort</Text>
                            <TouchableOpacity
                                onPress={() => setFilterModalVisible(false)}
                                style={styles.closeButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={24} color="#6B7280" />
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
                                                <Ionicons name="checkmark" size={16} color={COLORS.primary} />
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
                        </ScrollView>

                        {/* Bottom Actions */}
                        <View style={styles.sheetFooter}>
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={handleResetFilters}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.clearButtonText}>Clear All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={handleApplyFilters}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.applyButtonText}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 12,
        position: 'relative',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 6,
    },
    filterBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#EF4444',
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    filterBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#fff',
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
    },
    sortButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 6,
        flex: 1,
    },
    listContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    cardWrapper: {
        width: '50%',
        padding: 6,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
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
    resetButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    handleBar: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.3,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    filterSection: {
        marginBottom: 24,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    optionChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        marginHorizontal: 4,
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    optionChipSelected: {
        backgroundColor: '#EFF6FF',
        borderColor: COLORS.primary,
    },
    optionChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    optionChipTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
        marginHorizontal: 4,
        marginBottom: 8,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    categoryChipSelected: {
        backgroundColor: '#EFF6FF',
        borderColor: COLORS.primary,
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
        marginLeft: 6,
    },
    categoryChipTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    sheetFooter: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: 12,
    },
    clearButton: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '700',
    },
    applyButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        elevation: 1,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default AllListingsScreen;