import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {COLORS} from '../../utils/colors';
import {THEME} from "../../utils/theme";

const ProfileSkeleton = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>

            <View style={styles.container}>
                {/* Banner Skeleton */}
                <View style={styles.bannerSection}>
                    <View style={styles.bannerSkeleton}/>

                    {/* Avatar Skeleton */}
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarSkeleton}/>
                    </View>
                </View>

                {/* Profile Info Skeleton */}
                <View style={styles.profileInfo}>
                    {/* Name */}
                    <View style={styles.nameSkeleton}/>

                    {/* College */}
                    <View style={styles.collegeSkeleton}/>

                    {/* Stats Container */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <View style={styles.statNumberSkeleton}/>
                            <View style={styles.statLabelSkeleton}/>
                        </View>

                        <View style={styles.statDivider}/>

                        <View style={styles.statItem}>
                            <View style={styles.statNumberSkeleton}/>
                            <View style={styles.statLabelSkeleton}/>
                        </View>

                        <View style={styles.statDivider}/>

                        <View style={styles.statItem}>
                            <View style={styles.statNumberSkeleton}/>
                            <View style={styles.statLabelSkeleton}/>
                        </View>
                    </View>

                    {/* Follow Button Skeleton */}
                    <View style={styles.followButtonSkeleton}/>
                </View>

                {/* Listings Section */}
                <View style={styles.listingsSection}>
                    <View style={styles.listingsHeader}>
                        <View style={styles.sectionTitleSkeleton}/>
                        <View style={styles.countBadgeSkeleton}/>
                    </View>

                    {/* Filter Tabs */}
                    <View style={styles.filterContainer}>
                        <View style={styles.filterTabSkeleton}/>
                        <View style={styles.filterTabSkeleton}/>
                        <View style={styles.filterTabSkeleton}/>
                    </View>

                    {/* Listings Grid */}
                    <View style={styles.listingsGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <View key={i} style={styles.cardSkeleton}>
                                <View style={styles.cardImageSkeleton}/>
                                <View style={styles.cardContentSkeleton}>
                                    <View style={styles.cardTitleSkeleton}/>
                                    <View style={styles.cardPriceSkeleton}/>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        flex: 1,
    },

    // Banner Section
    bannerSection: {
        position: 'relative',
        height: 240,
        marginBottom: THEME.spacing.md,
    },
    bannerSkeleton: {
        width: '100%',
        height: 200,
        backgroundColor: COLORS.dark.cardElevated,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    avatarWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    avatarSkeleton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.dark.card,
        borderWidth: 4,
        borderColor: COLORS.dark.bg,
    },

    // Profile Info
    profileInfo: {
        paddingHorizontal: THEME.spacing.lg,
        paddingTop: THEME.spacing.md,
        alignItems: 'center',
    },
    nameSkeleton: {
        width: 180,
        height: 28,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing[2],
    },
    collegeSkeleton: {
        width: 140,
        height: 16,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.sm,
        marginBottom: THEME.spacing.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: COLORS.dark.card,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumberSkeleton: {
        width: 40,
        height: 24,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.sm,
        marginBottom: THEME.spacing[1],
    },
    statLabelSkeleton: {
        width: 60,
        height: 12,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.dark.border,
    },
    followButtonSkeleton: {
        width: '100%',
        height: 48,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.lg,
    },

    // Listings Section
    listingsSection: {
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing.md,
    },
    listingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.md,
    },
    sectionTitleSkeleton: {
        width: 100,
        height: 24,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.sm,
    },
    countBadgeSkeleton: {
        width: 40,
        height: 24,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.pill,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: THEME.spacing[2],
        marginBottom: THEME.spacing.lg,
    },
    filterTabSkeleton: {
        width: 80,
        height: 36,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.pill,
    },

    // Listings Grid
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardSkeleton: {
        width: '48%',
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        marginBottom: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    cardImageSkeleton: {
        width: '100%',
        height: 150,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: 14,
        marginBottom: 8,
    },
    cardContentSkeleton: {
        padding: 10,
    },
    cardTitleSkeleton: {
        width: '80%',
        height: 14,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginBottom: 6,
    },
    cardPriceSkeleton: {
        width: '50%',
        height: 18,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
    },
});

export default ProfileSkeleton;