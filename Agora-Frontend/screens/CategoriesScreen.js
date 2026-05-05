import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiGet } from '../services/api';
import { COLORS } from '../utils/colors';

const categories = [
    { id: 'textbooks', name: 'Textbooks', icon: 'book', color: '#3B82F6' },
    { id: 'electronics', name: 'Electronics', icon: 'laptop', color: '#8B5CF6' },
    { id: 'clothing', name: 'Clothing', icon: 'shirt', color: '#EC4899' },
    { id: 'furniture', name: 'Furniture', icon: 'bed', color: '#F59E0B' },
    { id: 'stationery', name: 'Stationery', icon: 'pencil', color: '#14B8A6' },
    { id: 'sports', name: 'Sports', icon: 'basketball', color: '#EF4444' },
    { id: 'bicycles', name: 'Bicycles', icon: 'bicycle', color: '#10B981' },
    { id: 'food', name: 'Food & Snacks', icon: 'fast-food', color: '#F97316' },
    { id: 'housing', name: 'Housing', icon: 'home', color: '#06B6D4' },
    { id: 'tutoring', name: 'Tutoring', icon: 'school', color: '#8B5CF6' },
    { id: 'events', name: 'Events', icon: 'ticket', color: '#EC4899' },
    { id: 'miscellaneous', name: 'Misc', icon: 'apps', color: '#6B7280' },
];

const CategoriesScreen = ({ navigation }) => {
    const [popularCategories, setPopularCategories] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const popular = await apiGet('/listing/popular-categories');
                const counts = {};
                popular.forEach(item => { counts[item.categoryId] = item.itemCount; });
                setCategoryCounts(counts);
                const mappedPopular = popular.slice(0, 3).map(p => {
                    const local = categories.find(c => c.id === p.categoryId) || categories[11];
                    return { ...local, itemCount: p.itemCount };
                });
                setPopularCategories(mappedPopular);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryData();
    }, []);

    const handleCategoryPress = (category) => {
        navigation.navigate('CategoryScreen', {
            categoryId: category.id,
            categoryName: category.name,
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />
            <AppHeader
                title="Categories"
                onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Explore')}
            />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Browse Agora</Text>
                    <Text style={styles.heroSubtitle}>Find exactly what you need on campus</Text>
                </View>

                {/* Trending */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="flame" size={14} color={COLORS.error} />
                    <Text style={styles.sectionLabel}>Trending Categories</Text>
                </View>

                <View style={styles.card}>
                    {loading ? (
                        <View style={styles.loadingBox}>
                            <LoadingSpinner size="small" />
                        </View>
                    ) : (
                        popularCategories.map((category, index) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[
                                    styles.trendingRow,
                                    index < popularCategories.length - 1 && styles.trendingRowBorder,
                                ]}
                                onPress={() => handleCategoryPress(category)}
                                activeOpacity={0.6}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: `${category.color}12` }]}>
                                    <Ionicons name={category.icon} size={18} color={category.color} />
                                </View>
                                <View style={styles.trendingInfo}>
                                    <Text style={styles.trendingName}>{category.name}</Text>
                                    <Text style={styles.trendingCount}>{category.itemCount || 0} active listings</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={14} color={COLORS.gray300} />
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* All Categories */}
                <Text style={styles.sectionTitle}>All Categories</Text>
                <View style={styles.grid}>
                    {categories.map((category) => {
                        const count = categoryCounts[category.id] || 0;
                        return (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.gridItem}
                                onPress={() => handleCategoryPress(category)}
                                activeOpacity={0.6}
                            >
                                <View style={styles.gridInner}>
                                    <View style={[styles.gridIconWrapper, { backgroundColor: `${category.color}12` }]}>
                                        <Ionicons name={category.icon} size={20} color={category.color} />
                                    </View>
                                    <Text style={styles.gridName} numberOfLines={1}>{category.name}</Text>
                                    <Text style={styles.gridCount}>{count} items</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <InfoBox text="Don't see a category you need? Reach out to support to suggest new ones!" />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    container: {
        padding: 16,
        paddingBottom: 40,
    },

    // Hero
    hero: {
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
    },

    // Section headers
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
        paddingLeft: 4,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
        marginTop: 20,
        paddingLeft: 4,
    },

    // Trending card — mirrors SettingsOptionList
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        overflow: 'hidden',
        marginBottom: 4,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: { elevation: 1 },
        }),
    },
    loadingBox: {
        padding: 32,
        alignItems: 'center',
    },
    trendingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        paddingHorizontal: 14,
        minHeight: 52,
        gap: 12,
    },
    trendingRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendingInfo: {
        flex: 1,
    },
    trendingName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
    },
    trendingCount: {
        fontSize: 11,
        color: COLORS.gray400,
        marginTop: 1,
    },

    // Grid
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    gridItem: {
        width: '33.33%',
        paddingHorizontal: 5,
        marginBottom: 10,
        borderRadius: 14,
        overflow: 'hidden',
    },
    gridInner: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        marginBottom: 1,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: { elevation: 1 },
        }),
    },
    gridIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    gridName: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.light.text,
        textAlign: 'center',
        letterSpacing: -0.1,
    },
    gridCount: {
        fontSize: 10,
        color: COLORS.gray400,
        marginTop: 2,
    },
});

export default CategoriesScreen;