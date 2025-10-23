import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const FeaturedCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress?.(item)}>
            <Image source={item.images?.[0]} style={styles.image} resizeMode="cover" />
            <View style={styles.info}>
                <Text numberOfLines={1} style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 220,
        borderRadius: 16,
        backgroundColor: '#fff',
        marginRight: 16,
        elevation: 1,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 160,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    info: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: '#008CFE',
    },
});

export default FeaturedCard;
