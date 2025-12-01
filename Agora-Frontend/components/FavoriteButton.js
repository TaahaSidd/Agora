import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import { useFavorites } from '../context/FavoritesContext';

const FavoriteButton = ({ listingId, size = 22, style }) => {
    const { favorites, toggleFavorite } = useFavorites();
    const [loading, setLoading] = useState(false);

    const isFavorite = favorites.some(f => f.id === listingId);

    const handlePress = async () => {
        if (loading) return;
        setLoading(true);
        await toggleFavorite(listingId);
        setLoading(false);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={[styles.button, style]}>
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Icon
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={size}
                    color={isFavorite ? 'red' : '#fff'}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: THEME.spacing.sm,
        right: THEME.spacing.sm,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: THEME.spacing.sm - 4,
        borderRadius: THEME.borderRadius.full,
    },
});

export default FavoriteButton;