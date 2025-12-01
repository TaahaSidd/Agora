import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../utils/colors";

const SafetyTips = () => {
    return (
        <View style={styles.safetySection}>
            <View style={styles.safetyHeader}>
                <Icon name="shield-outline" size={20} color={COLORS.warning} />
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
        backgroundColor: COLORS.warningBgDark, // Dark mode background
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.warningDark, // Darker border for contrast
    },
    safetyHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    safetyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.warningBg, // Primary text color for dark mode
        marginLeft: 8,
    },
    safetyText: {
        fontSize: 13,
        color: COLORS.warningLight, // Readable text on dark bg
        lineHeight: 20,
    },
});

export default SafetyTips;
