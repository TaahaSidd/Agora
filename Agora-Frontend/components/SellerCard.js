import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAverageRating } from "../hooks/useAverageRating";
import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";
import { LinearGradient } from "expo-linear-gradient";

const SellerCard = ({ seller, onPress }) => {
    const { rating, loading } = useAverageRating('seller', seller.id);

    // Updated Rating Styles for Light Mode
    const getRatingStyle = (rating) => {
        if (rating >= 4.5) {
            return {
                bg: COLORS.success + '15', // Light green tint
                text: COLORS.success,
                border: COLORS.success + '30',
            };
        } else if (rating >= 3.5) {
            return {
                bg: COLORS.info + '15', // Light blue tint
                text: COLORS.info,
                border: COLORS.info + '30',
            };
        } else if (rating >= 2.5) {
            return {
                bg: COLORS.warning + '15', // Light orange tint
                text: COLORS.warning,
                border: COLORS.warning + '30',
            };
        } else {
            return {
                bg: COLORS.error + '15', // Light red tint
                text: COLORS.error,
                border: COLORS.error + '30',
            };
        }
    };

    const ratingValue = rating || 0;
    const ratingStyle = getRatingStyle(ratingValue);
    const sellerAvatar = seller?.profileImage || require("../assets/defaultProfile.png");

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            {/* Left: Avatar Section */}
            <View style={styles.avatarContainer}>
                <Image
                    source={typeof sellerAvatar === "string" ? { uri: sellerAvatar } : sellerAvatar}
                    style={styles.avatar}
                />
                {seller?.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Icon name="checkmark-circle" size={20} color={COLORS.success} />
                    </View>
                )}
            </View>

            {/* Middle: Info Section */}
            <View style={styles.info}>
                {/* Row 1: Name (Now has full width) */}
                <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>
                        {seller.firstName} {seller.lastName}
                    </Text>
                </View>

                {/* Row 2: Metadata Badges (Grouped together) */}
                <View style={styles.statsRow}>
                    <View style={styles.sellerBadge}>
                        <LinearGradient
                            colors={['#6366F1', '#4F46E5']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.pillGradient}
                        >
                            <Icon name="cart-outline" size={10} color="#fff" />
                            <Text style={styles.pillText}>CAMPUS SELLER</Text>
                        </LinearGradient>
                    </View>

                    <View style={[
                        styles.ratingBadge,
                        {
                            backgroundColor: ratingStyle.bg,
                            borderColor: ratingStyle.border,
                        }
                    ]}>
                        <Icon name="star" size={10} color={ratingStyle.text} />
                        <Text style={[styles.ratingText, { color: ratingStyle.text }]}>
                            {loading ? '...' : ratingValue.toFixed(1)}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Right: Action Icon */}
            <Icon name="chevron-forward" size={20} color={COLORS.light.textTertiary} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    avatarContainer: {
        position: "relative",
        marginRight: THEME.spacing[3],
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.light.bg,
        borderWidth: 2,
        borderColor: COLORS.light.border,
    },
    verifiedBadge: {
        position: "absolute",
        bottom: -2,
        right: -2,
        backgroundColor: COLORS.white,
        borderRadius: 12,
    },
    info: {
        flex: 1,
    },
    nameRow: {
        marginBottom: 6,
    },
    name: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.light.text,
        letterSpacing: -0.4,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sellerBadge: {
        marginRight: 8,
    },
    pillGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    pillText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    ratingBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        gap: 3,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default SellerCard;