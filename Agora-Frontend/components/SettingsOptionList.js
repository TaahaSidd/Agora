import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

export default function SettingsOptionList({ title, options }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.optionsCard}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.optionItem}
                        activeOpacity={0.7}
                        onPress={option.onPress}
                    >
                        <View style={styles.optionLeft}>
                            <View
                                style={[
                                    styles.optionIconCircle,
                                    { backgroundColor: option.bgColor },
                                ]}
                            >
                                {option.iconType === 'ion' ? (
                                    <Ionicons name={option.icon} size={20} color={option.iconColor} />
                                ) : (
                                    <MaterialIcons name={option.icon} size={20} color={option.iconColor} />
                                )}
                            </View>
                            <Text style={styles.optionText}>{option.label}</Text>
                        </View>

                        <View style={styles.optionRight}>
                            {option.value ? (
                                <Text style={styles.optionValue}>{option.value}</Text>
                            ) : null}
                            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 12,
    },
    optionsCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 4,
        elevation: 1,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.dark.text,
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionValue: {
        fontSize: 14,
        color: COLORS.dark.textQuaternary,
        marginRight: 8,
        fontWeight: '500',
    },
});
