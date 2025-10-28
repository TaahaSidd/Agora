import React, { useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../utils/colors";

const ExpandableText = ({ text, numberOfLines = 3, style }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text) return null;

    const toggleExpanded = () => setIsExpanded(!isExpanded);

    return (
        <>
            <Text style={[styles.text, style]} numberOfLines={isExpanded ? undefined : numberOfLines}>
                {text}
            </Text>
            {text.length > 120 && (
                <TouchableOpacity onPress={toggleExpanded}>
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
        fontSize: 14,
        color: "#4B5563",
        lineHeight: 20,
    },
    toggleText: {
        marginTop: 6,
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: "600",
    },
});

export default ExpandableText;
