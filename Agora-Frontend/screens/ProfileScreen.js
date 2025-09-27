import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import Button from '../components/Button';
import Card from '../components/Cards';
import { THEME } from '../utils/theme';

const isAndroid = Platform.OS === 'android';

const ProfileScreen = ({ navigation }) => {
    const [isFollowing, setIsFollowing] = useState(false);

    const listings = [
        {
            id: '1',
            name: 'Laptop',
            price: '₹40,000',
            images: [require('../assets/22a475e555d7-best-laptop-deals.jpg')]
        },
        {
            id: '2',
            name: 'Bike',
            price: '₹55,000',
            images: ['https://via.placeholder.com/150']
        },
        {
            id: '3',
            name: 'Shoes',
            price: '₹2,500',
            images: ['https://via.placeholder.com/150']
        },
        {
            id: '4',
            name: 'Cap',
            price: '₹500',
            images: ['https://via.placeholder.com/150']
        },
    ];

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
                    <View style={styles.avatarPlaceholder} />
                    <View style={styles.profileDetails}>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>John Doe</Text>
                            <View style={styles.verifiedTag}>
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
                                {/* <Text style={styles.verifiedText}>Verified</Text> */}
                            </View>
                        </View>

                        {/* College Name */}
                        <Text style={styles.collegeName}>Amity University</Text>

                        <Button
                            title={isFollowing ? "Following" : "Follow"}
                            variant={isFollowing ? "primary" : "secondary"}
                            style={styles.followBtn}
                            textStyle={{
                                color: isFollowing ? COLORS.white : COLORS.primary,
                            }}
                            onPress={() => setIsFollowing(!isFollowing)}
                        />
                    </View>
                </View>

                {/* Listings */}
                <Text style={styles.listingsHeader}>Listings</Text>
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
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
    verifiedText: { fontSize: 12, marginLeft: 4, color: COLORS.primary },
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
