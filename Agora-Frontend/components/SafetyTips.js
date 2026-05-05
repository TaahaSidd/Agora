import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const TIPS = [
    'Meet at a busy campus spot (Canteen/Library)',
    'Check item thoroughly before any payment',
    'No advance payments — pay only at pickup',
    'Keep all chats on Agora for your safety',
];

const SafetyTips = ({style}) => (
    <View style={[styles.container, style]}>
        <View style={styles.header}>
            <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.success}/>
            <Text style={styles.title}>Safety Tips</Text>
        </View>
        <View style={styles.tips}>
            {TIPS.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                    <View style={styles.dot}/>
                    <Text style={styles.tipText}>{tip}</Text>
                </View>
            ))}
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.light.text,
    },
    tips: {gap: 12},
    tipRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.success,
        marginTop: 6,
    },
    tipText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
        fontWeight: '400',
    },
});

export default SafetyTips;