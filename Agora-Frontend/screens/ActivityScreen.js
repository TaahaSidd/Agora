import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import AppHeader from '../components/AppHeader';

const ActivityScreen = () => {
    const activityData = [
        {
            id: '1',
            type: 'listed',
            itemName: 'Laptop',
            time: '2h ago',
            image: require('../assets/22a475e555d7-best-laptop-deals.jpg'),
        },
        {
            id: '2',
            type: 'offer',
            itemName: 'Bike',
            time: '5h ago',
            image: require('../assets/bike.jpg'),
        },
        {
            id: '3',
            type: 'listed',
            itemName: 'Shoes',
            time: '1d ago',
            image: require('../assets/nikeshoes.jpg'),
        },
        {
            id: '4',
            type: 'listed',
            itemName: 'Shoes',
            time: '1d ago',
            image: require('../assets/nikeshoes.jpg'),
        },
        {
            id: '5',
            type: 'listed',
            itemName: 'Shoes',
            time: '1d ago',
            image: require('../assets/nikeshoes.jpg'),
        },
        {
            id: '6',
            type: 'listed',
            itemName: 'Shoes',
            time: '1d ago',
            image: require('../assets/nikeshoes.jpg'),
        },
    ];

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text style={styles.itemMeta}>
                    {item.type === 'listed' ? 'You listed this item' : 'Received an offer'} • {item.time}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Replace your old header View with AppHeader */}
            <AppHeader title="Activity" />

            {/* Activity List */}
            <FlatList
                data={activityData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: THEME.spacing.md }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    card: {
        flexDirection: 'row',
        marginBottom: THEME.spacing.md,
        padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        backgroundColor: COLORS.white,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: THEME.borderRadius.md,
        marginRight: THEME.spacing.md,
    },
    info: { flex: 1 },
    itemName: {
        fontWeight: '600',
        fontSize: 16,
        color: COLORS.darkBlue,
        marginBottom: 4,
    },
    itemMeta: {
        fontSize: 12,
        color: '#888',
    },
});

export default ActivityScreen;