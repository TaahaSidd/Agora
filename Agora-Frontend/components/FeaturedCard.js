import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';

const FeaturedCard = ({ item, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => onPress?.(item)}>
            <Image
                source={
                    item.images && item.images.length
                        ? item.images[0]
                        : require('../assets/LW.jpg')
                }

                style={styles.image}
                resizeMode="cover"
            />
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
        backgroundColor: COLORS.dark.card,
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
        color: COLORS.dark.text,
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: '800',
        color: COLORS.primary,
    },
});

export default FeaturedCard;
