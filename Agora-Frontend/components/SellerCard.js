import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "../utils/colors";

const SellerCard = ({ seller, sellerSince, onPress }) => {
    let sellerAvatar = seller?.avatar;
    if (sellerAvatar?.includes("localhost")) {
        sellerAvatar = sellerAvatar.replace("localhost", "192.168.8.15");
    }

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.left}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={sellerAvatar ? { uri: sellerAvatar } : require("../assets/804948.png")}
                        style={styles.avatar}
                        cachePolicy="disk"
                    />
                    {seller?.isVerified && (
                        <View style={styles.verifiedBadge}>
                            <Icon name="checkmark" size={10} color="#fff" />
                        </View>
                    )}
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>
                        {seller.firstName} {seller.lastName}
                    </Text>
                    <View style={styles.meta}>
                        <View style={styles.rating}>
                            <Icon name="star" size={14} color="#FCD34D" />
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                        <Text style={styles.since}>• Member since {sellerSince}</Text>
                    </View>
                </View>
            </View>
            <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatarContainer: {
        position: "relative",
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 3,
        borderColor: "#F3F4F6",
    },
    verifiedBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    info: {
        marginLeft: 14,
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    meta: {
        flexDirection: "row",
        alignItems: "center",
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginLeft: 4,
    },
    since: {
        fontSize: 13,
        color: "#9CA3AF",
        marginLeft: 4,
    },
});

export default SellerCard;
