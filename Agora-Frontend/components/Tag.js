import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {COLORS} from "../utils/colors";
import {THEME} from "../utils/theme";

const TAG_STYLES = {
    // Condition tags - for product listing
    condition: {
        New: {
            bg: COLORS.successBgDark,
            text: COLORS.success,
            border: COLORS.success + '30',
        },
        'Like New': {
            bg: COLORS.successBgDark,
            text: COLORS.successLight,
            border: COLORS.successLight + '30',
        },
        Used: {
            bg: COLORS.infoBgDark,
            text: COLORS.info,
            border: COLORS.info + '30',
        },
        'Well Used': {
            bg: COLORS.warningBgDark,
            text: COLORS.warning,
            border: COLORS.warning + '30',
        },
        Bad: {
            bg: COLORS.errorBgDark,
            text: COLORS.error,
            border: COLORS.error + '30',
        },
        Default: {
            bg: COLORS.dark.card,
            text: COLORS.dark.textSecondary,
            border: COLORS.dark.border,
        },
    },

    // Category tags - for browse/explore
    category: {
        bg: COLORS.dark.card,
        text: COLORS.dark.text,
        border: COLORS.dark.border,
        activeBg: COLORS.primary + '20',
        activeText: COLORS.primary,
        activeBorder: COLORS.primary + '50',
    },

    // Info tags - posted time, location, etc
    info: {
        bg: COLORS.dark.card,
        text: COLORS.dark.textTertiary,
        border: COLORS.dark.border,
    },

    // Verified badge
    verified: {
        bg: COLORS.successBgDark,
        text: COLORS.success,
        border: COLORS.success + '30',
    },

    // Location tag
    location: {
        bg: COLORS.dark.card,
        text: COLORS.dark.textSecondary,
        border: COLORS.dark.border,
    },

    // College tag
    college: {
        bg: COLORS.primary + '15',
        text: COLORS.primaryLight,
        border: COLORS.primary + '30',
    },

    // Time/posted tag
    time: {
        bg: COLORS.dark.card,
        text: COLORS.dark.textTertiary,
        border: COLORS.dark.border,
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
    },

    // Category tags (larger, more prominent)
    categoryTag: {
        paddingHorizontal: THEME.spacing[4],
        paddingVertical: THEME.spacing[2] + 2,
        borderRadius: THEME.borderRadius.lg,
    },

    // Condition tags (medium size, badge-like)
    conditionTag: {
        paddingHorizontal: THEME.spacing[3],
        paddingVertical: THEME.spacing[1] + 2,
    },

    // Interactive tags have subtle hover effect
    interactiveTag: {
        shadowColor: COLORS.black,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },

    // Active state for category tags
    activeTag: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
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