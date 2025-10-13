import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import axios from "axios";

import Card from '../components/Cards';
import AppHeader from '../components/AppHeader';

const CategoryScreen = ({ route }) => {
    const { category } = route.params;
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryItems = async () => {
            try {
                const response = await axios.post("http://192.168.8.15:9000/Agora/listing/search", {
                    category: category
                });
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching category items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryItems();
    }, [category]);

    if (loading) {
        return <ActivityIndicator size="large" color="#008CFE" style={{ marginTop: 20 }} />;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <AppHeader title={`${category} Listing`} />

            <View style={styles.container}>
                <FlatList
                    data={items}
                    renderItem={({ item }) => <Card item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={<View><Text style={{ textAlign: 'center', marginTop: 20 }}>No items found</Text></View>}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});


export default CategoryScreen;
