import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle
}) => {
    const buttonStyles = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];

    const titleStyles = [
        styles.title,
        styles[`${size}Text`],
        variant === 'secondary' && styles.secondaryText,
        variant === 'outline' && styles.outlineText,
        variant === 'ghost' && styles.ghostText,
        variant === 'danger' && styles.dangerText,
        disabled && styles.disabledText,
        textStyle,
    ];

    const renderIcon = () => {
        if (!icon) return null;
        const iconColor = variant === 'primary' || variant === 'danger'
            ? COLORS.white
            : COLORS.primary;
        const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;

        return (
            <Ionicons
                name={icon}
                size={iconSize}
                color={disabled ? '#9CA3AF' : iconColor}
                style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
            />
        );
    };

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? COLORS.white : COLORS.primary}
                    size={size === 'small' ? 'small' : 'small'}
                />
            ) : (
                <View style={styles.content}>
                    {iconPosition === 'left' && renderIcon()}
                    <Text style={titleStyles}>{title}</Text>
                    {iconPosition === 'right' && renderIcon()}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: THEME.borderRadius.full,
        elevation: 1,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Variants
    primary: {
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    secondary: {
        backgroundColor: '#EFF6FF',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
        shadowOpacity: 0,
        elevation: 0,
    },
    ghost: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
    },
    danger: {
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: 'transparent',
    },

    // Sizes
    small: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: THEME.borderRadius.full,
    },
    medium: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: THEME.borderRadius.full,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 28,
        borderRadius: THEME.borderRadius.full,
    },

    // States
    // disabled: {
    //     backgroundColor: COLORS.dark.cardElevated,
    //     borderColor: COLORS.dark.border,
    //     opacity: THEME.opacity.disabled,
    //     shadowOpacity: 0,
    //     elevation: 0,
    // },
    disabled: {
        backgroundColor: COLORS.transparentWhite10, // Very subtle
        borderColor: COLORS.dark.border,
        borderWidth: THEME.borderWidth.hairline,
        shadowOpacity: 0,
        elevation: 0,
    },
    fullWidth: {
        width: '100%',
    },

    // Text Styles
    title: {
        color: COLORS.white,
        fontWeight: '700',
    },
    smallText: {
        fontSize: 13,
    },
    mediumText: {
        fontSize: 15,
    },
    largeText: {
        fontSize: 17,
    },
    secondaryText: {
        color: COLORS.primary,
    },
    outlineText: {
        color: COLORS.primary,
    },
    ghostText: {
        color: COLORS.primary,
    },
    dangerText: {
        color: COLORS.white,
    },
    disabledText: {
        color: COLORS.gray400,
    },

    // Icon Styles
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});

export default Button;