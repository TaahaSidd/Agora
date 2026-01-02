import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";

const ExpandableText = ({ text, numberOfLines = 3, style }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);

    if (!text) return null;

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <View style={styles.container}>
            <Text
                style={[styles.text, style]}
                numberOfLines={isExpanded ? 0 : numberOfLines}
                onTextLayout={(e) => {
                    // Check if text is truncated
                    if (e.nativeEvent.lines.length >= numberOfLines) {
                        setShouldShowButton(true);
                    }
                }}
            >
                {text}
            </Text>

            {shouldShowButton && (
                <TouchableOpacity
                    onPress={toggleExpanded}
                    activeOpacity={0.7}
                    style={styles.toggleButton}
                >
                    <Text style={styles.toggleText}>
                        {isExpanded ? "Show Less" : "Read More"}
                    </Text>
                    <Icon
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // No background, no border - minimal!
    },
    text: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
        fontWeight: THEME.fontWeight.medium,
    },
    toggleButton: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        marginTop: THEME.spacing[2],
        paddingVertical: THEME.spacing[1],
    },
    toggleText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.bold,
        marginRight: THEME.spacing[1],
    },
});

export default ExpandableText;