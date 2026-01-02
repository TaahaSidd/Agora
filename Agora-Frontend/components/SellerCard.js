import React from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useAverageRating} from "../hooks/useAverageRating";
import {COLORS} from "../utils/colors";
import {THEME} from "../utils/theme";

const SellerCard = ({seller, sellerSince, onPress}) => {
    const {rating, loading} = useAverageRating('seller', seller.id);

    let sellerAvatar = seller?.profileImage || require("../assets/804948.png");
    if (typeof sellerAvatar === "string" && sellerAvatar.includes("localhost")) {
        sellerAvatar = sellerAvatar.replace("localhost", "192.168.8.15");
    }

    // Dynamic rating badge colors
    const getRatingStyle = (rating) => {
        if (rating >= 4.5) {
            return {
                bg: COLORS.successBgDark,
                text: COLORS.success,
                border: COLORS.success + '30',
            };
        } else if (rating >= 3.5) {
            return {
                bg: COLORS.infoBgDark,
                text: COLORS.info,
                border: COLORS.info + '30',
            };
        } else if (rating >= 2.5) {
            return {
                bg: COLORS.warningBgDark,
                text: COLORS.warning,
                border: COLORS.warning + '30',
            };
        } else {
            return {
                bg: COLORS.errorBgDark,
                text: COLORS.error,
                border: COLORS.error + '30',
            };
        }
    };

    const ratingValue = rating || 0;
    const ratingStyle = getRatingStyle(ratingValue);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
                <Image
                    source={typeof sellerAvatar === "string" ? {uri: sellerAvatar} : sellerAvatar}
                    style={styles.avatar}
                />
                {seller?.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Icon name="checkmark-circle" size={20} color={COLORS.success}/>
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.info}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>
                        {seller.firstName} {seller.lastName}
                    </Text>

                    {/* Rating Badge */}
                    <View style={[
                        styles.ratingBadge,
                        {
                            backgroundColor: ratingStyle.bg,
                            borderColor: ratingStyle.border,
                        }
                    ]}>
                        <Icon name="star" size={12} color={ratingStyle.text}/>
                        <Text style={[styles.ratingText, {color: ratingStyle.text}]}>
                            {loading ? '...' : ratingValue.toFixed(1)}
                        </Text>
                    </View>
                </View>

                {/* Member Since */}
                <View style={styles.sinceRow}>
                    <Icon name="calendar-outline" size={14} color={COLORS.dark.textTertiary}/>
                    <Text style={styles.sinceText}>Member since {sellerSince}</Text>
                </View>
            </View>

            {/* Arrow */}
            <Icon name="chevron-forward" size={20} color={COLORS.dark.textTertiary}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    avatarContainer: {
        position: "relative",
        marginRight: THEME.spacing[3],
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: 2,
        borderColor: COLORS.dark.border,
    },
    verifiedBadge: {
        position: "absolute",
        bottom: -2,
        right: -2,
        backgroundColor: COLORS.dark.card,
        borderRadius: 12,
    },
    info: {
        flex: 1,
    },
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: THEME.spacing[2],
    },
    name: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginRight: THEME.spacing[2],
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: THEME.spacing[2],
        paddingVertical: THEME.spacing[1],
        borderRadius: THEME.borderRadius.pill,
        borderWidth: 1,
        gap: 4,
    },
    ratingText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.bold,
    },
    sinceRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    sinceText: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
        marginLeft: THEME.spacing[1],
    },
});

export default SellerCard;