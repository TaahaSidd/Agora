import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
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
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={{ position: 'relative' }}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            borderColor: isFocused ? COLORS.primary : '#E5E5E5',
                            shadowOpacity: isFocused ? 0.15 : 0.08,
                        },
                        inputStyle,
                        secureTextEntry && { paddingRight: 50 },
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword((prev) => !prev)}
                    >
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={24}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: THEME.spacing.md },
    label: { fontSize: 14, fontWeight: '600', color: COLORS.black, marginBottom: 6 },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.md,
        paddingVertical: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        color: COLORS.black,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 1,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 12,
        zIndex: 1,
        padding: 5,
    },
});

export default InputField;
