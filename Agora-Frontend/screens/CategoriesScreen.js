const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'trending-up', color: '#10B981' };
    if (trend < 0) return { name: 'trending-down', color: '#EF4444' };
    return { name: 'remove', color: '#6B7280' };
}; import React, { useState, useEffect } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';

import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';

import { apiGet } from '../services/api';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const CategoriesScreen = ({ navigation }) => {
    const [popularCategories, setPopularCategories] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [loading, setLoading] = useState(true);

    const categories = [
        {
            id: 'textbooks',
            name: 'Textbooks & Study Materials',
            icon: 'book-outline',
            gradient: ['#3B82F6', '#2563EB'],
        },
        {
            id: 'electronics',
            name: 'Electronics & Gadgets',
            icon: 'laptop-outline',
            gradient: ['#8B5CF6', '#7C3AED'],
        },
        {
            id: 'clothing',
            name: 'Clothing & Accessories',
            icon: 'shirt-outline',
            gradient: ['#EC4899', '#DB2777'],
        },
        {
            id: 'furniture',
            name: 'Furniture & Dorm Supplies',
            icon: 'bed-outline',
            gradient: ['#F59E0B', '#D97706'],
        },
        {
            id: 'stationery',
            name: 'Stationery & Office Supplies',
            icon: 'pencil-outline',
            gradient: ['#14B8A6', '#0D9488'],
        },
        {
            id: 'sports',
            name: 'Sports & Fitness Equipment',
            icon: 'basketball-outline',
            gradient: ['#EF4444', '#DC2626'],
        },
        {
            id: 'bicycles',
            name: 'Bicycles & Transportation',
            icon: 'bicycle-outline',
            gradient: ['#10B981', '#059669'],
        },
        {
            id: 'food',
            name: 'Food & Snacks',
            icon: 'fast-food-outline',
            gradient: ['#F97316', '#EA580C'],
        },
        {
            id: 'housing',
            name: 'Housing & Roommates',
            icon: 'home-outline',
            gradient: ['#06B6D4', '#0891B2'],
        },
        {
            id: 'tutoring',
            name: 'Tutoring & Academic Services',
            icon: 'school-outline',
            gradient: ['#8B5CF6', '#6D28D9'],
        },
        {
            id: 'events',
            name: 'Events & Tickets',
            icon: 'ticket-outline',
            gradient: ['#EC4899', '#BE185D'],
        },
        {
            id: 'miscellaneous',
            name: 'Miscellaneous',
            icon: 'apps-outline',
            gradient: ['#6B7280', '#4B5563'],
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
                gradient: ['#6B7280', '#4B5563'],
            };
        });
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);

    const fetchCategoryData = async () => {
        try {
            setLoading(true);

            // Fetch popular categories with counts
            const popular = await apiGet('/listing/popular-categories');
            const mapped = mapPopularCategories(popular);
            setPopularCategories(mapped.slice(0, 3));

            // Build category counts from popular data
            const counts = {};
            popular.forEach(item => {
                counts[item.categoryId] = item.itemCount;
            });
            setCategoryCounts(counts);
        } catch (error) {
            console.error('Error fetching category data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend) => {
        if (trend > 0) return { name: 'trending-up', color: '#10B981' };
        if (trend < 0) return { name: 'trending-down', color: '#EF4444' };
        return { name: 'remove', color: '#6B7280' };
    };

    const handleCategoryPress = (category) => {
        navigation.navigate("CategoryScreen", {
            categoryId: category.id,
            categoryName: category.name || category.categoryName
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content" />
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
                        <Text style={styles.popularTitle}>Trending Now</Text>
                    </View>

                    <View style={styles.popularCards}>
                        {loading ? (
                            [1, 2, 3].map((_, idx) => (
                                <View key={idx} style={styles.popularCardSkeleton}>
                                    <View style={styles.popularRankSkeleton} />
                                    <View style={styles.popularIconSkeleton} />
                                    <View style={styles.popularInfoSkeleton} />
                                </View>
                            ))
                        ) : (
                            popularCategories.map((category, index) => {
                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={styles.popularCard}
                                        onPress={() => handleCategoryPress(category)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.popularRank}>
                                            <Text style={styles.popularRankText}>#{index + 1}</Text>
                                        </View>
                                        <LinearGradient
                                            colors={category.gradient}
                                            style={styles.popularIcon}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <Ionicons name={category.icon || 'apps-outline'} size={20} color="#fff" />
                                        </LinearGradient>
                                        <View style={styles.popularInfo}>
                                            <Text style={styles.popularName} numberOfLines={1}>
                                                {category.categoryName || category.name || "Unknown Category"}
                                            </Text>
                                            <Text style={styles.popularCount}>
                                                {category.itemCount || 0} {category.itemCount === 1 ? 'item' : 'items'}
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color={COLORS.dark.textTertiary} />
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>
                </View>

                <View style={styles.allCategoriesHeader}>
                    <Text style={styles.allCategoriesTitle}>All Categories</Text>
                </View>

                <View style={styles.gridContainer}>
                    {loading ? (
                        Array(6).fill(0).map((_, idx) => (
                            <View key={idx} style={styles.categoryCardSkeleton} />
                        ))
                    ) : (
                        categories.map((category) => {
                            const count = categoryCounts[category.id] || 0;
                            return (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.categoryCard}
                                    onPress={() => handleCategoryPress(category)}
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        colors={category.gradient}
                                        style={styles.categoryIconCircle}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    >
                                        <Ionicons name={category.icon} size={32} color="#fff" />
                                    </LinearGradient>
                                    <Text style={styles.categoryName} numberOfLines={2}>
                                        {category.name}
                                    </Text>
                                    <Text style={styles.categoryCount}>
                                        {count} {count === 1 ? 'item' : 'items'}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>

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
        borderWidth: 1,
        borderColor: COLORS.dark.border,
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
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    popularRankText: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.dark.text,
    },
    popularIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    popularInfo: {
        flex: 1,
    },
    popularName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
    },
    popularCount: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        marginTop: 2,
    },
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
        marginBottom: 16,
    },
    categoryIconCircle: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 4,
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.dark.textTertiary,
        textAlign: 'center',
    },
    popularCardSkeleton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        marginBottom: 4,
        backgroundColor: COLORS.dark.cardElevated,
    },
    popularRankSkeleton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.dark.border,
        marginRight: 12,
    },
    popularIconSkeleton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.dark.border,
        marginRight: 12,
    },
    popularInfoSkeleton: {
        flex: 1,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.dark.border,
    },
    categoryCardSkeleton: {
        width: '48%',
        paddingHorizontal: 6,
        marginBottom: 12,
        height: 140,
        borderRadius: 12,
        backgroundColor: COLORS.dark.cardElevated,
    },
});

export default CategoriesScreen;