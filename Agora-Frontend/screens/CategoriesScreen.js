import React from 'react';
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
import { COLORS } from '../utils/colors';

const CategoriesScreen = ({ navigation }) => {
    const categories = [
        {
            id: 'textbooks',
            name: 'Textbooks & Study Materials',
            icon: 'book-outline',
            color: '#3B82F6',
            bgColor: '#DBEAFE',
            count: 156,
        },
        {
            id: 'electronics',
            name: 'Electronics & Gadgets',
            icon: 'laptop-outline',
            color: '#8B5CF6',
            bgColor: '#EDE9FE',
            count: 89,
        },
        {
            id: 'clothing',
            name: 'Clothing & Accessories',
            icon: 'shirt-outline',
            color: '#EC4899',
            bgColor: '#FCE7F3',
            count: 124,
        },
        {
            id: 'furniture',
            name: 'Furniture & Dorm Supplies',
            icon: 'bed-outline',
            color: '#F59E0B',
            bgColor: '#FEF3C7',
            count: 67,
        },
        {
            id: 'stationery',
            name: 'Stationery & Office Supplies',
            icon: 'pencil-outline',
            color: '#14B8A6',
            bgColor: '#CCFBF1',
            count: 98,
        },
        {
            id: 'sports',
            name: 'Sports & Fitness Equipment',
            icon: 'basketball-outline',
            color: '#EF4444',
            bgColor: '#FEE2E2',
            count: 45,
        },
        {
            id: 'bicycles',
            name: 'Bicycles & Transportation',
            icon: 'bicycle-outline',
            color: '#10B981',
            bgColor: '#D1FAE5',
            count: 34,
        },
        {
            id: 'food',
            name: 'Food & Snacks',
            icon: 'fast-food-outline',
            color: '#F97316',
            bgColor: '#FFEDD5',
            count: 78,
        },
        {
            id: 'housing',
            name: 'Housing & Roommates',
            icon: 'home-outline',
            color: '#06B6D4',
            bgColor: '#CFFAFE',
            count: 23,
        },
        {
            id: 'tutoring',
            name: 'Tutoring & Academic Services',
            icon: 'school-outline',
            color: '#8B5CF6',
            bgColor: '#F3E8FF',
            count: 56,
        },
        {
            id: 'events',
            name: 'Events & Tickets',
            icon: 'ticket-outline',
            color: '#EC4899',
            bgColor: '#FBCFE8',
            count: 42,
        },
        {
            id: 'miscellaneous',
            name: 'Miscellaneous',
            icon: 'apps-outline',
            color: '#6B7280',
            bgColor: '#F3F4F6',
            count: 91,
        },
    ];

    const handleCategoryPress = (category) => {
        navigation.navigate("CategoryScreen", {
            categoryId: category.id,
            categoryName: category.name,
            categoryColor: category.color,
        });
    };

    const popularCategories = [...categories].sort((a, b) => b.count - a.count).slice(0, 3);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="All Categories" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Info */}
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Browse by Category</Text>
                    <Text style={styles.headerSubtitle}>
                        Discover items across different categories
                    </Text>
                </View>

                {/* Popular Section */}
                <View style={styles.popularSection}>
                    <View style={styles.popularHeader}>
                        <Ionicons name="flame" size={24} color="#EF4444" />
                        <Text style={styles.popularTitle}>Most Popular</Text>
                    </View>
                    <View style={styles.popularCards}>
                        {popularCategories.map((category, index) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.popularCard}
                                onPress={() => handleCategoryPress(category)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.popularRank}>
                                    <Text style={styles.popularRankText}>#{index + 1}</Text>
                                </View>
                                <View
                                    style={[
                                        styles.popularIcon,
                                        { backgroundColor: category.bgColor }
                                    ]}
                                >
                                    <Ionicons
                                        name={category.icon}
                                        size={20}
                                        color={category.color}
                                    />
                                </View>
                                <View style={styles.popularInfo}>
                                    <Text style={styles.popularName} numberOfLines={1}>
                                        {category.name}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* All Categories Title */}
                <View style={styles.allCategoriesHeader}>
                    <Text style={styles.allCategoriesTitle}>All Categories</Text>
                </View>

                {/* Categories Grid */}
                <View style={styles.gridContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.categoryCard}
                            onPress={() => handleCategoryPress(category)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.categoryIconCircle,
                                    { backgroundColor: category.bgColor }
                                ]}
                            >
                                <Ionicons
                                    name={category.icon}
                                    size={32}
                                    color={category.color}
                                />
                            </View>
                            <Text style={styles.categoryName} numberOfLines={2}>
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Info */}
                <View style={styles.bottomInfo}>
                    <View style={styles.infoIconContainer}>
                        <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.infoText}>
                        Can't find what you're looking for? Try searching or check back later for new listings!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
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
        color: '#111827',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
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
        color: '#111827',
        marginLeft: 8,
        letterSpacing: -0.3,
    },
    popularCards: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
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
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    popularRankText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#EF4444',
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
        color: '#111827',
    },
    allCategoriesHeader: {
        marginBottom: 16,
    },
    allCategoriesTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
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
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 4,
    },
    bottomInfo: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    infoIconContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 20,
        fontWeight: '500',
    },
});

export default CategoriesScreen;