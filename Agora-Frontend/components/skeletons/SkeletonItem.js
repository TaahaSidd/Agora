import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../utils/colors';

const SkeletonItem = ({ width, height, borderRadius = 8, style }) => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnimation, {
                toValue: 1,
                duration: 6500,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View style={[styles.skeleton, { width, height, borderRadius }, style]}>
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                    },
                ]}
            >
                <LinearGradient
                    colors={[COLORS.dark.card, COLORS.dark.cardElevated, COLORS.dark.card]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                />
            </Animated.View>
        </View>
    );
};

// Settings Screen Skeleton
export const SettingsScreenSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Header Skeleton */}
            <View style={styles.headerSection}>
                <SkeletonItem width={150} height={32} borderRadius={8} />
                <View style={{ height: 8 }} />
                <SkeletonItem width={220} height={16} borderRadius={6} />
            </View>

            {/* Profile Card Skeleton */}
            <View style={styles.profileCard}>
                <SkeletonItem width={70} height={70} borderRadius={35} />
                <View style={styles.profileInfo}>
                    <SkeletonItem width={140} height={20} borderRadius={6} />
                    <View style={{ height: 8 }} />
                    <SkeletonItem width={180} height={16} borderRadius={6} />
                    <View style={{ height: 12 }} />
                    <SkeletonItem width={100} height={32} borderRadius={12} />
                </View>
            </View>

            {/* Quick Actions Skeleton */}
            <View style={styles.section}>
                <SkeletonItem width={120} height={20} borderRadius={6} style={{ marginBottom: 12 }} />
                <View style={styles.quickActionsRow}>
                    <SkeletonItem width={100} height={100} borderRadius={16} />
                    <SkeletonItem width={100} height={100} borderRadius={16} />
                    <SkeletonItem width={100} height={100} borderRadius={16} />
                </View>
            </View>

            {/* Options List Skeleton */}
            <View style={styles.section}>
                <SkeletonItem width={100} height={20} borderRadius={6} style={{ marginBottom: 12 }} />
                <View style={styles.optionsCard}>
                    {[1, 2, 3].map((item) => (
                        <View key={item}>
                            <View style={styles.optionItem}>
                                <View style={styles.optionLeft}>
                                    <SkeletonItem width={40} height={40} borderRadius={20} />
                                    <SkeletonItem width={100} height={16} borderRadius={6} style={{ marginLeft: 14 }} />
                                </View>
                                <SkeletonItem width={60} height={16} borderRadius={6} />
                            </View>
                            {item < 3 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>
            </View>

            {/* Another Options List */}
            <View style={styles.section}>
                <SkeletonItem width={140} height={20} borderRadius={6} style={{ marginBottom: 12 }} />
                <View style={styles.optionsCard}>
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item}>
                            <View style={styles.optionItem}>
                                <View style={styles.optionLeft}>
                                    <SkeletonItem width={40} height={40} borderRadius={20} />
                                    <SkeletonItem width={80} height={16} borderRadius={6} style={{ marginLeft: 14 }} />
                                </View>
                            </View>
                            {item < 4 && <View style={styles.divider} />}
                        </View>
                    ))}
                </View>
            </View>

            {/* Logout Button Skeleton */}
            <View style={{ height: 24 }} />
            <SkeletonItem width={100} height={52} borderRadius={16} />
        </View>
    );
};

// Product Card Skeleton
export const ProductCardSkeleton = () => {
    return (
        <View style={styles.productCard}>
            <SkeletonItem width={100} height={150} borderRadius={16} />
            <View style={{ height: 12 }} />
            <SkeletonItem width={90} height={16} borderRadius={6} />
            <View style={{ height: 8 }} />
            <SkeletonItem width={60} height={20} borderRadius={6} />
            <View style={{ height: 8 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SkeletonItem width={40} height={16} borderRadius={6} />
                <SkeletonItem width={30} height={16} borderRadius={6} />
            </View>
        </View>
    );
};

// Listings Grid Skeleton
export const ListingsGridSkeleton = () => {
    return (
        <View style={styles.gridContainer}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} style={styles.gridItem}>
                    <ProductCardSkeleton />
                </View>
            ))}
        </View>
    );
};

// Profile Screen Skeleton
export const ProfileScreenSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Profile Header */}
            <View style={styles.profileCard}>
                <SkeletonItem width={90} height={90} borderRadius={45} />
                <View style={styles.profileInfo}>
                    <SkeletonItem width={160} height={22} borderRadius={6} />
                    <View style={{ height: 8 }} />
                    <SkeletonItem width={200} height={16} borderRadius={6} />
                    <View style={{ height: 12 }} />
                    <SkeletonItem width={110} height={36} borderRadius={12} />
                </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
                {[1, 2, 3].map((item) => (
                    <View key={item} style={styles.statItem}>
                        <SkeletonItem width={44} height={44} borderRadius={22} />
                        <View style={{ height: 8 }} />
                        <SkeletonItem width={40} height={20} borderRadius={6} />
                        <View style={{ height: 4 }} />
                        <SkeletonItem width={60} height={14} borderRadius={6} />
                    </View>
                ))}
            </View>

            {/* Info Sections */}
            {[1, 2].map((section) => (
                <View key={section} style={styles.section}>
                    <SkeletonItem width={150} height={20} borderRadius={6} style={{ marginBottom: 12 }} />
                    <View style={styles.infoCard}>
                        {[1, 2, 3].map((item) => (
                            <View key={item}>
                                <View style={{ marginBottom: 16 }}>
                                    <SkeletonItem width={80} height={14} borderRadius={6} />
                                    <View style={{ height: 8 }} />
                                    <SkeletonItem width={100} height={48} borderRadius={12} />
                                </View>
                                {item < 3 && <View style={styles.divider} />}
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </View>
    );
};

// List Item Skeleton
export const ListItemSkeleton = () => {
    return (
        <View style={styles.listItem}>
            <SkeletonItem width={60} height={60} borderRadius={12} />
            <View style={{ flex: 1, marginLeft: 12 }}>
                <SkeletonItem width={80} height={16} borderRadius={6} />
                <View style={{ height: 8 }} />
                <SkeletonItem width={60} height={14} borderRadius={6} />
                <View style={{ height: 8 }} />
                <SkeletonItem width={40} height={14} borderRadius={6} />
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: '#E1E9EE', // Light gray base
        overflow: 'hidden',
    },
    shimmer: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
        width: '100%',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: COLORS.light.bg, // Changed
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white, // Changed
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    optionsCard: {
        backgroundColor: COLORS.white, // Changed
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.light.border, // Changed
        marginHorizontal: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.white, // Changed
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        justifyContent: 'space-around',
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    productCard: {
        backgroundColor: COLORS.white, // Changed
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, // Softer shadow for light mode
        shadowRadius: 8,
        elevation: 3,
    },
    listItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white, // Changed
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
});

export default SkeletonItem;