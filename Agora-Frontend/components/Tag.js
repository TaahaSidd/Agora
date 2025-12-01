// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// // Define colors for different tag types
// const CONDITION_COLORS = {
//     New: { bg: "#DCFCE7", text: "#047857" },
//     Used: { bg: "#DBEAFE", text: "#1E40AF" },
//     Bad: { bg: "#FEE2E2", text: "#B91C1C" },
//     Default: { bg: "#E0F0FF", text: "#1370BC" },
// };

// const QUICK_INFO_COLORS = {
//     verified: { bg: "#F0FDF4", text: "#10B981" },
//     posted: { bg: "#F9FAFB", text: "#6B7280" },
// };

// const Tag = ({ label, type = "category", icon, onPress }) => {
//     let bgColor = "#E0F0FF";
//     let textColor = "#1370BC";

//     // Assign colors based on type
//     if (type === "condition") {
//         const colors = CONDITION_COLORS[label] || CONDITION_COLORS.Default;
//         bgColor = colors.bg;
//         textColor = colors.text;
//     } else if (type === "verified" || type === "time") {
//         const colors = QUICK_INFO_COLORS[type] || { bg: "#F3F4F6", text: "#374151" };
//         bgColor = colors.bg;
//         textColor = colors.text;
//     } else if (type === "location" || type === "college") {
//         bgColor = "#F3F4F6";
//         textColor = "#374151";
//     }

//     // Resolve the icon component
//     let IconComponent = null;
//     if (icon) {
//         if (icon.library === "Ionicons") IconComponent = Ionicons;
//         else if (icon.library === "MaterialCommunityIcons") IconComponent = MaterialCommunityIcons;
//     }

//     return (
//         <TouchableOpacity
//             style={[styles.tag, { backgroundColor: bgColor }]}
//             onPress={onPress}
//             activeOpacity={onPress ? 0.7 : 1}
//         >
//             {IconComponent && <IconComponent name={icon.name} size={14} color={icon.color} style={{ marginRight: 6 }} />}
//             <Text style={[styles.text, { color: textColor }]}>{label}</Text>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     tag: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 20,
//         marginRight: 8,
//         marginBottom: 6,
//         alignSelf: "flex-start",
//         maxWidth: 200,
//     },
//     text: {
//         fontSize: 12,
//         fontWeight: "600",
//         flexShrink: 1,
//         flexWrap: "wrap",

//     },
// });

// export default Tag;



import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CONDITION_COLORS_DARK = {
    New: { bg: "#064E3B", text: "#DCFCE7" },
    Used: { bg: "#1E3A8A", text: "#DBEAFE" },
    Bad: { bg: "#7F1D1D", text: "#FEE2E2" },
    Default: { bg: "#0B3B61", text: "#E0F0FF" },
};

const QUICK_INFO_COLORS_DARK = {
    verified: { bg: "#064E3B", text: "#A7F3D0" },
    posted: { bg: "#1F2937", text: "#D1D5DB" },
};

const Tag = ({ label, type = "category", icon, onPress }) => {
    let bgColor = "#1F2937";
    let textColor = "#D1D5DB";

    if (type === "condition") {
        const colors = CONDITION_COLORS_DARK[label] || CONDITION_COLORS_DARK.Default;
        bgColor = colors.bg;
        textColor = colors.text;
    } else if (type === "verified" || type === "time") {
        const colors = QUICK_INFO_COLORS_DARK[type] || { bg: "#111827", text: "#D1D5DB" };
        bgColor = colors.bg;
        textColor = colors.text;
    } else if (type === "location" || type === "college" || type === "category") {
        bgColor = "#1F2937";
        textColor = "#D1D5DB";
    }

    let IconComponent = null;
    if (icon) {
        if (icon.library === "Ionicons") IconComponent = Ionicons;
        else if (icon.library === "MaterialCommunityIcons") IconComponent = MaterialCommunityIcons;
    }

    return (
        <TouchableOpacity
            style={[styles.tag, { backgroundColor: bgColor }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            {IconComponent && <IconComponent name={icon.name} size={14} color={icon.color} style={{ marginRight: 6 }} />}
            <Text style={[styles.text, { color: textColor }]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 6,
        alignSelf: "flex-start",
        maxWidth: 200,
    },
    text: {
        fontSize: 12,
        fontWeight: "600",
        flexShrink: 1,
        flexWrap: "wrap",
    },
});

export default Tag;
