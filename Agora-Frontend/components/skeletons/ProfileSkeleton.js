import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { COLORS } from '../../utils/colors';
import { THEME } from "../../utils/theme";

const { width } = Dimensions.get('window');

const ProfileSkeleton = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* 1. Banner Section */}
                <View style={styles.bannerSection}>
                    <View style={styles.bannerSkeleton} />

                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarSkeleton} />
                    </View>
                </View>

                {/* 2. Profile Info */}
                <View style={styles.profileInfo}>
                    <View style={styles.nameSkeleton} />
                    <View style={styles.collegeRowSkeleton} />

                    {/* Stats Container */}
                    <View style={styles.statsContainer}>
                        {[1, 2, 3].map((i) => (
                            <React.Fragment key={i}>
                                <View style={styles.statItem}>
                                    <View style={styles.statNumberSkeleton} />
                                    <View style={styles.statLabelSkeleton} />
                                </View>
                                {i < 3 && <View style={styles.statDivider} />}
                            </React.Fragment>
                        ))}
                    </View>

                    <View style={styles.followButtonSkeleton} />
                </View>

                {/* 3. Listings Section */}
                <View style={styles.listingsSection}>
                    <View style={styles.listingsHeader}>
                        <View style={styles.sectionTitleSkeleton} />
                        <View style={styles.countBadgeSkeleton} />
                    </View>

                    <View style={styles.filterContainer}>
                        <View style={styles.filterTabSkeleton} />
                        <View style={styles.filterTabSkeleton} />
                        <View style={styles.filterTabSkeleton} />
                    </View>

                    {/* Listings Grid */}
                    <View style={styles.listingsGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <View key={i} style={styles.cardSkeleton}>
                                {/* FIXED: Replaced div with View */}
                                <View style={styles.cardImageSkeleton} />
                                <View style={styles.cardContentSkeleton}>
                                    <View style={styles.cardTitleSkeleton} />
                                    <View style={styles.cardPriceSkeleton} />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
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
        flex: 1,
    },
    bannerSection: {
        position: 'relative',
        height: 240,
    },
    bannerSkeleton: {
        width: '100%',
        height: 200,
        backgroundColor: '#E1E9EE',
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
        backgroundColor: '#F2F8FC',
        borderWidth: 4,
        borderColor: COLORS.light.bg,
    },
    profileInfo: {
        paddingHorizontal: THEME.spacing.lg,
        paddingTop: THEME.spacing.md,
        alignItems: 'center',
    },
    nameSkeleton: {
        width: 220,
        height: 32,
        backgroundColor: '#E1E9EE',
        borderRadius: 8,
        marginBottom: THEME.spacing[2],
    },
    collegeRowSkeleton: {
        width: 160,
        height: 18,
        backgroundColor: '#F2F8FC',
        borderRadius: 4,
        marginBottom: THEME.spacing.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: COLORS.light.card,
        padding: THEME.spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        marginBottom: THEME.spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumberSkeleton: {
        width: 35,
        height: 22,
        backgroundColor: '#E1E9EE',
        borderRadius: 4,
        marginBottom: 6,
    },
    statLabelSkeleton: {
        width: 50,
        height: 12,
        backgroundColor: '#F2F8FC',
        borderRadius: 4,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.light.border,
    },
    followButtonSkeleton: {
        width: '100%',
        height: 48,
        backgroundColor: '#E1E9EE',
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing.md,
    },
    listingsSection: {
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing.md,
    },
    listingsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    sectionTitleSkeleton: {
        width: 100,
        height: 24,
        backgroundColor: '#E1E9EE',
        borderRadius: 6,
    },
    countBadgeSkeleton: {
        width: 40,
        height: 24,
        backgroundColor: '#E1E9EE',
        borderRadius: 20,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: THEME.spacing[2],
        marginBottom: THEME.spacing.lg,
    },
    filterTabSkeleton: {
        width: 80,
        height: 36,
        backgroundColor: '#F2F8FC',
        borderRadius: 20,
    },
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardSkeleton: {
        width: '48%',
        backgroundColor: COLORS.white,
        borderRadius: 20,
        marginBottom: 16,
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
    cardContentSkeleton: {
        gap: 6,
    },
    cardTitleSkeleton: {
        width: '80%',
        height: 14,
        backgroundColor: '#E1E9EE',
        borderRadius: 4,
    },
    cardPriceSkeleton: {
        width: '40%',
        height: 14,
        backgroundColor: '#F2F8FC',
        borderRadius: 4,
    }
});

export default ProfileSkeleton;