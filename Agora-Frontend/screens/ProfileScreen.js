import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/colors';
import Button from '../components/Button';

const ProfileScreen = ({ navigation }) => {
    const listings = [
        { id: '1', title: 'Laptop', price: '₹40,000', image: '../assets/22a475e555d7-best-laptop-deals.jpg'},
        { id: '2', title: 'Bike', price: '₹55,000', image: 'https://via.placeholder.com/150' },
        { id: '3', title: 'Shoes', price: '₹2,500', image: 'https://via.placeholder.com/150' },
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.darkBlue} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={22} color={COLORS.darkBlue} />
                    </TouchableOpacity>
                </View>

                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/80' }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileDetails}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>John Doe</Text>
                            <View style={styles.verifiedTag}>
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        </View>
                        <Button
                            title="Follow"
                            variant="secondary"
                            style={styles.followBtn}
                            textStyle={{ color: COLORS.primary }}
                        />
                    </View>
                </View>

                {/* Listings */}
                <Text style={styles.listingsHeader}>Listings</Text>
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image source={{ uri: item.image }} style={styles.cardImage} />
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardPrice}>{item.price}</Text>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white },
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#c00000ff',
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.darkBlue },
    profileSection: { flexDirection: 'row', padding: 16, alignItems: 'center' },
    avatar: { width: 70, height: 70, borderRadius: 35, marginRight: 16 },
    profileDetails: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    name: { fontSize: 18, fontWeight: '700', marginRight: 8 },
    verifiedTag: { flexDirection: 'row', alignItems: 'center' },
    verifiedText: { fontSize: 12, marginLeft: 4, color: COLORS.primary },
    followBtn: { marginTop: 8, paddingVertical: 8 },
    listingsHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginLeft: 16,
        marginBottom: 8,
    },
    card: {
        flex: 1,
        backgroundColor: '#fd0000ff',
        margin: 8,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    cardImage: { width: 100, height: 100, borderRadius: 8, marginBottom: 8 },
    cardTitle: { fontSize: 14, fontWeight: '600' },
    cardPrice: { fontSize: 13, color: COLORS.primary, marginTop: 4 },
});

export default ProfileScreen;

//working on the profilescreen
