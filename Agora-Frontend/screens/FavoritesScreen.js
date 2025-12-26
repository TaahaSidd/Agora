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
import {LinearGradient} from 'expo-linear-gradient';
import {apiGet, apiDelete} from '../services/api';

import {COLORS} from '../utils/colors';

import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import Button from '../components/Button';

import FavoriteSvg from '../assets/svg/favouriteItem.svg'

const FavoritesScreen = ({navigation}) => {
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
                        ? item.imageUrl.map(url => ({uri: url}))
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
                setFavorites(prev => [...prev, {...res, isFavorite: true}]);
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
                <FavoriteSvg width={160} height={160}/>
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
                    <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={styles.statIconCircle}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name="heart" size={20} color="#fff"/>
                    </LinearGradient>
                    <Text style={styles.statNumber}>{favorites.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statDivider}/>
                <View style={styles.statItem}>
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.statIconCircle}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name="pricetag" size={20} color="#fff"/>
                    </LinearGradient>
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
                        style={[
                            styles.filterTab,
                            filter === f && styles.activeFilter
                        ]}
                        onPress={() => setFilter(f)}
                        activeOpacity={0.85}
                    >
                        {filter === f ? (
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                style={styles.activeFilterGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            >
                                <Text style={styles.activeFilterText}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
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
                            </LinearGradient>
                        ) : (
                            <>
                                <Text style={styles.filterText}>
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </Text>
                                <View style={styles.inactiveBadge}>
                                    <Text style={styles.inactiveBadgeText}>
                                        {f === 'all'
                                            ? favorites.length
                                            : f === 'available'
                                                ? favorites.filter(item => item.status !== 'SOLD').length
                                                : favorites.filter(item => item.status === 'SOLD').length
                                        }
                                    </Text>
                                </View>
                            </>
                        )}
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
                        activeOpacity={0.85}
                    >
                        <Ionicons name="trash-outline" size={16} color="#EF4444"/>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title="Favorites" onBack={() => navigation.goBack()}/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                    <Text style={styles.loadingText}>Loading favorites...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>
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
                                <Ionicons name="filter-outline" size={40} color={COLORS.dark.textTertiary}/>
                            </View>
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
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
        letterSpacing: -0.1,
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: COLORS.dark.border,
        marginHorizontal: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 16,
    },
    filterTab: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    activeFilter: {
        // Gradient is inside
    },
    activeFilterGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 6,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        paddingVertical: 12,
        letterSpacing: -0.2,
    },
    activeFilterText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: -0.2,
    },
    filterBadge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
    },
    filterBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
    },
    inactiveBadge: {
        backgroundColor: COLORS.dark.cardElevated,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        minWidth: 24,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 4,
    },
    inactiveBadgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.dark.textSecondary,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultCount: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
        letterSpacing: -0.1,
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: 10,
    },
    clearText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#EF4444',
        letterSpacing: -0.1,
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
        borderRadius: 90,
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
        letterSpacing: -0.1,
    },
    emptyFilterState: {
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyFilterIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyFilterText: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        marginTop: 12,
        fontWeight: '600',
        letterSpacing: -0.1,
    },
});

export default FavoritesScreen;