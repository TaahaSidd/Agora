import React, {useEffect, useState} from "react";
import {View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity} from "react-native";
import axios from "axios";
import {Ionicons} from '@expo/vector-icons';

import Card from '../components/Cards';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import EmptyBoxSvg from '../assets/svg/NoCatSVG.svg';

import {useCategoryItems} from '../hooks/useCategoryItems';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const CategoryScreen = ({route, navigation}) => {
    const {categoryId, categoryName} = route.params;
    const {items, loading, error} = useCategoryItems(categoryId);

    const mappedItems = items.map(i => ({
        ...i,
        images: i.imageUrl && i.imageUrl.length > 0
            ? i.imageUrl.map(url => ({uri: url}))
            : [require('../assets/LW.jpg')],
        name: i.title || 'Untitled',
    }));

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title={categoryName} onBack={() => navigation.goBack()}/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                    <Text style={styles.loadingText}>Loading {categoryName}...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title={categoryName} onBack={() => navigation.goBack()}/>
                <View style={styles.errorContainer}>
                    <View style={styles.errorIconCircle}>
                        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error}/>
                    </View>
                    <Text style={styles.errorTitle}>Something went wrong</Text>
                    <Text style={styles.errorText}>
                        We couldn't load the items. Please try again.
                    </Text>
                    <Button
                        title="Try Again"
                        variant="primary"
                        size="medium"
                        icon="refresh-outline"
                        iconPosition="left"
                        onPress={() => navigation.replace('CategoryScreen', {categoryId, categoryName})}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <EmptyBoxSvg width={180} height={180}/>
            <Text style={styles.emptyTitle}>No Items Found</Text>
            <Text style={styles.emptyText}>
                Check back later or explore other categories!
            </Text>
            <Button
                title="Explore Categories"
                variant="primary"
                size="medium"
                icon="grid-outline"
                iconPosition="left"
                onPress={() => navigation.goBack()}
                fullWidth={false}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader title={categoryName} onBack={() => navigation.goBack()}/>
            <View style={styles.container}>
                <FlatList
                    data={mappedItems}
                    renderItem={({item}) => <Card item={item}/>}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
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
        backgroundColor: COLORS.dark.bg,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: THEME.spacing.itemGap,
        paddingHorizontal: THEME.spacing.screenPadding,
    },
    listContent: {
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing['3xl'],
        flexGrow: 1,
    },

    // Loading State
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
    },
    loadingText: {
        marginTop: THEME.spacing.itemGap,
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },

    // Error State
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing['3xl'],
    },
    errorIconCircle: {
        width: 100,
        height: 100,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.errorBg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.lg,
    },
    errorTitle: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
    },
    errorText: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.base * THEME.lineHeight.relaxed,
        marginBottom: THEME.spacing.sectionGap,
        maxWidth: 300,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing['3xl'],
        paddingVertical: THEME.spacing['5xl'],
        minHeight: 500,
    },
    emptyTitle: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginTop: THEME.spacing.lg,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
    },
    emptyText: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textTertiary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.base * THEME.lineHeight.relaxed,
        marginBottom: THEME.spacing.sectionGap,
        maxWidth: 300,
    },
});

export default CategoryScreen;