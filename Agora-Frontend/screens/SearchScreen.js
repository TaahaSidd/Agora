import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([
        'Glove box',
        'Nike shoes',
    ]);

    const handleClearAll = () => {
        setRecentSearches([]);
    };

    const handleBackPress = () => {
        navigation.navigate('MainLayout');
    };
    const handleSearchItemPress = (item) => {
        console.log('Search recent item clicked:', item);
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={20} color="#000" />
                </TouchableOpacity>
                <View style={styles.inputWrapper}>
                    <TextInput
                        placeholder='Search for “Stationery”'
                        placeholderTextColor="#979797"
                        style={styles.input}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Recent Search</Text>
                {recentSearches.length > 0 && (
                    <TouchableOpacity onPress={handleClearAll}>
                        <Text style={styles.clearText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Recent searches list */}
            <FlatList
                data={recentSearches}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.recentItem}
                        onPress={() => handleSearchItemPress(item)}
                    >
                        <Text style={styles.recentText}>{item}</Text>
                        <Ionicons
                            name="close-circle"
                            size={16}
                            color="#999"
                            style={styles.recentIcon}
                        />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No recent searches</Text>}
                keyboardShouldPersistTaps="handled"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, padding: 16 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        marginBottom: 20,
        marginTop: 40,
    },
    backButton: { marginRight: 10 },
    inputWrapper: { flex: 1 },
    input: { fontSize: 14, color: '#000' },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerText: { fontWeight: 'bold', fontSize: 16, color: '#000' },
    clearText: { fontSize: 14, color: '#4B47FD' },
    recentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
    },
    recentText: { fontSize: 14, color: '#666' },
    recentIcon: { alignSelf: 'center' },
    emptyText: { color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
});

export default SearchScreen;