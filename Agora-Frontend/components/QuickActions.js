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
            <View style={styles.actionsContainer}>
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
                            <Ionicons name={action.icon} size={20} color="#fff"/>
                        </LinearGradient>

                        <View style={styles.textContainer}>
                            {action.number !== undefined && (
                                <Text style={styles.statNumber}>{action.number}</Text>
                            )}
                            <Text style={styles.label} numberOfLines={1}>{action.label}</Text>
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
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        gap: 10,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        letterSpacing: -0.1,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
        letterSpacing: -0.5,
        marginBottom: 2,
    },
});