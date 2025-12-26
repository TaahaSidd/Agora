import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {THEME} from '../utils/theme';
import {COLORS} from '../utils/colors';

export default function QuickActions({title, actions}) {
    return (
        <View style={styles.section}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            <View style={styles.row}>
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.actionButton}
                        activeOpacity={0.8}
                        onPress={action.onPress}
                    >
                        <LinearGradient
                            colors={action.gradient || [action.bgColor, action.bgColor]}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={styles.iconCircle}
                        >
                            <Ionicons name={action.icon} size={24} color="#fff"/>
                        </LinearGradient>

                        {action.number !== undefined && (
                            <Text style={styles.statNumber}>{action.number}</Text>
                        )}

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
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingVertical: 18,
        paddingHorizontal: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.dark.text,
        textAlign: 'center',
        letterSpacing: -0.2,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 2,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: -0.1,
    },
});