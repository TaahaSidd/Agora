import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";

const ExpandableText = ({ text, numberOfLines = 3, style }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <>
            <Text
                style={[styles.text, style]}
                numberOfLines={isExpanded ? undefined : numberOfLines}
            >
                {text}
            </Text>
            {text.length > 120 && (
                <TouchableOpacity onPress={toggleExpanded} activeOpacity={THEME.opacity.hover}>
                    <Text style={styles.toggleText}>
                        {isExpanded ? "Show Less" : "Show More"}
                    </Text>
                </TouchableOpacity>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
        fontWeight: THEME.fontWeight.medium,
    },
    toggleText: {
        marginTop: THEME.spacing[1] + 2,
        fontSize: THEME.fontSize.sm,
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.semibold,
    },
});

export default ExpandableText;