import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {COLORS} from "../utils/colors";
import {THEME} from "../utils/theme";

const TAG_STYLES = {
    condition: {
        New: {
            bg: COLORS.success + '15', // Light Green Tint
            text: COLORS.success,
            border: COLORS.success + '30',
        },
        'Like New': {
            bg: COLORS.success + '15',
            text: COLORS.success,
            border: COLORS.success + '30',
        },
        Used: {
            bg: COLORS.info + '15', // Light Blue Tint
            text: COLORS.info,
            border: COLORS.info + '30',
        },
        'Well Used': {
            bg: COLORS.warning + '15', // Light Orange Tint
            text: COLORS.warning,
            border: COLORS.warning + '30',
        },
        Bad: {
            bg: COLORS.error + '15', // Light Red Tint
            text: COLORS.error,
            border: COLORS.error + '30',
        },
        Default: {
            bg: COLORS.light.bg,
            text: COLORS.light.textSecondary,
            border: COLORS.light.border,
        },
    },

    category: {
        bg: COLORS.white,
        text: COLORS.light.text,
        border: COLORS.light.border,
        activeBg: COLORS.primary + '15',
        activeText: COLORS.primary,
        activeBorder: COLORS.primary + '40',
    },

    info: {
        bg: COLORS.light.bg,
        text: COLORS.light.textTertiary,
        border: COLORS.light.border,
    },

    verified: {
        bg: COLORS.success + '15',
        text: COLORS.success,
        border: COLORS.success + '30',
    },

    location: {
        bg: COLORS.light.bg,
        text: COLORS.light.textSecondary,
        border: COLORS.light.border,
    },

    college: {
        bg: COLORS.primary + '10',
        text: COLORS.primary,
        border: COLORS.primary + '25',
    },

    time: {
        bg: COLORS.light.bg,
        text: COLORS.light.textTertiary,
        border: COLORS.light.border,
    },
};

const Tag = ({
                 label,
                 type = "category",
                 icon,
                 onPress,
                 active = false, // for category tags
                 variant = "default" // "default", "outlined", "filled"
             }) => {
    // Get style based on type
    let tagStyle = TAG_STYLES.info; // default fallback

    if (type === "condition") {
        tagStyle = TAG_STYLES.condition[label] || TAG_STYLES.condition.Default;
    } else if (type === "category") {
        tagStyle = active
            ? {
                bg: TAG_STYLES.category.activeBg,
                text: TAG_STYLES.category.activeText,
                border: TAG_STYLES.category.activeBorder,
            }
            : TAG_STYLES.category;
    } else if (TAG_STYLES[type]) {
        tagStyle = TAG_STYLES[type];
    }

    // Determine if tag is interactive
    const isInteractive = !!onPress;

    // Choose icon component
    let IconComponent = null;
    if (icon) {
        if (icon.library === "Ionicons") IconComponent = Ionicons;
        else if (icon.library === "MaterialCommunityIcons") IconComponent = MaterialCommunityIcons;
    }

    // Different sizes based on type
    const isCategory = type === "category";
    const isCondition = type === "condition";

    return (
        <TouchableOpacity
            style={[
                styles.tag,
                {
                    backgroundColor: tagStyle.bg,
                    borderColor: tagStyle.border,
                    borderWidth: variant === "outlined" ? THEME.borderWidth.thin : 0,
                },
                isCategory && styles.categoryTag,
                isCondition && styles.conditionTag,
                isInteractive && styles.interactiveTag,
                active && styles.activeTag,
            ]}
            onPress={onPress}
            activeOpacity={isInteractive ? 0.6 : 1}
            disabled={!isInteractive}
        >
            {IconComponent && (
                <IconComponent
                    name={icon.name}
                    size={isCategory ? 16 : 14}
                    color={icon.color || tagStyle.text}
                    style={styles.icon}
                />
            )}
            <Text
                style={[
                    styles.text,
                    {color: tagStyle.text},
                    isCategory && styles.categoryText,
                    isCondition && styles.conditionText,
                ]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: THEME.spacing[3],
        paddingVertical: THEME.spacing[2],
        borderRadius: THEME.borderRadius.pill,
        marginRight: THEME.spacing[2],
        marginBottom: THEME.spacing[2],
        alignSelf: "flex-start",
        maxWidth: 200,
        // Ensure outlined variant looks good on light
        borderWidth: 1,
    },
    categoryTag: {
        paddingHorizontal: THEME.spacing[4],
        paddingVertical: THEME.spacing[2] + 2,
        borderRadius: THEME.borderRadius.lg,
    },
    conditionTag: {
        paddingHorizontal: THEME.spacing[3],
        paddingVertical: THEME.spacing[1] + 2,
    },
    interactiveTag: {
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    activeTag: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        marginRight: THEME.spacing[1] + 2,
    },
    text: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        flexShrink: 1,
        letterSpacing: THEME.letterSpacing.tight,
    },
    categoryText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.semibold,
    },
    conditionText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

export default Tag;