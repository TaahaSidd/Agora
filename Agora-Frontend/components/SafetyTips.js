import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../utils/colors";

const SafetyTips = () => {
    return (
        <View style={styles.safetySection}>
            <View style={styles.safetyHeader}>
                <Icon name="shield-outline" size={20} color={COLORS.primary} />
                <Text style={styles.safetyTitle}>Safety Tips</Text>
            </View>
            <Text style={styles.safetyText}>
                • Meet in a safe, public location{'\n'}
                • Check the item before you buy{'\n'}
                • Pay only after collecting the item
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    safetySection: {
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#FDE68A",
    },
    safetyHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    safetyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#92400E",
        marginLeft: 8,
    },
    safetyText: {
        fontSize: 13,
        color: "#78350F",
        lineHeight: 20,
    },
});

export default SafetyTips;
