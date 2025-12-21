import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const PhoneInputField = ({
    label = 'Phone Number',
    value,
    onChangeText,
    placeholder = '98765 43210',
    style,
    error,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    // Shake animation on error
    useEffect(() => {
        if (error) {
            Animated.sequence([
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
                Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
            ]).start();
        }
    }, [error]);

    const handleChangeText = (text) => {
        // Only allow numbers, max 10 digits
        const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
        onChangeText(cleaned);
    };

    const borderColor = error ? COLORS.error : isFocused ? COLORS.primary : COLORS.dark.border;
    const shadowOpacity = isFocused ? 0.2 : 0.08;
    const showFloatingLabel = isFocused || value;

    return (
        <View style={[styles.container, style]}>
            {label && showFloatingLabel && (
                <View style={styles.floatingLabelContainer}>
                    <Text
                        style={[
                            styles.floatingLabel,
                            {
                                color: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.dark.text,
                            },
                        ]}
                    >
                        {label}
                    </Text>
                </View>
            )}

            <Animated.View
                style={{
                    transform: [{ translateX: shakeAnim }],
                }}
            >
                <View style={styles.inputRow}>
                    {/* Country Code Box */}
                    <View
                        style={[
                            styles.countryCodeBox,
                            {
                                borderColor: borderColor,
                                shadowOpacity: shadowOpacity,
                            },
                        ]}
                    >
                        <Text style={styles.countryCodeText}>+91</Text>
                    </View>

                    {/* Phone Number Input */}
                    <View
                        style={[
                            styles.inputWrapper,
                            {
                                borderColor: borderColor,
                                shadowOpacity: shadowOpacity,
                            },
                        ]}
                    >
                        <TextInput
                            style={styles.input}
                            value={value}
                            onChangeText={handleChangeText}
                            placeholder={showFloatingLabel ? placeholder : (label || placeholder)}
                            placeholderTextColor={COLORS.dark.textTertiary}
                            keyboardType="phone-pad"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            maxLength={10}
                        />
                    </View>
                </View>
            </Animated.View>

            {error && (
                <View style={styles.footerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: THEME.spacing.md,
        position: 'relative',
    },
    floatingLabelContainer: {
        position: 'absolute',
        top: -10,
        left: 16,
        backgroundColor: COLORS.dark.bg,
        paddingHorizontal: 4,
        zIndex: 3,
        borderRadius: THEME.borderRadius.full,
    },
    floatingLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countryCodeBox: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.full,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        height: 56,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark.text,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.full,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.dark.text,
        paddingVertical: 0,
    },
    footerContainer: {
        marginTop: 6,
        paddingHorizontal: 4,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        fontWeight: '500',
    },
});

export default PhoneInputField;