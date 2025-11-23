import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiGet, apiDelete } from '../services/api';

import { COLORS } from '../utils/colors';

import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import FavoriteButton from '../components/FavoriteButton';
import Button from '../components/Button';

import FavoriteSvg from '../assets/svg/favouriteItem.svg'

const FavoritesScreen = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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
                        : [require('../assets/LW.jpg')],
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
            } else {
                const res = await apiPost(`/favorites/${listingId}`);
                setFavorites(prev => [...prev, { ...res, isFavorite: true }]);
            }
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
        }
    };

    const clearAllFavorites = async () => {
        try {
            for (const item of favorites) {
                await apiDelete(`/favorites/${item.id}`);
            }
            setFavorites([]);
        } catch (error) {
            console.error("Failed to clear favorites:", error);
        }
    };

    const getFilteredFavorites = () => {
        if (filter === 'all') return favorites;
        if (filter === 'available') return favorites.filter(item => item.status !== 'SOLD');
        if (filter === 'sold') return favorites.filter(item => item.status === 'SOLD');
        return favorites;
    };

    const filteredFavorites = getFilteredFavorites();

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
                <FavoriteSvg width={160} height={160} />
            </View>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
                Start adding items to your favorites to see them here
            </Text>

            <Button
                title="Browse Listings"
                icon="compass-outline"
                iconPosition="left"
                onPress={() => navigation.navigate('MainLayout')}
                fullWidth={false}
                variant="primary"
                size="medium"
            />
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Stats Card */}
            <View style={styles.statsCard}>
                <View style={styles.statItem}>
                    <View style={styles.statIconCircle}>
                        <Ionicons name="heart" size={20} color="#DC2626" />
                    </View>
                    <Text style={styles.statNumber}>{favorites.length}</Text>
                    <Text style={styles.statLabel}>Total Favorites</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <View style={styles.statIconCircle}>
                        <Ionicons name="pricetag" size={20} color="#10B981" />
                    </View>
                    <Text style={styles.statNumber}>
                        {favorites.filter(item => item.status !== 'SOLD').length}
                    </Text>
                    <Text style={styles.statLabel}>Available</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {['all', 'available', 'sold'].map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterTab, filter === f && styles.activeFilter]}
                        onPress={() => setFilter(f)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)} (
                            {f === 'all'
                                ? favorites.length
                                : f === 'available'
                                    ? favorites.filter(item => item.status !== 'SOLD').length
                                    : favorites.filter(item => item.status === 'SOLD').length
                            }
                            )
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Actions Row */}
            {favorites.length > 0 && (
                <View style={styles.actionsRow}>
                    <Text style={styles.resultCount}>
                        {filteredFavorites.length} {filteredFavorites.length === 1 ? 'item' : 'items'}
                    </Text>
                    <TouchableOpacity
                        onPress={clearAllFavorites}
                        style={styles.clearButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title="Favorites" onBack={() => navigation.goBack()} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading favorites...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="Favorites" onBack={() => navigation.goBack()} />

            {favorites.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={filteredFavorites}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    ListHeaderComponent={renderHeader}
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
                    ListEmptyComponent={
                        <View style={styles.emptyFilterState}>
                            <Ionicons name="filter-outline" size={48} color="#D1D5DB" />
                            <Text style={styles.emptyFilterText}>No items in this category</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 15,
        color: COLORS.dark.textQuaternary,
        fontWeight: '500',
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.dark.divider,
        marginHorizontal: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    activeFilter: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
    },
    activeFilterText: {
        color: '#fff',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultCount: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    clearText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#EF4444',
    },
    listContent: {
        paddingBottom: 20,
        flexGrow: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    emptyContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    emptyIconCircle: {
        width: 180,
        height: 180,
        borderRadius: 60,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    browseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 14,
        elevation: 1,
        gap: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyFilterState: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyFilterText: {
        fontSize: 15,
        color: '#9CA3AF',
        marginTop: 12,
        fontWeight: '500',
    },
});

export default FavoritesScreen;