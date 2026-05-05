import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { apiGet, apiDelete } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import ActionBottomSheet from '../components/ActionBottomSheet';
import LoadingSpinner from '../components/LoadingSpinner';


import FavoriteSvg from '../assets/svg/favouriteItem.svg';

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clearing, setClearing] = useState(false); // Track delete-all progress
    const [showClearModal, setShowClearModal] = useState(false);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            setLoading(true);
            const data = await apiGet("/favorites");

            const formatted = data.map(item => ({
                ...item,
                isFavorite: true,
                name: item.title || item.name || 'Untitled',
                price: item.price ? `₹ ${item.price}` : 'N/A',
                images:
                    item.imageUrl && item.imageUrl.length > 0
                        ? item.imageUrl.map(url => ({ uri: url }))
                        : [require('../assets/no-image.jpg')],
            }));

            setFavorites(formatted);
        } catch (error) {
            console.error("Failed to load favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (listingId, currentlyFavorite) => {
        try {
            if (currentlyFavorite) {
                await apiDelete(`/favorites/${listingId}`);
                setFavorites(prev => prev.filter(item => item.id !== listingId));
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    const clearAllFavorites = async () => {
        try {
            setClearing(true);
            // Ideally, your backend should have a DELETE /favorites/clear endpoint
            // But if not, this executes all deletes in parallel (faster than a 'for' loop)
            await Promise.all(favorites.map(item => apiDelete(`/favorites/${item.id}`)));

            setFavorites([]);
            setShowClearModal(false);
        } catch (error) {
            console.error("Failed to clear favorites:", error);
        } finally {
            setClearing(false);
        }
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <FavoriteSvg width={100} height={100} />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
                Items you heart in the marketplace will appear here for quick access.
            </Text>
        </View>
    );

    // if (loading) {
    //     return (
    //         <SafeAreaView style={styles.safeArea}>
    //             <AppHeader title="Favorites" onBack={() => navigation.goBack()} />
    //             <View style={styles.loadingContainer}>
    //                 <ActivityIndicator size="large" color={COLORS.primary} />
    //             </View>
    //         </SafeAreaView>
    //     );
    // }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />

            <AppHeader
                title="Favorites"
                onBack={() => navigation.goBack()}
                rightComponent={
                    favorites.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setShowClearModal(true)}
                            style={styles.headerAction}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={22}
                                color="#EF4444"
                            />
                        </TouchableOpacity>
                    )
                }
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <LoadingSpinner size="medium" color={COLORS.primary} />
                </View>
            ) : favorites.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <Card
                            item={item}
                            onPress={() => navigation.navigate('ProductDetailsScreen', { item })}
                            isFavorite={item.isFavorite}
                            onFavoriteToggle={() => toggleFavorite(item.id, item.isFavorite)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <ActionBottomSheet
                visible={showClearModal}
                onClose={() => !clearing && setShowClearModal(false)} // Prevent close while deleting
                onConfirm={clearAllFavorites}
                loading={clearing}
                title="Clear Favorites?"
                message="This will remove all items from your list. This action cannot be undone."
                confirmText="Clear All"
                isDestructive={true}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    headerAction: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingTop: THEME.spacing.md,
        paddingBottom: THEME.spacing['2xl'],
        flexGrow: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing['2xl'],
    },
    emptyTitle: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.light.text,
        marginTop: THEME.spacing.lg,
        marginBottom: THEME.spacing[2],
    },
    emptyText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default FavoritesScreen;