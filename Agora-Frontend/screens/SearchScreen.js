import React, { useCallback, useState, useEffect } from "react";
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash.debounce";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';

import SearchInput from "../components/SearchInput";
import Card from "../components/Cards";
import LoadingSpinner from "../components/LoadingSpinner";

import RoadSVG from '../assets/svg/RoadSVG.svg';

const RECENT_SEARCHES_KEY = 'recent_searches_history';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
                if (stored) setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to load history", e);
            }
        };
        loadHistory();
    }, []);

    const saveSearch = async (term) => {
        const trimmedTerm = term.trim();
        if (trimmedTerm.length < 2) return;

        setRecentSearches((prev) => {
            const updated = [trimmedTerm, ...prev.filter(item => item !== trimmedTerm)].slice(0, 10);
            AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const fetchSearchResults = async (query) => {
        const cleanedQuery = query.trim();
        if (!cleanedQuery) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await apiPost('/listing/search', { keyword: cleanedQuery });

            if (res && Array.isArray(res)) {
                const formatted = res.map(item => ({
                    ...item,
                    images: item.imageUrl && item.imageUrl.length > 0
                        ? item.imageUrl.map(url => ({ uri: url }))
                        : [require('../assets/no-image.jpg')],
                    name: item.title || 'Untitled',
                    price: item.price ? `₹ ${item.price}` : 'N/A',
                }));

                setSearchResults(formatted);
                if (formatted.length > 0) saveSearch(cleanedQuery);
            } else {
                setSearchResults([]);
            }
        } catch (err) {
            console.log("Search error:", err.response?.status, err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleChangeText = (text) => {
        setSearchQuery(text);
        if (text.trim().length >= 2) {
            debouncedSearch(text);
        } else {
            setSearchResults([]);
        }
    };

    const handleClearAll = async () => {
        setRecentSearches([]);
        await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    };

    const removeSingleSearch = async (itemToRemove) => {
        const updated = recentSearches.filter(search => search !== itemToRemove);
        setRecentSearches(updated);
        await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    const renderSearchResult = ({ item }) => (
        <Card
            item={item}
            horizontal={false}
            onPress={() => {
                saveSearch(searchQuery);
                navigation.navigate('ProductDetailsScreen', { item });
            }}
        />
    );

    const renderRecentSearch = ({ item }) => (
        <View style={styles.chipContainer}>
            <TouchableOpacity
                onPress={() => {
                    setSearchQuery(item);
                    fetchSearchResults(item);
                }}
            >
                <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.chipRemoveIcon}
                onPress={() => removeSingleSearch(item)}
            >
                <Ionicons name="close" size={14} color={COLORS.light.textSecondary} />
            </TouchableOpacity>
        </View>
    );

    const isSearching = searchQuery.trim().length > 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <View style={styles.container}>
                <View style={styles.searchHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.light.text} />
                    </TouchableOpacity>
                    <SearchInput
                        value={searchQuery}
                        onChangeText={handleChangeText}
                        placeholder='Search for "Stationery"'
                        autoFocus
                        onClear={() => {
                            setSearchQuery("");
                            setSearchResults([]);
                        }}
                    />
                </View>

                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                        {isSearching ? "Search Results" : "Recent Searches"}
                    </Text>
                    {!isSearching && recentSearches.length > 0 && (
                        <TouchableOpacity onPress={handleClearAll}>
                            <Text style={styles.clearText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <LoadingSpinner size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Searching...</Text>
                    </View>
                ) : (
                    <FlatList
                        key={isSearching ? 'grid' : 'list'}
                        data={isSearching ? searchResults : recentSearches}
                        keyExtractor={(item, index) => `${item.id || item}-${index}`}
                        renderItem={isSearching ? renderSearchResult : renderRecentSearch}
                        numColumns={isSearching ? 2 : 1}
                        columnWrapperStyle={isSearching ? styles.columnWrapper : null}
                        contentContainerStyle={[
                            styles.listContainer,
                            !isSearching && styles.chipListContainer
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                {isSearching ? (
                                    <>
                                        <RoadSVG width={180} height={180} />
                                        <Text style={styles.emptyTitle}>No results found</Text>
                                        <Text style={styles.emptySubtitle}>Try different keywords</Text>
                                    </>
                                ) : (
                                    <View style={styles.emptyRecentContainer}>
                                        <Ionicons name="time-outline" size={48} color={COLORS.light.textTertiary} />
                                        <Text style={styles.emptyTitle}>No recent searches</Text>
                                    </View>
                                )}
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.light.bg },
    container: { flex: 1, backgroundColor: COLORS.light.bg },
    searchHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: COLORS.light.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light.border,
        marginTop: 30,
    },
    backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginRight: 8 },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    headerText: { fontSize: 18, fontWeight: "800", color: COLORS.light.text },
    clearText: { fontSize: 14, fontWeight: "700", color: COLORS.primary },
    listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
    columnWrapper: { justifyContent: 'space-between' },

    chipListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    chipContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.light.bgTertiary,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    itemText: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        fontWeight: "500",
    },
    chipRemoveIcon: {
        marginLeft: 6,
        padding: 2,
    },

    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingText: { marginTop: 12, fontSize: 14, color: COLORS.light.textSecondary },
    emptyContainer: { alignItems: 'center', paddingTop: 80 },
    emptyRecentContainer: { alignItems: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.light.text, marginTop: 16 },
    emptySubtitle: { fontSize: 14, color: COLORS.light.textSecondary, marginTop: 8 },
});

export default SearchScreen;