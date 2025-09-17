import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const Button = ({ title, onPress, variant = 'primary', style, textStyle }) => {
    const buttonStyles = [
        styles.button,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'outline' && styles.outline,
        style,
    ];

    const titleStyles = [
        styles.title,
        variant === 'outline' && styles.outlineText,
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
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    outlineText: {
        color: COLORS.primary,
    },
});

export default Button;
