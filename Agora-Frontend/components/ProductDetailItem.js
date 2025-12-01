import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";

const ProductDetailItem = ({ label, value, type }) => {
    const isAvailability = type === "availability";

    const statusMap = {
        AVAILABLE: { text: "Available", color: COLORS.success },
        SOLD: { text: "Sold", color: COLORS.error },
        DEACTIVATED: { text: "Deactivated", color: COLORS.gray400 },
        RESERVED: { text: "Reserved", color: COLORS.warning },
        RENTED: { text: "Rented", color: COLORS.info },
        EXCHANGED: { text: "Exchanged", color: COLORS.category.books },
    };

    const status = statusMap[value] || { text: value || "Unknown", color: COLORS.gray500 };

    return (
        <View style={[styles.detailRow, isAvailability && { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>{label}</Text>
            {isAvailability ? (
                <View style={styles.availableBadge}>
                    <View style={[styles.availableDot, { backgroundColor: status.color }]} />
                    <Text style={[styles.availableText, { color: status.color }]}>
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
        paddingVertical: THEME.spacing.itemGap,
        borderBottomWidth: THEME.borderWidth.hairline,
        borderBottomColor: COLORS.dark.border,
    },
    detailLabel: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },
    detailValue: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.text,
        fontWeight: THEME.fontWeight.semibold,
    },
    availableBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.dark.cardElevated,
        paddingHorizontal: THEME.spacing[2] + 2,
        paddingVertical: THEME.spacing[1] + 2,
        borderRadius: THEME.borderRadius.pill,
    },
    availableDot: {
        width: 8,
        height: 8,
        borderRadius: THEME.borderRadius.full,
        marginRight: THEME.spacing[1] + 2,
    },
    availableText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
    },
});

export default ProductDetailItem;