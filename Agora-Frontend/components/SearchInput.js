import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";

const SearchInput = ({
    value,
    onChangeText,
    placeholder = "Search...",
    autoFocus = false,
    onClear
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={COLORS.dark.textTertiary} style={styles.icon} />
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLORS.dark.textTertiary}
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                autoFocus={autoFocus}
            />
            {value.length > 0 && (
                <TouchableOpacity
                    onPress={onClear || (() => onChangeText(""))}
                    style={styles.clearButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close-circle" size={20} color={COLORS.dark.textTertiary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.light.bg,
        borderRadius: THEME.borderRadius.full,
        paddingHorizontal: 14,
        height: 44,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.light.text,
        fontWeight: "500",
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
    },
});

export default SearchInput;
