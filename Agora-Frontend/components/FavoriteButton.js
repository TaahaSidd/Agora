import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {THEME} from '../utils/theme';
import {COLORS} from '../utils/colors'; // Added COLORS import
import {useFavorites} from '../context/FavoritesContext';
import {useUserStore} from '../stores/userStore';

const FavoriteButton = ({listingId, size = 22, style, onGuestPress}) => {
    const {favorites, toggleFavorite} = useFavorites();
    const {isGuest} = useUserStore();
    const [loading, setLoading] = useState(false);

    const isFavorite = favorites.some(f => f.id === listingId);

    const handlePress = async () => {
        if (isGuest) {
            if (onGuestPress) {
                onGuestPress();
            }
            return;
        }

        if (loading) return;
        setLoading(true);
        try {
            await toggleFavorite(listingId);
        } catch (err) {
            console.log("Favorite toggle failed:", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[styles.button, style]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary}/>
            ) : (
                <Icon
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={size}
                    // In light mode, outline is better as a dark gray/black for contrast
                    color={isFavorite ? '#EF4444' : COLORS.light.text}
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
        backgroundColor: '#FFFFFF',
        padding: THEME.spacing.sm - 2,
        borderRadius: THEME.borderRadius.full,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
});

export default FavoriteButton;