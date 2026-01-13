import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

export default function InfoBox({text, icon = "information-circle", type = "info"}) {

    const getTypeStyles = () => {
        switch (type) {
            case 'warning':
                return {
                    bg: COLORS.warning + '10',
                    border: COLORS.warning + '20',
                    iconColor: COLORS.warning,
                };
            case 'error':
                return {
                    bg: COLORS.error + '10',
                    border: COLORS.error + '20',
                    iconColor: COLORS.error,
                };
            case 'success':
                return {
                    bg: COLORS.success + '10',
                    border: COLORS.success + '20',
                    iconColor: COLORS.success,
                };
            case 'info':
            default:
                return {
                    bg: COLORS.primary + '10',
                    border: COLORS.primary + '20',
                    iconColor: COLORS.primary,
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <View style={[styles.infoBox, {backgroundColor: typeStyles.bg, borderColor: typeStyles.border}]}>
            <Ionicons name={icon} size={20} color={typeStyles.iconColor}/>
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    infoBox: {
        flexDirection: 'row',
        padding: THEME.spacing.sm + 2,
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing.md,
        gap: THEME.spacing[2],
        borderWidth: 1,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        lineHeight: THEME.fontSize.sm * 1.4,
        fontWeight: THEME.fontWeight.medium,
    },
});