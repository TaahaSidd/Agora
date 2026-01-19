import React from "react";
import {StyleSheet, Text, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {COLORS} from "../utils/colors";
import {THEME} from "../utils/theme";

const SafetyTips = ({style}) => {
    const tips = [
        "Meet at a busy campus spot (Canteen/Library)",
        "Check item thoroughly before any payment",
        "No advance payments — pay only at pickup",
        "Keep all chats on Agora for your safety",
    ];

    return (
        <View style={[styles.container, style]}>
            {/* Simple Header */}
            <View style={styles.header}>
                <Icon name="shield-checkmark-outline" size={20} color="#10B981"/>
                <Text style={styles.title}>Safety Tips</Text>
            </View>

            {/* Clean List */}
            <View style={styles.tips}>
                {tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                        <View style={styles.dot}/>
                        <Text style={styles.tipText}>{tip}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.dark.bgElevated,
        borderRadius: THEME.borderRadius.lg,
        padding: 20,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        marginBottom:50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.white,
        marginLeft: 12,
    },
    tips: {
        gap: 12,
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
        marginTop: 6,
        marginRight: 12,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 20,
        fontWeight: '500',
    },
});

export default SafetyTips;
