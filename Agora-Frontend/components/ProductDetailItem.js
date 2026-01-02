import React from "react";
import {View, Text, StyleSheet} from "react-native";

import {COLORS} from "../utils/colors";
import {THEME} from "../utils/theme";

const ProductDetailItem = ({label, value, type}) => {
    const isAvailability = type === "availability";

    const statusMap = {
        AVAILABLE: {text: "Available", color: COLORS.success},
        SOLD: {text: "Sold", color: COLORS.error},
        DEACTIVATED: {text: "Deactivated", color: COLORS.gray400},
        RESERVED: {text: "Reserved", color: COLORS.warning},
        RENTED: {text: "Rented", color: COLORS.info},
        EXCHANGED: {text: "Exchanged", color: COLORS.category.books},
    };

    const status = statusMap[value] || {text: value || "Unknown", color: COLORS.gray500};

    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            {isAvailability ? (
                <View style={[
                    styles.availabilityBadge,
                    {
                        backgroundColor: status.color + '15',
                        borderColor: status.color + '30',
                    }
                ]}>
                    <View style={[styles.statusDot, {backgroundColor: status.color}]}/>
                    <Text style={[styles.availabilityText, {color: status.color}]}>
                        {status.text}
                    </Text>
                </View>
            ) : (
                <Text style={styles.detailValue}>{value}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: THEME.spacing[1],
    },
    detailLabel: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
    },
    detailValue: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.text,
        fontWeight: THEME.fontWeight.semibold,
    },
    availabilityBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: THEME.spacing[3],
        paddingVertical: THEME.spacing[2],
        borderRadius: THEME.borderRadius.pill,
        borderWidth: 1,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: THEME.spacing[2],
    },
    availabilityText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.bold,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});

export default ProductDetailItem;