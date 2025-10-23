import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        color: '#111827',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderRadius: 16,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
        color: '#374151',
        textAlign: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 2,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        textAlign: 'center',
    },
});
