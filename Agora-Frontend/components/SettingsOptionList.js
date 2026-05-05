import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

export default function SettingsOptionList({ title, options }) {
    return (
        <View style={styles.section}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}

            <View style={styles.optionsCard}>
                {options.map((option, index) => {
                    const isLast = index === options.length - 1;
                    const themeColor = option.iconColor || (option.gradient ? option.gradient[0] : COLORS.primary);

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.optionItem, !isLast && styles.borderBottom]}
                            activeOpacity={0.6}
                            onPress={option.onPress}
                            disabled={option.disabled}
                        >
                            <View style={styles.optionLeft}>
                                <View style={[styles.iconWrapper, { backgroundColor: `${themeColor}12` }]}>
                                    {option.iconType === 'material' ? (
                                        <MaterialIcons
                                            name={option.icon}
                                            size={18}
                                            color={option.disabled ? COLORS.gray300 : themeColor}
                                        />
                                    ) : (
                                        <Ionicons
                                            name={option.icon}
                                            size={18}
                                            color={option.disabled ? COLORS.gray300 : themeColor}
                                        />
                                    )}
                                </View>

                                <View style={styles.textContainer}>
                                    <Text
                                        style={[
                                            styles.optionText,
                                            option.disabled && styles.optionTextDisabled,
                                            option.destructive && styles.optionTextDestructive,
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {option.label}
                                    </Text>
                                    {option.description && (
                                        <Text style={styles.optionDescription} numberOfLines={1}>
                                            {option.description}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.optionRight}>
                                {option.value && (
                                    <Text style={styles.optionValue} numberOfLines={1}>
                                        {option.value}
                                    </Text>
                                )}
                                {option.badge && (
                                    <View style={[styles.badge, { backgroundColor: `${themeColor}12` }]}>
                                        <Text style={[styles.badgeText, { color: themeColor }]}>
                                            {option.badge}
                                        </Text>
                                    </View>
                                )}
                                {!option.hideChevron && (
                                    <Ionicons
                                        name="chevron-forward"
                                        size={14}
                                        color={option.disabled ? COLORS.gray200 : COLORS.gray300}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        marginBottom: 6,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    optionsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 11,
        paddingHorizontal: 14,
        minHeight: 52,
    },
    borderBottom: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.light.text,
        letterSpacing: -0.2,
    },
    optionTextDisabled: {
        color: COLORS.gray300,
    },
    optionTextDestructive: {
        color: COLORS.danger,
    },
    optionDescription: {
        fontSize: 12,
        color: COLORS.gray400,
        marginTop: 1,
        fontWeight: '400',
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginLeft: 8,
    },
    optionValue: {
        fontSize: 13,
        color: COLORS.gray400,
        fontWeight: '400',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});