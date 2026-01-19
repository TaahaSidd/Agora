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
import axios from "axios";
import debounce from "lodash.debounce";

import {COLORS} from '../utils/colors';
import {THEME} from "../utils/theme";

import SearchInput from "../components/SearchInput";
import Card from "../components/Cards"; // ✅ Import your Card component

import RoadSVG from '../assets/svg/RoadSVG.svg';

const BACKEND_URL = "https://francisca-overjocular-cheryle.ngrok-free.dev/Agora";

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
            const response = await axios.post(`${BACKEND_URL}/listing/search`, {
                keyword: query,
            });

            const formatted = response.data.map(item => ({
                ...item,
                images: item.imageUrl && item.imageUrl.length > 0
                    ? item.imageUrl.map(url => ({uri: url}))
                    : [require('../assets/no-image.jpg')],
                name: item.title || 'Untitled',
                price: item.price ? `₹ ${item.price}` : 'N/A',
            }));

            setSearchResults(formatted);
        } catch (err) {
            console.log("Search error:", err);
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

    const handleSearchItemPress = (item) => {
        if (!recentSearches.includes(item.title || item)) {
            setRecentSearches([item.title || item, ...recentSearches].slice(0, 10));
        }
    };

    // ✅ USE YOUR CARD COMPONENT
    const renderSearchResult = ({item}) => (
        <Card item={item} horizontal={false} />
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
                    color="#6B7280"
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
                    color="#67707fff"
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content"/>

            <View style={styles.container}>
                {/* Search Header */}
                <View style={styles.searchHeader}>
                    <TouchableOpacity
                        onPress={handleBackPress}
                        style={styles.backButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#ffffffff"/>
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

                {/* Results/List */}
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
                        // ✅ GRID LAYOUT FOR SEARCH RESULTS
                        numColumns={searchQuery ? 2 : 1}
                        key={searchQuery ? 'grid' : 'list'} // Force re-render on layout change
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
                                                color={COLORS.gray500}
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
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    searchHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: COLORS.dark.bgElevated,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
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
        color: COLORS.dark.text,
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
    // ✅ ADD COLUMN WRAPPER FOR GRID
    columnWrapper: {
        justifyContent: 'space-between',
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.dark.card,
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    itemIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.dark.textSecondary,
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
        color: COLORS.dark.textSecondary,
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
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.lg,
        borderWidth: THEME.borderWidth.thick,
        borderColor: COLORS.dark.border,
    },
    emptyTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginTop: THEME.spacing.lg,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
    },
});

export default SearchScreen;