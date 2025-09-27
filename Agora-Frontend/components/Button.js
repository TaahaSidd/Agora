import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const Button = ({ title, onPress, variant = 'primary', style, textStyle }) => {
    const buttonStyles = [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        style,
    ];

    const titleStyles = [
        styles.title,
        variant === 'secondary' && styles.secondaryText,
        textStyle,
    ];

    return (
        <TouchableOpacity style={buttonStyles} onPress={onPress}>
            <Text style={titleStyles}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: THEME.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    primary: {
        backgroundColor: COLORS.primary,
        borderWidth:2,
        borderColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    title: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryText: {
        color: COLORS.primary,
    },
});

export default Button;
