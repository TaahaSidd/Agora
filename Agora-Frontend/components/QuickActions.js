import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';

export default function QuickActions({ title, actions }) {
    return (
        <View style={styles.section}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            <View style={styles.row}>
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                        onPress={action.onPress}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: action.bgColor }]}>
                            <Ionicons name={action.icon} size={22} color={action.iconColor} />
                        </View>

                        {/* Show number if exists */}
                        {action.number !== undefined && (
                            <Text style={styles.statNumber}>{action.number}</Text>
                        )}

                        {/* Label */}
                        <Text style={action.number !== undefined ? styles.statLabel : styles.label}>
                            {action.label}
                        </Text>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingVertical: 20,
        borderRadius: THEME.borderRadius.lg,
        marginHorizontal: 4,
        elevation: 1,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.dark.text,
        textAlign: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 2,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
        textAlign: 'center',
    },
});
