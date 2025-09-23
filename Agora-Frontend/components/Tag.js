import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const Tag = ({ label, onPress }) => {
    return (
        <TouchableOpacity style={styles.tag} onPress={onPress}>
            <Text style={styles.tagText}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        backgroundColor: "#e0f0ff",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 12,
    },
    tagText: {
        color: "#008CFE",
        fontWeight: "600",
    },
});

export default Tag;
