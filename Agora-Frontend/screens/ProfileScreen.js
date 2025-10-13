import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, Platform, StatusBar, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import Button from '../components/Button';
import Card from '../components/Cards';
import { THEME } from '../utils/theme';
import { apiGet } from '../services/api';

const isAndroid = Platform.OS === 'android';

const ProfileScreen = ({ navigation, route }) => {
    const { sellerId } = route.params;
    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSellerData = async () => {
            try {
                setLoading(true);

                const response = await apiGet(`/profile/seller/${sellerId}`);
                setSeller(response.data.seller);
                setListings(response.data.listings);

                setLoading(false);
            } catch (err) {
                console.error("Failed to load seller profile:", err);
                setLoading(false);
            }
        };

        loadSellerData();
    }, [sellerId]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.darkBlue}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.headerTitle}>Profile</Text>
                    <Ionicons name="ellipsis-vertical" size={22} color={COLORS.darkBlue} />
                </View>

                {/* Profile Info */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: seller?.profilePic || 'https://i.pravatar.cc/100' }}
                        style={styles.avatarPlaceholder}
                    />
                    <View style={styles.profileDetails}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{seller?.userName || 'Seller'}</Text>
                            {seller?.verified && (
                                <View style={styles.verifiedTag}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                                </View>
                            )}
                        </View>

                        <Text style={styles.collegeName}>{seller?.collegeName || 'College'}</Text>

                        <Button
                            title={isFollowing ? "Following" : "Follow"}
                            variant={isFollowing ? "primary" : "secondary"}
                            style={styles.followBtn}
                            textStyle={{ color: isFollowing ? COLORS.white : COLORS.primary }}
                            onPress={() => setIsFollowing(!isFollowing)}
                        />
                    </View>
                </View>

                {/* Listings */}
                <Text style={styles.listingsHeader}>Listings</Text>
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                    renderItem={({ item }) => <Card item={item} />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: isAndroid ? StatusBar.currentHeight : 0,
    },
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.darkBlue },
    profileSection: { flexDirection: 'row', padding: 16, alignItems: 'center' },
    avatarPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 36,
        backgroundColor: '#ccc',
        marginRight: 16,
    },
    profileDetails: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center' },
    name: { fontSize: 18, fontWeight: '700', marginRight: 8 },
    verifiedTag: { flexDirection: 'row', alignItems: 'center' },
    collegeName: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: 2,
    },
    followBtn: { marginTop: 8, paddingVertical: 8 },
    listingsHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: THEME.spacing.md,
        marginLeft: THEME.spacing.md,
        marginBottom: THEME.spacing.sm,
    },
});

export default ProfileScreen;
