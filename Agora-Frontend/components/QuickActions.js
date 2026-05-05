import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

export default function QuickActions({ title, actions }) {
    return (
        <View style={styles.section}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            <View style={styles.actionsContainer}>
                {actions.map((action, index) => {
                    const themeColor = action.iconColor || (action.gradient ? action.gradient[0] : COLORS.primary);

                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.actionButton}
                            activeOpacity={0.6}
                            onPress={action.onPress}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: `${themeColor}12` }]}>
                                <Ionicons name={action.icon} size={18} color={themeColor} />
                            </View>

                            <View style={styles.textContainer}>
                                {action.number !== undefined && (
                                    <Text style={styles.statNumber}>{action.number}</Text>
                                )}
                                <Text style={styles.label} numberOfLines={1}>
                                    {action.label}
                                </Text>
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
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        minHeight: 52,
        gap: 10,
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
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.gray400,
        letterSpacing: -0.1,
    },
    statNumber: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 1,
    },
});