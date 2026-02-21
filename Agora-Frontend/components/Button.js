import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

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

        // Dynamic Icon Color
        let iconColor = COLORS.white;
        if (variant === 'secondary' || variant === 'outline' || variant === 'ghost') {
            iconColor = COLORS.primary;
        } else if (variant === 'danger') {
            iconColor = '#EF4444';
        }

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
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? COLORS.primary : COLORS.primary}
                    size="small"
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
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // --- VARIANTS ---
    primary: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0,
        shadowRadius: 8,
        elevation: 0,
    },
    secondary: {
        backgroundColor: '#EBF2FF',
        borderWidth: 1,
        borderColor: '#D1E1FF',
        elevation: 0,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        elevation: 0,
    },
    ghost: {
        backgroundColor: 'transparent',
        elevation: 0,
    },
    danger: {
        backgroundColor: '#FEE2E2',
        elevation: 0,
    },

    // --- SIZES ---
    small: {paddingVertical: 8, paddingHorizontal: 16},
    medium: {paddingVertical: 14, paddingHorizontal: 24},
    large: {paddingVertical: 18, paddingHorizontal: 32},

    disabled: {
        backgroundColor: '#e1e2e4',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        elevation: 0,
    },
    fullWidth: {width: '100%'},

    // --- TEXT STYLES ---
    title: {
        color: COLORS.white,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    smallText: {fontSize: 13},
    mediumText: {fontSize: 16},
    largeText: {fontSize: 18},

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
        color: '#EF4444',
    },
    disabledText: {
        color: '#9CA3AF',
    },

    iconLeft: {marginRight: 8},
    iconRight: {marginLeft: 8},
});

export default Button;