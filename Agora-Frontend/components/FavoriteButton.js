import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';
import { useFavorites } from '../context/FavoritesContext';
import { useUserStore } from '../stores/userStore';

const FavoriteButton = ({ listingId, size = 22, style, onGuestPress }) => {
    const { favorites, toggleFavorite } = useFavorites();
    const { isGuest } = useUserStore();

    // Scale value for the "Pop" animation
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // This is now instant because the Context updates immediately
    const isFavorite = favorites.some(f => f.id === listingId);

    const animateButton = () => {
        // Reset scale to 1 first in case of rapid clicks
        scaleAnim.setValue(1);

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.3,
                duration: 100,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePress = () => {
        if (isGuest) {
            onGuestPress?.();
            return;
        }

        animateButton();

        toggleFavorite(listingId);
    };

    return (
        <Animated.View style={[
            styles.button,
            style,
            { transform: [{ scale: scaleAnim }] }
        ]}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Icon
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={size}
                    color={isFavorite ? '#EF4444' : COLORS.light.text}
                />
            </TouchableOpacity>
        </Animated.View>
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
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FavoriteButton;