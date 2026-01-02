import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";

//fix the text and icon mismatch
const SafetyTips = () => {
    const tips = [
        {
            icon: "location",
            text: "Meet in a public place on campus",
        },
        {
            icon: "eye",
            text: "Inspect the item before paying",
        },
        {
            icon: "card",
            text: "Avoid advance payments",
        },
        {
            icon: "chatbubbles",
            text: "Use in-app chat only",
        },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.iconCircle}>
                    <Icon name="shield-checkmark" size={18} color={COLORS.info} />
                </View>
                <Text style={styles.title}>Safety Tips</Text>
            </View>

            {/* Tips List */}
            <View style={styles.tipsList}>
                {tips.map((tip, index) => (
                    <View key={index} style={styles.tipItem}>
                        <View style={styles.tipIconContainer}>
                            <Icon name={tip.icon} size={16} color={COLORS.primary} />
                        </View>
                        <Text style={styles.tipText}>{tip.text}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: THEME.spacing.md,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.info + '15',
        alignItems: "center",
        justifyContent: "center",
        marginRight: THEME.spacing[2],
    },
    title: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
    },
    tipsList: {
        gap: THEME.spacing[1],
    },
    tipItem: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    tipIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary + '15',
        alignItems: "center",
        justifyContent: "center",
        marginRight: THEME.spacing[2],
        marginTop: 2,
    },
    tipText: {
        flex: 1,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },
});

export default SafetyTips;