import React, {useCallback, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import debounce from "lodash.debounce";

import {COLORS} from '../utils/colors';
import {THEME} from "../utils/theme";
import {apiPost} from '../services/api';

import SearchInput from "../components/SearchInput";
import Card from "../components/Cards";

import RoadSVG from '../assets/svg/RoadSVG.svg';

const SearchScreen = ({navigation}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSearchResults = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await apiPost('/listing/search', {
                keyword: query,
            });

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

        if (text.trim().length >= 2) {
            setRecentSearches((prev) => {
                const updated = [text, ...prev.filter(item => item !== text)];
                return updated.slice(0, 3);
            });
        }
    };

    const handleClearAll = () => setRecentSearches([]);
    const handleBackPress = () => navigation.goBack();

    const renderSearchResult = ({item}) => (
        <Card item={item} horizontal={false}/>
    );

    const renderRecentSearch = ({item}) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => {
                setSearchQuery(item);
                handleChangeText(item);
            }}
            activeOpacity={0.7}
        >
            <View style={styles.itemIconContainer}>
                <Ionicons
                    name="time-outline"
                    size={20}
                    color={COLORS.light.textTertiary}
                />
            </View>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={(e) => {
                    e.stopPropagation();
                    setRecentSearches(prev => prev.filter(search => search !== item));
                }}
            >
                <Ionicons
                    name="close-circle"
                    size={20}
                    color={COLORS.light.textTertiary}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>

            <View style={styles.container}>
                {/* Search Header */}
                <View style={styles.searchHeader}>
                    <TouchableOpacity
                        onPress={handleBackPress}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        {/* Changed from white to text color */}
                        <Ionicons name="arrow-back" size={24} color={COLORS.light.text}/>
                    </TouchableOpacity>
                    <SearchInput
                        value={searchQuery}
                        onChangeText={handleChangeText}
                        placeholder='Search for "Stationery"'
                        autoFocus
                        onClear={() => setSearchQuery("")}
                    />
                </View>

                {/* Section Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                        {searchQuery ? "Search Results" : "Recent Searches"}
                    </Text>
                    {!searchQuery && recentSearches.length > 0 && (
                        <TouchableOpacity
                            onPress={handleClearAll}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.clearText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary}/>
                        <Text style={styles.loadingText}>Searching...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={searchQuery ? searchResults : recentSearches}
                        keyExtractor={(item, index) => `${item.id || item}-${index}`}
                        renderItem={searchQuery ? renderSearchResult : renderRecentSearch}
                        numColumns={searchQuery ? 2 : 1}
                        key={searchQuery ? 'grid' : 'list'}
                        columnWrapperStyle={searchQuery ? styles.columnWrapper : null}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                {searchQuery ? (
                                    <>
                                        <RoadSVG width={180} height={180}/>
                                        <Text style={styles.emptyTitle}>No results found</Text>
                                        <Text style={styles.emptySubtitle}>
                                            Try searching with different keywords
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.emptyIconContainer}>
                                            <Ionicons
                                                name="time-outline"
                                                size={48}
                                                color={COLORS.light.textTertiary}
                                            />
                                        </View>
                                        <Text style={styles.emptyTitle}>No recent searches</Text>
                                        <Text style={styles.emptySubtitle}>
                                            Your search history will appear here
                                        </Text>
                                    </>
                                )}
                            </View>
                        }
                        keyboardShouldPersistTaps="handled"
                    />
                )}
            </View>
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
        backgroundColor: COLORS.light.bg,
    },
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
    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.light.text,
        letterSpacing: -0.3,
    },
    clearText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.light.card,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05, // Lowered opacity for cleaner light mode
        shadowRadius: 8,
        elevation: 2,
    },
    itemIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.light.bgTertiary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.light.textSecondary,
        fontWeight: "600",
    },
    removeButton: {
        padding: 4,
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.light.textSecondary,
        fontWeight: "500",
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: THEME.spacing['3xl'],
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.light.bgTertiary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.lg,
        borderWidth: THEME.borderWidth.thick,
        borderColor: COLORS.light.border,
    },
    emptyTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.light.text,
        marginTop: THEME.spacing.lg,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
    },
});

export default SearchScreen;