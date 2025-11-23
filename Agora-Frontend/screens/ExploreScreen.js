import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Animated, Text, View, TouchableOpacity, StatusBar, FlatList, Dimensions, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import * as Location from "expo-location";

import { useAutoSlide } from '../hooks/useAutoSlide';
import { useListings } from '../hooks/useListings';
import { useCurrentUser } from '../hooks/useCurrentUser';

import Card from '../components/Cards';
import FeaturedCard from '../components/FeaturedCard';
import NearestCard from '../components/NearestCard';
import Button from '../components/Button';
import Tag from '../components/Tag';
import Banner from '../components/Banner';
import ReferralBanner from '../components/ReferralBanner';
import DynamicHeader from '../components/DynamicHeader';

import NotFoundSVG from '../assets/svg/ErrorState.svg';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const { width } = Dimensions.get('window');

const SkeletonCard = () => (
    <View style={styles.skeletonCard}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonContent}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonPrice} />
        </View>
    </View>
);

const SkeletonFeaturedCard = () => (
    <View style={styles.skeletonFeatured}>
        <View style={styles.skeletonFeaturedImage} />
        <View style={styles.skeletonFeaturedTitle} />
        <View style={styles.skeletonFeaturedPrice} />
    </View>
);

const SkeletonNearestCard = () => (
    <View style={styles.skeletonNearest}>
        <View style={styles.skeletonNearestImage} />
        <View style={styles.skeletonNearestContent}>
            <View style={styles.skeletonNearestTitle} />
            <View style={styles.skeletonNearestPrice} />
            <View style={styles.skeletonNearestCollege} />
        </View>
    </View>
);

// Empty State Component
const EmptyState = ({ icon, title, subtitle, actionText, onAction }) => (
    <View style={styles.emptyState}>
        <View style={styles.emptyIconContainer}>
            <NotFoundSVG width={200} height={200} />
        </View>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
        {actionText && onAction && (
            <Button
                title={actionText}
                onPress={onAction}
                icon={null}
                fullWidth={true}
                variant="primary"
                size="medium"
            />
        )}
    </View>
);

const ExploreScreen = ({ navigation, scrollY }) => {
    const { items, loading, error, refetch } = useListings();
    const [refreshing, setRefreshing] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    const { user, loading: userLoading } = useCurrentUser();

    const collegeItems = useMemo(() => {
        if (!user) return [];
        return items.filter(item => item.seller?.collegeId === user.collegeId);
    }, [user, items]);

    //User location fetch
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission denied");
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
        })();
    }, []);

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const [nearestItems, setNearestItems] = useState([]);

    useEffect(() => {
        if (!userLocation || !items || items.length === 0) return;

        const nearby = items
            .map(listing => {
                if (!listing.college?.latitude || !listing.college?.longitude) return null;

                const dist = getDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    Number(listing.college.latitude),
                    Number(listing.college.longitude)
                );

                return { ...listing, distance: dist };
            })
            .filter(Boolean)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 10); // top 10 items

        setNearestItems(nearby);
    }, [userLocation, items]);


    const categoryItems = [
        { label: "Textbooks & Study Materials", value: "textbooks", icon: "book-outline" },
        { label: "Electronics & Gadgets", value: "electronics", icon: "laptop-outline" },
        { label: "Clothing & Accessories", value: "clothing", icon: "shirt-outline" },
        { label: "Furniture & Dorm Supplies", value: "furniture", icon: "bed-outline" },
        { label: "Stationery & Office Supplies", value: "stationery", icon: "pencil-outline" },
        { label: "Sports & Fitness Equipment", value: "sports", icon: "basketball-outline" },
        { label: "Bicycles & Transportation", value: "bicycles", icon: "bicycle-outline" },
        { label: "Food & Snacks", value: "food", icon: "fast-food-outline" },
        { label: "Housing & Roommates", value: "housing", icon: "home-outline" },
        { label: "Tutoring & Academic Services", value: "tutoring", icon: "school-outline" },
        { label: "Events & Tickets", value: "events", icon: "ticket-outline" },
        { label: "Miscellaneous", value: "miscellaneous", icon: "apps-outline" },
    ];

    const categories = categoryItems.map(item => item.label);
    const previewCount = 6;
    const previewCategories = categoryItems.slice(0, previewCount);
    const remainingCount = categoryItems.length - previewCount;


    const banners = [
        { source: require('../assets/banner.jpg'), title: 'Welcome to Agora', subtitle: 'Buy & Sell with fellow students', showBadge: true, badgeText: 'NEW', },
        { source: require('../assets/banner2.jpg'), title: 'Flash Deals!', subtitle: 'Check out today\'s hot offers', showBadge: true, badgeText: 'HOT', },
        { source: require('../assets/banner3.jpg'), title: 'Campus Favorites', subtitle: 'Popular items picked by students', showBadge: false, },
    ];

    const [currentBanner, setCurrentBanner] = useState(banners[0]);

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * banners.length);
        setCurrentBanner(banners[randomIndex]);
    }, []);

    const flatListRef = useRef();
    const currentIndex = useAutoSlide(nearestItems.length, 4000);

    useEffect(() => {
        flatListRef.current?.scrollToIndex({ index: currentIndex, animated: true });
    }, [currentIndex]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await refetch();
            const randomIndex = Math.floor(Math.random() * banners.length);
            setCurrentBanner(banners[randomIndex]);
        } catch (error) {
            console.error('Refresh failed:', error);
        } finally {
            setRefreshing(false);
        }
    };

    // Render loading skeletons
    const renderLoadingState = () => (
        <>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome Back</Text>
                    <Text style={styles.subGreeting}>Find your perfect deal today</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Search')} activeOpacity={0.7}>
                        <Icon name="search-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')} activeOpacity={0.7}>
                        <Icon name="notifications-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.skeletonBanner} />
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                </View>
                <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
                    {previewCategories.map(item => (
                        <Tag key={item.value} label={item.label} type="category" icon={{ library: "Ionicons", name: item.icon, color: "#008CFE" }} />
                    ))}
                </Animated.ScrollView>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommended</Text>
                </View>
                <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                    {[1, 2, 3].map(i => <SkeletonFeaturedCard key={i} />)}
                </Animated.ScrollView>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Nearest to You</Text>
                </View>
                <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                    {[1, 2].map(i => <SkeletonNearestCard key={i} />)}
                </Animated.ScrollView>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Explore More</Text>
                </View>
                <View style={styles.exploreGrid}>
                    {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                </View>
            </View>
        </>
    );

    // Render error state
    const renderErrorState = () => (
        <>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome Back</Text>
                    <Text style={styles.subGreeting}>Find your perfect deal today</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Search')} activeOpacity={0.7}>
                        <Icon name="search-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')} activeOpacity={0.7}>
                        <Icon name="notifications-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            </View>
            <EmptyState
                icon="alert-circle-outline"
                title="Something went wrong"
                subtitle="We couldn't load the listings. Please check your connection and try again."
                actionText="Try Again"
                onAction={refetch}
            />
        </>
    );

    const renderEmptyState = () => (
        <>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome Back</Text>
                    <Text style={styles.subGreeting}>Find your perfect deal today</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Search')} activeOpacity={0.7}>
                        <Icon name="search-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')} activeOpacity={0.7}>
                        <Icon name="notifications-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            </View>
            <EmptyState
                icon="cube-outline"
                title="No listings yet"
                subtitle="Be the first to list an item on Agora! Start selling to your fellow students today."
                actionText="Create Listing"
                onAction={() => navigation.navigate('AddListing')}
            />
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            <Animated.ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                        title="Pull to refresh"
                        titleColor="#6B7280"
                    />
                }
            >
                {loading && !refreshing ? (
                    renderLoadingState()
                ) : error ? (
                    renderErrorState()
                ) : items.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <>
                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <DynamicHeader />
                            </View>
                            <View style={styles.headerActions}>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => navigation.navigate('Search')}
                                    activeOpacity={0.7}
                                >
                                    <Icon name="search-outline" size={22} color="#E6F4FF" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.iconButton}
                                    onPress={() => navigation.navigate('Notification')}
                                    activeOpacity={0.7}
                                >
                                    <Icon name="notifications-outline" size={22} color="#E6F4FF" />
                                    <View style={styles.notificationBadge} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Banner */}
                        <View style={styles.section}>
                            <Banner
                                source={currentBanner.source}
                                title={currentBanner.title}
                                subtitle={currentBanner.subtitle}
                                showBadge={currentBanner.showBadge}
                                badgeText={currentBanner.badgeText}
                                onPress={() => console.log('Banner tapped')}
                            />
                        </View>

                        {/* Categories */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Categories</Text>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => navigation.navigate('CategoriesScreen')}
                                >
                                    <Text style={styles.seeAllText}>See All</Text>
                                </TouchableOpacity>
                            </View>
                            <Animated.ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.categoriesContainer}
                            >
                                {previewCategories.map(item => (
                                    <Tag
                                        key={item.value}
                                        label={item.label}
                                        type="category"
                                        icon={{ library: "Ionicons", name: item.icon, color: "#008CFE" }}
                                        onPress={() =>
                                            navigation.navigate("CategoryScreen", {
                                                categoryId: item.value,
                                                categoryName: item.label,
                                            })
                                        }
                                    />
                                ))}
                                {remainingCount > 0 && (
                                    <Tag label={`+${remainingCount} more`} type="category" />
                                )}
                            </Animated.ScrollView>
                        </View>

                        {/* From your college */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.titleWithIcon}>
                                    <Text style={styles.sectionTitle}>From Your College</Text>
                                    <View style={styles.recommendedBadge}>
                                        <Icon name="flame" size={14} color="#EF4444" />
                                    </View>
                                </View>
                            </View>

                            {collegeItems.length > 0 ? (
                                <Animated.ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalList}
                                >
                                    {collegeItems.slice(0, 6).map(item => (
                                        <FeaturedCard
                                            key={item.id}
                                            item={item}
                                            onPress={() => navigation.navigate('ProductDetailsScreen', { item })}
                                        />
                                    ))}
                                </Animated.ScrollView>
                            ) : (
                                <View style={styles.emptySection}>
                                    <Text style={styles.emptySectionText}>
                                        {user?.id
                                            ? 'No listings from your college yet.'
                                            : 'Log in to see listings from your college.'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Nearest to You */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.titleWithIcon}>
                                    <Text style={styles.sectionTitle}>Nearest to You</Text>
                                    <Icon name="location" size={16} color={COLORS.primary} style={{ marginLeft: 6 }} />
                                </View>
                            </View>

                            <FlatList
                                horizontal
                                ref={flatListRef}
                                showsHorizontalScrollIndicator={false}
                                data={nearestItems}
                                contentContainerStyle={styles.horizontalList}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <NearestCard
                                        item={item}
                                        onPress={() => navigation.navigate('ProductDetailsScreen', { item })}
                                    />
                                )}
                                getItemLayout={(data, index) => ({
                                    length: width * 0.9 + 40,
                                    offset: (width * 0.9 + 16) * index,
                                    index,
                                })}
                            />
                        </View>

                        {/* Referral Banner */}
                        <View style={styles.section}>
                            <ReferralBanner onPress={() => console.log('Referral clicked')} />
                        </View>

                        {/* Explore */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Explore More</Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('AllListingsScreen')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.seeAllText}>See All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={items.slice(0, 8)}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 6 }}
                                renderItem={({ item }) => (
                                    <Card
                                        item={item}
                                        horizontal={false}
                                        onPress={() => navigation.navigate('ProductDetailsScreen', { item })}
                                    />
                                )}
                                ListFooterComponent={() => (
                                    items.length > 6 ? (
                                        <TouchableOpacity
                                            style={styles.showAllCard}
                                            onPress={() => navigation.navigate('AllListingsScreen')}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.showAllText}>Show All</Text>
                                            <Icon name="chevron-forward" size={20} color="#111" />
                                        </TouchableOpacity>
                                    ) : null
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </>
                )}
            </Animated.ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    scrollContent: {
        paddingBottom: THEME.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.screenPadding,
        paddingTop: THEME.spacing.xs,
        paddingBottom: THEME.spacing.lg,
        backgroundColor: COLORS.dark.bgElevated,
    },
    headerActions: {
        flexDirection: 'row',
        gap: THEME.spacing.sm,
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.error,
        borderWidth: THEME.borderWidth.medium,
        borderColor: COLORS.dark.bgElevated,
    },
    section: {
        marginTop: THEME.spacing.sectionGap,
        paddingHorizontal: THEME.spacing.screenPadding,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    sectionTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        letterSpacing: THEME.letterSpacing.tight,
    },
    titleWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recommendedBadge: {
        marginLeft: THEME.spacing[2],
        width: THEME.iconSize.lg,
        height: THEME.iconSize.lg,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.errorBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    seeAllText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.semibold,
    },
    categoriesContainer: {
        paddingRight: THEME.spacing.screenPadding,
    },
    horizontalList: {
        paddingRight: THEME.spacing.screenPadding,
        paddingBottom: THEME.spacing[2],
    },
    exploreGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    showAllCard: {
        width: '48%',
        aspectRatio: 0.75,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.itemGap,
        borderWidth: THEME.borderWidth.medium,
        borderColor: COLORS.dark.border,
        borderStyle: 'dashed',
    },
    showAllText: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.textTertiary,
        marginBottom: THEME.spacing[1],
    },

    // Skeleton Styles
    skeletonBanner: {
        width: '100%',
        height: 160,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.card,
    },
    skeletonCard: {
        width: '48%',
        marginBottom: THEME.spacing.itemGap,
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        overflow: 'hidden',
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    skeletonImage: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: COLORS.dark.cardElevated,
    },
    skeletonContent: {
        padding: THEME.spacing.itemGap,
    },
    skeletonTitle: {
        height: 16,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginBottom: THEME.spacing[2],
    },
    skeletonPrice: {
        height: 14,
        width: '60%',
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
    },
    skeletonFeatured: {
        width: 180,
        marginRight: THEME.spacing.itemGap,
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        overflow: 'hidden',
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    skeletonFeaturedImage: {
        width: '100%',
        height: 180,
        backgroundColor: COLORS.dark.cardElevated,
    },
    skeletonFeaturedTitle: {
        height: 16,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        margin: THEME.spacing.itemGap,
        marginBottom: THEME.spacing[2],
    },
    skeletonFeaturedPrice: {
        height: 14,
        width: '50%',
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginHorizontal: THEME.spacing.itemGap,
        marginBottom: THEME.spacing.itemGap,
    },
    skeletonNearest: {
        width: width * 0.9,
        height: 140,
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        marginRight: THEME.spacing.md,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    skeletonNearestImage: {
        width: 140,
        height: 140,
        backgroundColor: COLORS.dark.cardElevated,
    },
    skeletonNearestContent: {
        flex: 1,
        padding: THEME.spacing.itemGap,
        justifyContent: 'space-between',
    },
    skeletonNearestTitle: {
        height: 16,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginBottom: THEME.spacing[2],
    },
    skeletonNearestPrice: {
        height: 14,
        width: '60%',
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginBottom: THEME.spacing[2],
    },
    skeletonNearestCollege: {
        height: 12,
        width: '40%',
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
    },

    greeting: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
    },
    subGreeting: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        marginTop: THEME.spacing[1],
    },

    // Empty State Styles
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: THEME.spacing['3xl'],
        paddingVertical: 100,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.sectionGap,
    },
    emptyTitle: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.base * THEME.lineHeight.relaxed,
        marginBottom: THEME.spacing.sectionGap,
    },
    emptyButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: THEME.spacing['2xl'],
        paddingVertical: THEME.spacing.sm + 2,
        borderRadius: THEME.borderRadius.button,
        ...THEME.shadows.md,
    },
    emptyButtonText: {
        color: COLORS.white,
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
    },

    emptySection: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: THEME.spacing['2xl'],
        paddingHorizontal: THEME.spacing.screenPadding,
        marginHorizontal: THEME.spacing.screenPadding,
    },
    emptySectionText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
        marginBottom: THEME.spacing[2],
    },
});

export default ExploreScreen;
