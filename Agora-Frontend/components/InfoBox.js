import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const TYPE_MAP = {
    info:    {bg: `${COLORS.primary}10`,  border: `${COLORS.primary}20`,  color: COLORS.primary},
    warning: {bg: `${COLORS.warning}10`,  border: `${COLORS.warning}20`,  color: COLORS.warning},
    error:   {bg: `${COLORS.error}10`,    border: `${COLORS.error}20`,    color: COLORS.error},
    success: {bg: `${COLORS.success}10`,  border: `${COLORS.success}20`,  color: COLORS.success},
};

export default function InfoBox({text, icon = 'information-circle', type = 'info'}) {
    const {bg, border, color} = TYPE_MAP[type] || TYPE_MAP.info;

    return (
        <View style={[styles.container, {backgroundColor: bg, borderColor: border}]}>
            <Ionicons name={icon} size={16} color={color}/>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 16,
    },
    text: {
        flex: 1,
        fontSize: 12,
        color: COLORS.gray400,
        lineHeight: 18,
        fontWeight: '400',
    },
});