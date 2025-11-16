import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';
import FavoriteButton from './FavoriteButton';

const Card = ({ item }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('ProductDetails', { item });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            {/* Image */}
            <View style={styles.imageWrapper}>
                <Image
                    source={item.images ? item.images[0] : item.image}
                    style={styles.image}
                />
                <FavoriteButton />
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.description} numberOfLines={1}>
                    {item.description || "No description available No description available No description available No description available No description available"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '47%',
        borderRadius: THEME.borderRadius.md,
        backgroundColor: COLORS.white,
        marginBottom: THEME.spacing.md,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: 'hidden',
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 140,
    },
    info: {
        padding: THEME.spacing.sm,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        color: COLORS.primary,
        marginBottom: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.darkBlue,
        marginBottom: 2,
    },
    description: {
        fontSize: 12,
        color: '#666',
    },
});

export default Card;
