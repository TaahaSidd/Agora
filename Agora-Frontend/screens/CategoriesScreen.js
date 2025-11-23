import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';

import { apiGet } from '../services/api';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const CategoriesScreen = ({ navigation }) => {

    const [popularCategories, setPopularCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        {
            id: 'textbooks',
            name: 'Textbooks & Study Materials',
            icon: 'book-outline',
            color: '#3B82F6',
            bgColor: '#DBEAFE',
        },
        {
            id: 'electronics',
            name: 'Electronics & Gadgets',
            icon: 'laptop-outline',
            color: '#8B5CF6',
            bgColor: '#EDE9FE',
        },
        {
            id: 'clothing',
            name: 'Clothing & Accessories',
            icon: 'shirt-outline',
            color: '#EC4899',
            bgColor: '#FCE7F3',
        },
        {
            id: 'furniture',
            name: 'Furniture & Dorm Supplies',
            icon: 'bed-outline',
            color: '#F59E0B',
            bgColor: '#FEF3C7',
        },
        {
            id: 'stationery',
            name: 'Stationery & Office Supplies',
            icon: 'pencil-outline',
            color: '#14B8A6',
            bgColor: '#CCFBF1',
        },
        {
            id: 'sports',
            name: 'Sports & Fitness Equipment',
            icon: 'basketball-outline',
            color: '#EF4444',
            bgColor: '#FEE2E2',
        },
        {
            id: 'bicycles',
            name: 'Bicycles & Transportation',
            icon: 'bicycle-outline',
            color: '#10B981',
            bgColor: '#D1FAE5',
        },
        {
            id: 'food',
            name: 'Food & Snacks',
            icon: 'fast-food-outline',
            color: '#F97316',
            bgColor: '#FFEDD5',
        },
        {
            id: 'housing',
            name: 'Housing & Roommates',
            icon: 'home-outline',
            color: '#06B6D4',
            bgColor: '#CFFAFE',
        },
        {
            id: 'tutoring',
            name: 'Tutoring & Academic Services',
            icon: 'school-outline',
            color: '#8B5CF6',
            bgColor: '#F3E8FF',
        },
        {
            id: 'events',
            name: 'Events & Tickets',
            icon: 'ticket-outline',
            color: '#EC4899',
            bgColor: '#FBCFE8',
        },
        {
            id: 'miscellaneous',
            name: 'Miscellaneous',
            icon: 'apps-outline',
            color: '#6B7280',
            bgColor: '#F3F4F6',
        },
    ];

    const mapPopularCategories = (backendList = []) => {
        return backendList.map((item) => {
            const match = categories.find(c => c.id === item.categoryId);

            if (match) {
                return {
                    ...match,
                    id: match.id,
                    itemCount: item.itemCount,
                };
            }

            return {
                id: item.categoryId,
                categoryName: item.categoryName,
                itemCount: item.itemCount,
                icon: 'apps-outline',
                color: '#000',
                bgColor: '#eee',
            };
        });
    };

    useEffect(() => {
        fetchPopularCategories();
    }, []);

    const fetchPopularCategories = async () => {
        try {
            setLoading(true);
            const popular = await apiGet('/listing/popular-categories');

            const mapped = mapPopularCategories(popular);
            setPopularCategories(mapped.slice(0, 3));
        } catch (error) {
            console.error('Error fetching popular categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryPress = (category) => {
        navigation.navigate("CategoryScreen", {
            categoryId: category.id,
            categoryName: category.name || category.categoryName
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="All Categories" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Browse by Category</Text>
                    <Text style={styles.headerSubtitle}>
                        Discover items across different categories
                    </Text>
                </View>

                <View style={styles.popularSection}>
                    <View style={styles.popularHeader}>
                        <Ionicons name="flame" size={24} color="#EF4444" />
                        <Text style={styles.popularTitle}>Most Popular</Text>
                    </View>

                    <View style={styles.popularCards}>
                        {loading ? (
                            // Simple skeleton placeholders
                            [1, 2, 3].map((_, idx) => (
                                <View key={idx} style={styles.popularCardSkeleton}>
                                    <View style={styles.popularRankSkeleton} />
                                    <View style={styles.popularIconSkeleton} />
                                    <View style={styles.popularInfoSkeleton} />
                                </View>
                            ))
                        ) : (
                            popularCategories.map((category, index) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.popularCard}
                                    onPress={() => handleCategoryPress(category)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.popularRank}>
                                        <Text style={styles.popularRankText}>#{index + 1}</Text>
                                    </View>
                                    <View style={[styles.popularIcon, { backgroundColor: category.bgColor || '#eee' }]}>
                                        <Ionicons name={category.icon || 'apps-outline'} size={20} color={category.color || '#000'} />
                                    </View>
                                    <View style={styles.popularInfo}>
                                        <Text style={styles.popularName} numberOfLines={1}>
                                            {(category.categoryName || category.name || "Unknown Category")}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>

                {/* All Categories Grid */}
                <View style={styles.allCategoriesHeader}>
                    <Text style={styles.allCategoriesTitle}>All Categories</Text>
                </View>

                <View style={styles.gridContainer}>
                    {loading ? (
                        Array(6).fill(0).map((_, idx) => (
                            <View key={idx} style={styles.categoryCardSkeleton} />
                        ))
                    ) : (
                        categories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryCard}
                                onPress={() => handleCategoryPress(category)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.categoryIconCircle, { backgroundColor: category.bgColor }]}>
                                    <Ionicons name={category.icon} size={32} color={category.color} />
                                </View>
                                <Text style={styles.categoryName} numberOfLines={2}>
                                    {category.name}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* Bottom Info */}
                <InfoBox
                    text="Can't find what you're looking for? Try searching or check back later for new listings!"
                />
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },

    container: {
        padding: 20,
        paddingBottom: 40,
    },

    headerInfo: {
        marginBottom: 24,
    },

    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },

    headerSubtitle: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
        lineHeight: 20,
    },

    // Popular Section
    popularSection: {
        marginBottom: 32,
    },

    popularHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },

    popularTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginLeft: 8,
        letterSpacing: -0.3,
    },

    popularCards: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 8,
        shadowColor: COLORS.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    popularCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 4,
    },

    popularRank: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.dark.errorBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    popularRankText: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.dark.textSecondary,
    },

    popularIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: COLORS.dark.cardElevated,
    },

    popularInfo: {
        flex: 1,
    },

    popularName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
    },

    // All Categories
    allCategoriesHeader: {
        marginBottom: 16,
    },

    allCategoriesTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
        letterSpacing: -0.3,
    },

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
        marginBottom: 24,
    },

    categoryCard: {
        width: '50%',
        paddingHorizontal: 6,
        marginBottom: 12,
    },

    categoryIconCircle: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        backgroundColor: COLORS.dark.card,
        shadowColor: COLORS.shadow.light,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    categoryName: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 4,
    },

    // Bottom Info Banner
    bottomInfo: {
        flexDirection: 'row',
        backgroundColor: COLORS.infoBgDark,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.divider,
    },

    infoIconContainer: {
        marginRight: 12,
        marginTop: 2,
    },

    infoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.infoLight,
        lineHeight: 20,
        fontWeight: '500',
    },

    // Skeletons (Dark Mode)
    popularCardSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 4,
        backgroundColor: COLORS.dark.gray800,
    },

    popularRankSkeleton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.dark.gray700,
        marginRight: 12,
    },

    popularIconSkeleton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.dark.gray700,
        marginRight: 12,
    },

    popularInfoSkeleton: {
        flex: 1,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.dark.gray700,
    },

    categoryCardSkeleton: {
        width: '48%',
        paddingHorizontal: 6,
        marginBottom: 12,
        height: 100,
        borderRadius: 12,
        backgroundColor: COLORS.dark.gray700,
    },
});

export default CategoriesScreen;