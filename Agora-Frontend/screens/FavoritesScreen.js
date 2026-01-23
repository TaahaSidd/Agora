import React, {useState, useEffect} from 'react';
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
import {Ionicons} from '@expo/vector-icons';
import {apiGet, apiDelete} from '../services/api';

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import Button from '../components/Button';
import ModalComponent from '../components/Modal';

import FavoriteSvg from '../assets/svg/favouriteItem.svg';

const FavoritesScreen = ({navigation}) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
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
                        ? item.imageUrl.map(url => ({uri: url}))
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
            for (const item of favorites) {
                await apiDelete(`/favorites/${item.id}`);
            }
            setFavorites([]);
            setShowClearModal(false);
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
            <FavoriteSvg width={200} height={200}/>
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
                Start adding items to your favorites to see them here
            </Text>
            {/*<Button*/}
            {/*    title="Browse Listings"*/}
            {/*    icon="compass-outline"*/}
            {/*    iconPosition="left"*/}
            {/*    onPress={() => navigation.navigate('MainLayout')}*/}
            {/*    variant="primary"*/}
            {/*    size="medium"*/}
            {/*/>*/}
        </View>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <View style={styles.filterTabs}>
                    {['all', 'available', 'sold'].map(f => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterTab,
                                filter === f && styles.filterTabActive
                            ]}
                            onPress={() => setFilter(f)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.filterText,
                                filter === f && styles.filterTextActive
                            ]}>
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Text>
                            {filter === f && (
                                <View style={styles.filterBadge}>
                                    <Text style={styles.filterBadgeText}>
                                        {f === 'all'
                                            ? favorites.length
                                            : f === 'available'
                                                ? favorites.filter(item => item.status !== 'SOLD').length
                                                : favorites.filter(item => item.status === 'SOLD').length
                                        }
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Clear All Button */}
                {favorites.length > 0 && (
                    <TouchableOpacity
                        onPress={() => setShowClearModal(true)}
                        style={styles.clearButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444"/>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title="Favorites" onBack={() => navigation.goBack()}/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content"/>
            <AppHeader title="Favorites" onBack={() => navigation.goBack()}/>

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
                    renderItem={({item}) => (
                        <Card
                            item={item}
                            onPress={() => navigation.navigate('ProductDetailsScreen', {item})}
                            isFavorite={item.isFavorite}
                            onFavoriteToggle={() => toggleFavorite(item.id, item.isFavorite)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyFilterState}>
                            <View style={styles.emptyFilterIcon}>
                                <Ionicons name="filter-outline" size={40} color={COLORS.light.textTertiary}/>
                            </View>
                            <Text style={styles.emptyFilterText}>No items in this category</Text>
                        </View>
                    }
                />
            )}

            <ModalComponent
                visible={showClearModal}
                type="delete"
                title="Clear All Favorites?"
                message={`Are you sure you want to remove all ${favorites.length} items from your favorites?`}
                primaryButtonText="Clear All"
                secondaryButtonText="Cancel"
                onPrimaryPress={clearAllFavorites}
                onSecondaryPress={() => setShowClearModal(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        paddingHorizontal: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        marginTop: THEME.spacing.md,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    filterTabs: {
        flexDirection: 'row',
        gap: THEME.spacing[2],
        flex: 1,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing[2],
        borderRadius: THEME.borderRadius.pill,
        backgroundColor: '#F3F4F6', // Light gray background for tabs
        borderWidth: 1,
        borderColor: COLORS.light.border,
        gap: THEME.spacing[1],
    },
    filterTabActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.light.textSecondary,
    },
    filterTextActive: {
        color: '#fff',
    },
    filterBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: THEME.spacing[2],
        paddingVertical: 2,
        borderRadius: THEME.borderRadius.pill,
        minWidth: 20,
        alignItems: 'center',
    },
    filterBadgeText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.bold,
        color: '#fff',
    },
    clearButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEF2F2', // Light red tint for delete
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FEE2E2',
        marginLeft: THEME.spacing[2],
    },
    listContent: {
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
        marginBottom: THEME.spacing.lg,
    },
    emptyFilterState: {
        alignItems: 'center',
        paddingTop: THEME.spacing['3xl'],
    },
    emptyFilterIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    emptyFilterText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.light.textTertiary,
        fontWeight: THEME.fontWeight.medium,
    },
});

export default FavoritesScreen;