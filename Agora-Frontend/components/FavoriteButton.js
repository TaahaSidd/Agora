import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const FavoriteButton = ({ size = 22 }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={toggleFavorite}
            activeOpacity={0.7}
        >
            <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={size}
                color={isFavorite ? COLORS.red : COLORS.white}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: THEME.spacing.sm,
        right: THEME.spacing.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: THEME.spacing.sm - 4,
        borderRadius: THEME.borderRadius.full,
    },
});

export default FavoriteButton;
