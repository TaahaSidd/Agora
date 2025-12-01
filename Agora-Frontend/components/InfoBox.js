import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../utils/colors';

export default function InfoBox({ text, icon = "information-circle" }) {
    return (
        <View style={styles.infoBox}>
            <Ionicons name={icon} size={20} color={COLORS.primary} />
            <Text style={styles.infoText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    infoBox: {
        flexDirection: 'row',
        backgroundColor: COLORS.transparentWhite10,
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.dark.divider,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        marginLeft: 10,
        lineHeight: 18,
        fontWeight: '500',
    },
});
