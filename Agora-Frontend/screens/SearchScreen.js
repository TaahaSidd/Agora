import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import debounce from "lodash.debounce";

const BACKEND_URL = "http://192.168.8.15:9000/Agora";

const SearchScreen = ({ navigation }) => {
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
            setSearchResults(response.data);
        } catch (err) {
            console.log("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(fetchSearchResults, 500), []);

    const handleChangeText = (text) => {
        setSearchQuery(text);
        debouncedSearch(text);
        if (query.trim() !== "") {
            setRecentSearches((prev) => {
                const updated = [query, ...prev.filter(item => item !== query)];
                return updated.slice(0, 3);
            });

            fetchSearchResults(query);
        }
    };

    const handleClearAll = () => setRecentSearches([]);

    const handleBackPress = () => navigation.goBack();

    const handleSearchItemPress = (item) => {
        // Add to recent searches if it's not there
        if (!recentSearches.includes(item.title || item)) {
            setRecentSearches([item.title || item, ...recentSearches].slice(0, 10));
        }
        navigation.navigate("ProductDetailsScreen", { item });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => handleSearchItemPress(item)}
        >
            <Text style={styles.itemText}>{item.title || item}</Text>
            {!searchQuery && (
                <Ionicons
                    name="close-circle"
                    size={16}
                    color="#999"
                    style={styles.itemIcon}
                />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.container}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={20} color="#000" />
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Search for “Stationery”'
                        placeholderTextColor="#979797"
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={handleChangeText}
                    />
                </View>


                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                        {searchQuery ? "Search Results" : "Recent Search"}
                    </Text>
                    {!searchQuery && recentSearches.length > 0 && (
                        <TouchableOpacity onPress={handleClearAll}>
                            <Text style={styles.clearText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>


                {loading ? (
                    <ActivityIndicator size="large" color="#008CFE" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={searchQuery ? searchResults : recentSearches}
                        keyExtractor={(item, index) => `${item.id || item}-${index}`}
                        renderItem={renderItem}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>
                                {searchQuery ? "No results found" : "No recent searches"}
                            </Text>
                        }
                        keyboardShouldPersistTaps="handled"
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 38,
        marginBottom: 12,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "#f1f1f1",
        color: "#000",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    headerText: { fontSize: 16, fontWeight: "700", color: "#000" },
    clearText: { fontSize: 14, color: "#008CFE" },
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#ccc",
    },
    itemText: { fontSize: 14, color: "#000", flex: 1 },
    itemIcon: { marginLeft: 8 },
    emptyText: { textAlign: "center", marginTop: 20, color: "#999" },
});

export default SearchScreen;

//fix some minor ui in screen.