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
        backgroundColor: COLORS.white, // Changed to white
    },
    bannerSkeleton: {
        width: '100%',
        height: 200,
        backgroundColor: '#E1E9EE', // Light gray skeleton base
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    avatarSkeleton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F2F8FC',
        borderWidth: 4,
        borderColor: COLORS.white, // Border matches white background
    },
    nameSkeleton: {
        width: 180,
        height: 28,
        backgroundColor: '#E1E9EE',
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing[2],
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: COLORS.white, // Changed
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
        borderWidth: 1,
        borderColor: COLORS.light.border, // Light border
    },
    statNumberSkeleton: {
        width: 40,
        height: 24,
        backgroundColor: '#E1E9EE',
        borderRadius: THEME.borderRadius.sm,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.light.border,
    },
    cardSkeleton: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginBottom: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    cardImageSkeleton: {
        width: '100%',
        height: 150,
        backgroundColor: '#E1E9EE',
        borderRadius: 14,
        marginBottom: 8,
    },
});

export default ProfileSkeleton;