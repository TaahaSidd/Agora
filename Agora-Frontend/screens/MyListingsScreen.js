import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, Alert } from 'react-native';
import { apiGet, apiDelete } from '../services/api';
import AppHeader from '../components/AppHeader';
import MyListingRowCard from '../components/MyListingRowCard';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const MyListingsScreen = ({ navigation }) => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyListings = async () => {
            setLoading(true);
            try {
                const data = await apiGet('/listing/my-listings');

                const formatted = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    name: item.title,
                    price: `₹ ${item.price}`,
                    image: item.image || null,
                    images: item.image ? [{ uri: item.image }] : [require('../assets/adaptive-icon.png')],
                    description: item.description,
                    seller: item.seller,
                    college: item.college,
                }));

                setListings(formatted);
            } catch (error) {
                console.error('Error fetching user listings:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyListings();
    }, []);

    const handleEdit = (item) => {
        console.log('Editing:', item.title);
        navigation.navigate('EditListingScreen', { listing: item });
    };

    const handleDelete = async (item) => {
        Alert.alert(
            'Delete Listing',
            `Are you sure you want to delete "${item.title}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await apiDelete(`/listing/delete/${item.id}`);
                            setListings(prev => prev.filter(l => l.id !== item.id));

                            Alert.alert('Success', 'Listing deleted successfully');
                        } catch (error) {
                            console.error('Delete error:', error.response?.data || error.message);
                            Alert.alert('Error', 'Failed to delete listing. Please try again.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <AppHeader title="My Listings" onBack={() => navigation.goBack()} />

            {listings.length === 0 ? (
                <Text style={styles.emptyText}>You haven’t listed any items yet.</Text>
            ) : (
                <FlatList
                    data={listings}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <MyListingRowCard
                            item={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.md,
    },
    emptyText: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
    },
});

export default MyListingsScreen;
