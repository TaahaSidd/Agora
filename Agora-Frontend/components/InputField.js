import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const InputField = ({
                        label,
                        value,
                        onChangeText,
                        placeholder,
                        secureTextEntry = false,
                        keyboardType = 'default',
                        style,
                        inputStyle,
                        error,
                        leftIcon,
                        maxLength,
                        showCharCount = false,
                        disabled = false,
                    }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const shakeAnim = useRef(new Animated.Value(0)).current;

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

    // Fixed: Using Light theme border color variable
    const borderColor = error ? COLORS.error : isFocused ? COLORS.primary : COLORS.light.border;
    const shadowOpacity = isFocused ? 0.2 : 0.08;
    const showFloatingLabel = isFocused || (value && value.length > 0);

    return (
        <View style={[styles.container, style]}>
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                <View
                    style={[
                        styles.inputWrapper,
                        {
                            borderColor,
                            shadowOpacity,
                        },
                    ]}
                >
                    {/* Fixed: Label background must match screen background to be readable */}
                    {label && showFloatingLabel && (
                        <View style={styles.floatingLabelContainer}>
                            <Text
                                style={[
                                    styles.floatingLabel,
                                    {
                                        color: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.light.text,
                                    },
                                ]}
                            >
                                {label}
                            </Text>
                        </View>
                    )}

                    <View style={styles.innerContainer}>
                        {leftIcon && (
                            <View style={styles.leftIconContainer}>
                                <MaterialCommunityIcons
                                    name={leftIcon}
                                    size={22}
                                    color={isFocused ? COLORS.primary : COLORS.light.textTertiary}
                                />
                            </View>
                        )}

                        <TextInput
                            style={[
                                styles.input,
                                leftIcon && { paddingLeft: 0 },
                                secureTextEntry && { paddingRight: 0 },
                                inputStyle,
                            ]}
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={showFloatingLabel ? '' : (label || placeholder)}
                            placeholderTextColor={COLORS.light.textTertiary}
                            secureTextEntry={secureTextEntry && !showPassword}
                            keyboardType={keyboardType}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            maxLength={maxLength}
                            editable={!disabled}
                        />

                        {secureTextEntry && (
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword((prev) => !prev)}
                                activeOpacity={0.7}
                            >
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye' : 'eye-off'}
                                    size={22}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Animated.View>

            {(error || (showCharCount && maxLength)) && (
                <View style={styles.footerContainer}>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    {showCharCount && maxLength && (
                        <Text style={styles.charCount}>
                            {value?.length || 0}/{maxLength}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: THEME.spacing.md,
    },
    inputWrapper: {
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.full, // Reverted to your original
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
        overflow: 'visible',
    },
    floatingLabelContainer: {
        position: 'absolute',
        top: -10,
        left: 16,
        // Changed to match your light background color so it doesn't overlap the text
        backgroundColor: COLORS.light.bg,
        paddingHorizontal: 4,
        zIndex: 2,
        borderRadius: THEME.borderRadius.full, // Reverted to your original
    },
    floatingLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16, // Reverted to your original
        paddingVertical: 16,  // Reverted to your original
    },
    leftIconContainer: {
        marginRight: 12, // Reverted to your original
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.light.text,
        paddingVertical: 0,
    },
    eyeIcon: {
        marginLeft: 12,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        paddingHorizontal: 4,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
    charCount: {
        color: COLORS.light.textTertiary,
        fontSize: 12,
        fontWeight: '500',
    },
});

export default InputField;