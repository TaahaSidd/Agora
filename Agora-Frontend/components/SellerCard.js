import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';

import { useAddSellerReview } from "../hooks/useAddSellerReview";
import { useAverageRating } from "../hooks/useAverageRating";

import { COLORS } from "../utils/colors";

import InputModal from "../components/InputModal";
import ToastMessage from "../components/ToastMessage";

const SellerCard = ({ seller, sellerSince, onPress, currentUser, setReviews }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const { addSellerReview, loading } = useAddSellerReview();
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const { rating } = useAverageRating('seller', seller.id);
    const canRate = currentUser?.id !== seller?.id;

    let sellerAvatar = seller?.profileImage || require("../assets/804948.png");
    if (typeof sellerAvatar === "string" && sellerAvatar.includes("localhost")) {
        sellerAvatar = sellerAvatar.replace("localhost", "192.168.8.15");
    }

    const showToast = ({ type, title, message }) => setToast({ visible: true, type, title, message });

    const handleReviewSubmit = async (comment, rating) => {
        try {
            await addSellerReview(seller.id, { rating, comment });
            showToast({ type: 'success', title: 'Success', message: 'Review submitted!' });
            setModalVisible(false);

            if (setReviews) {
                setReviews(prev => [
                    ...prev,
                    { id: Date.now(), user: currentUser, rating, comment, createdAt: new Date().toISOString() }
                ]);
            }
        } catch (err) {
            showToast({ type: 'error', title: 'Error', message: 'Failed to submit review.' });
        }
    };

    return (
        <View style={styles.container}>
            {/* Main Seller Card */}
            <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
                <View style={styles.left}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={typeof sellerAvatar === "string" ? { uri: sellerAvatar } : sellerAvatar}
                            style={styles.avatar}
                        />
                        {seller?.isVerified && (
                            <View style={styles.verifiedBadge}>
                                <Icon name="checkmark" size={10} color="#fff" />
                            </View>
                        )}
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.name}>{seller.firstName} {seller.lastName}</Text>
                        <View style={styles.meta}>
                            <View style={styles.rating}>
                                <Icon name="star" size={14} color="#FCD34D" />
                                <Text style={styles.ratingText}>
                                    {loading ? '...' : rating?.toFixed(1) || '0'}
                                </Text>                            </View>
                            <Text style={styles.since}>• Member since {sellerSince}</Text>
                        </View>
                    </View>
                </View>
                <Icon name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Review Button */}
            {canRate && (
                <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.7}
                >
                    <View style={styles.reviewContent}>
                        <Text style={styles.reviewText}>Rate this seller</Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Review Modal */}
            <InputModal
                visible={modalVisible}
                type="review"
                enableRating
                onPrimaryPress={handleReviewSubmit}
                onSecondaryPress={() => setModalVisible(false)}
                onClose={() => setModalVisible(false)}
            />

            {toast.visible && <ToastMessage {...toast} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: 26,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
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
        borderColor: COLORS.dark.card, // keep border consistent in dark mode
        backgroundColor: COLORS.dark.cardElevated,
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
        borderColor: COLORS.dark.card,
    },
    info: {
        marginLeft: 14,
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: "700",
        color: COLORS.dark.text,
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
        color: COLORS.dark.text,
        marginLeft: 4,
    },
    since: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        marginLeft: 4,
        fontWeight: '500',
    },
    reviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingTop: 12,
    },
    reviewContent: {
        flex: 1,
        alignItems: 'center',
    },
    reviewText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
});

export default SellerCard;