import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
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
        { id: 'textbooks', name: 'Textbooks', icon: 'book-outline', gradient: ['#3B82F6', '#2563EB'] },
        { id: 'electronics', name: 'Electronics', icon: 'laptop-outline', gradient: ['#8B5CF6', '#7C3AED'] },
        { id: 'clothing', name: 'Clothing', icon: 'shirt-outline', gradient: ['#EC4899', '#DB2777'] },
        { id: 'furniture', name: 'Furniture', icon: 'bed-outline', gradient: ['#F59E0B', '#D97706'] },
        { id: 'stationery', name: 'Stationery', icon: 'pencil-outline', gradient: ['#14B8A6', '#0D9488'] },
        { id: 'sports', name: 'Sports', icon: 'basketball-outline', gradient: ['#EF4444', '#DC2626'] },
        { id: 'bicycles', name: 'Bicycles', icon: 'bicycle-outline', gradient: ['#10B981', '#059669'] },
        { id: 'food', name: 'Food & Snacks', icon: 'fast-food-outline', gradient: ['#F97316', '#EA580C'] },
        { id: 'housing', name: 'Housing', icon: 'home-outline', gradient: ['#06B6D4', '#0891B2'] },
        { id: 'tutoring', name: 'Tutoring', icon: 'school-outline', gradient: ['#8B5CF6', '#6D28D9'] },
        { id: 'events', name: 'Events', icon: 'ticket-outline', gradient: ['#EC4899', '#BE185D'] },
        { id: 'miscellaneous', name: 'Misc', icon: 'apps-outline', gradient: ['#6B7280', '#4B5563'] },
    ];

    const mapPopularCategories = (backendList = []) => {
        return backendList.map((item) => {
            const match = categories.find(c => c.id === item.categoryId);
            return match
                ? { ...match, itemCount: item.itemCount }
                : { id: item.categoryId, name: item.categoryName, itemCount: item.itemCount, icon: 'apps-outline', gradient: ['#6B7280', '#4B5563'] };
        });
    };

    const fetchCategoryData = async () => {
        try {
            setLoading(true);
            const popular = await apiGet('/listing/popular-categories');
            const mapped = mapPopularCategories(popular);
            setPopularCategories(mapped.slice(0, 3));
            const counts = {};
            popular.forEach(item => { counts[item.categoryId] = item.itemCount; });
            setCategoryCounts(counts);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategoryData(); }, []);

    const handleCategoryPress = (category) => {
        navigation.navigate("CategoryScreen", {
            categoryId: category.id,
            categoryName: category.name
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <AppHeader title="Categories" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Browse Items</Text>
                    <Text style={styles.headerSubtitle}>Discover everything on campus by category</Text>
                </View>

                {/* Trending Section */}
                <View style={styles.popularSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="flame" size={20} color="#EF4444" />
                        <Text style={styles.sectionTitle}>Trending Now</Text>
                    </View>

                    <View style={styles.popularContainer}>
                        {loading ? (
                            <ActivityIndicator color={COLORS.primary} style={{ padding: 20 }} />
                        ) : (
                            popularCategories.map((category, index) => (
                                <TouchableOpacity
                                    key={category.id}
                                    style={styles.popularRow}
                                    onPress={() => handleCategoryPress(category)}
                                >
                                    <View style={styles.rankBadge}>
                                        <Text style={styles.rankText}>#{index + 1}</Text>
                                    </View>
                                    <LinearGradient colors={category.gradient} style={styles.miniIcon}>
                                        <Ionicons name={category.icon} size={16} color="#fff" />
                                    </LinearGradient>
                                    <View style={styles.rowInfo}>
                                        <Text style={styles.rowName}>{category.name}</Text>
                                        <Text style={styles.rowCount}>{category.itemCount || 0} items</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={COLORS.light.textTertiary} />
                                </TouchableOpacity>
                            ))
                        )}
                    </View>
                </View>

                {/* All Categories Grid */}
                <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>All Categories</Text>
                <View style={styles.grid}>
                    {categories.map((category) => {
                        const count = categoryCounts[category.id] || 0;
                        return (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.gridItem}
                                onPress={() => handleCategoryPress(category)}
                            >
                                <LinearGradient colors={category.gradient} style={styles.gridIcon}>
                                    <Ionicons name={category.icon} size={28} color="#fff" />
                                </LinearGradient>
                                <Text style={styles.gridName} numberOfLines={1}>{category.name}</Text>
                                <Text style={styles.gridCount}>{count} items</Text>
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
    safeArea: { flex: 1, backgroundColor: COLORS.light.bg },
    container: { padding: 20, paddingBottom: 40 },
    headerInfo: { marginBottom: 28 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: COLORS.light.text, letterSpacing: -0.5 },
    headerSubtitle: { fontSize: 15, color: COLORS.light.textSecondary, marginTop: 4 },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: COLORS.light.text, marginLeft: 6 },

    popularSection: { marginBottom: 32 },
    popularContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    popularRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.light.bg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rankText: { fontSize: 13, fontWeight: '800', color: COLORS.light.text },
    miniIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowInfo: { flex: 1 },
    rowName: { fontSize: 15, fontWeight: '700', color: COLORS.light.text },
    rowCount: { fontSize: 12, fontWeight: '600', color: COLORS.light.textSecondary, marginTop: 1 },

    grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8, marginBottom: 24 },
    gridItem: { width: '50%', paddingHorizontal: 8, marginBottom: 20, alignItems: 'center' },
    gridIcon: {
        width: '100%',
        aspectRatio: 1.2,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    gridName: { fontSize: 14, fontWeight: '700', color: COLORS.light.text, textAlign: 'center' },
    gridCount: { fontSize: 11, fontWeight: '600', color: COLORS.light.textTertiary, marginTop: 2 },
});

export default CategoriesScreen;