import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');

export default function NearestCard({ item, onPress }) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image
                source={item.images?.[0] || require('../assets/LW.jpg')}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.textContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                </View>
                <Text style={styles.location} numberOfLines={1}>{item.college || 'Close to you ;)'}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.90,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginRight: 16,
        padding: 10,
        elevation: 1,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        flex: 1,
        marginRight: 8,
    },
    location: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
});
