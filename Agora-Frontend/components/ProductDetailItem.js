import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../utils/colors';

const STATUS_MAP = {
    AVAILABLE: { text: 'Available', color: COLORS.success },
    SOLD: { text: 'Sold', color: COLORS.error },
    DEACTIVATED: { text: 'Deactivated', color: COLORS.gray400 },
    RESERVED: { text: 'Reserved', color: COLORS.warning },
    RENTED: { text: 'Rented', color: COLORS.info },
    EXCHANGED: { text: 'Exchanged', color: COLORS.primary },
};

const ProductDetailItem = ({ label, value, type }) => {
    const isAvailability = type === 'availability';
    const status = STATUS_MAP[value] || { text: value || 'Unknown', color: COLORS.gray400 };

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            {isAvailability ? (
                <View style={[styles.badge, { backgroundColor: `${status.color}12` }]}>
                    <View style={[styles.dot, { backgroundColor: status.color }]} />
                    <Text style={[styles.badgeText, { color: status.color }]}>{status.text}</Text>
                </View>
            ) : (
                <Text style={styles.value}>{value}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    label: {
        fontSize: 13,
        color: COLORS.gray400,
        fontWeight: '500',
    },
    value: {
        fontSize: 13,
        color: COLORS.light.text,
        fontWeight: '600',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 5,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 3,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
});

export default ProductDetailItem;