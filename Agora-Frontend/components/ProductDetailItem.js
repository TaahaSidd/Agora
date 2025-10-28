import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductDetailItem = ({ label, value, type }) => {
    const isAvailability = type === "availability";
    const available = value === "AVAILABLE";

    return (
        <View style={[styles.detailRow, isAvailability && { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>{label}</Text>
            {isAvailability ? (
                <View style={styles.availableBadge}>
                    <View style={[styles.availableDot, { backgroundColor: available ? "#10B981" : "#EF4444" }]} />
                    <Text style={[styles.availableText, { color: available ? "#10B981" : "#EF4444" }]}>
                        {available ? "Available" : "Sold"}
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
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    detailLabel: {
        fontSize: 15,
        color: "#6B7280",
        fontWeight: "500",
    },
    detailValue: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "600",
    },
    availableBadge: {
        flexDirection: "row",
        alignItems: "center",
    },
    availableDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    availableText: {
        fontSize: 14,
        fontWeight: "600",
    },
});

export default ProductDetailItem;
