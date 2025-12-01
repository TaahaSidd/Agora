import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';
import FavoriteButton from './FavoriteButton';

const Card = ({ item, horizontal = false }) => {
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);

    const handlePress = () => {
        navigation.navigate('ProductDetailsScreen', { item });
    };

    return (
        <TouchableOpacity
            style={[styles.card, horizontal ? styles.horizontalCard : styles.gridCard]}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={item.images && item.images.length ? item.images[0] : require('../assets/LW.jpg')}
                    style={[styles.image, horizontal && styles.horizontalImage]}
                />
                <FavoriteButton
                    listingId={item.id}
                    isFavorite={isFavorite}
                    onToggle={setIsFavorite}
                    size={THEME.iconSize.md}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.price}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: THEME.borderRadius.card,
        backgroundColor: COLORS.dark.card,
        marginBottom: THEME.spacing.md,
        overflow: 'hidden',
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.sm,
    },
    gridCard: {
        width: '48%',
    },
    horizontalCard: {
        width: 160,
        marginRight: THEME.spacing.xs,
    },
    imageWrapper: {
        position: 'relative',
        backgroundColor: COLORS.gray800,
    },
    image: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: THEME.borderRadius.card,
        borderTopRightRadius: THEME.borderRadius.card,
    },
    horizontalImage: {
        height: 110,
    },
    info: {
        padding: THEME.spacing.sm,
        gap: THEME.spacing[1],
    },
    price: {
        fontWeight: THEME.fontWeight.extrabold,
        fontSize: THEME.fontSize.lg,
        color: COLORS.primary,
        letterSpacing: THEME.letterSpacing.tight,
    },
    name: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.text,
        fontWeight: THEME.fontWeight.extrabold,
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.snug,
    },
});

export default Card;