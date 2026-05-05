import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useAverageRating} from '../hooks/useAverageRating';
import {COLORS} from '../utils/colors';

const getRatingStyle = (rating) => {
    if (rating >= 4.5) return {color: COLORS.success, bg: `${COLORS.success}12`};
    if (rating >= 3.5) return {color: COLORS.info,    bg: `${COLORS.info}12`};
    if (rating >= 2.5) return {color: COLORS.warning, bg: `${COLORS.warning}12`};
    return                    {color: COLORS.error,   bg: `${COLORS.error}12`};
};

const SellerCard = ({seller, onPress}) => {
    const {rating, loading} = useAverageRating('seller', seller.id);
    const ratingValue = rating || 0;
    const {color, bg} = getRatingStyle(ratingValue);
    const avatar = seller?.profileImage || require('../assets/defaultProfile.png');

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <Image
                    source={typeof avatar === 'string' ? {uri: avatar} : avatar}
                    style={styles.avatar}
                />
                {seller?.isVerified && (
                    <View style={styles.verifiedDot}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.success}/>
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {seller.firstName} {seller.lastName}
                </Text>

                <View style={styles.badgeRow}>
                    <View style={styles.sellerBadge}>
                        <Ionicons name="storefront-outline" size={10} color={COLORS.primary}/>
                        <Text style={styles.sellerBadgeText}>Campus Seller</Text>
                    </View>

                    <View style={[styles.ratingBadge, {backgroundColor: bg}]}>
                        <Ionicons name="star" size={10} color={color}/>
                        <Text style={[styles.ratingText, {color}]}>
                            {loading ? '–' : ratingValue.toFixed(1)}
                        </Text>
                    </View>
                </View>
            </View>

            <Ionicons name="chevron-forward" size={14} color={COLORS.gray300}/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        gap: 12,
    },

    // Avatar
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: COLORS.gray100,
    },
    verifiedDot: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: COLORS.white,
        borderRadius: 10,
    },

    // Info
    info: {
        flex: 1,
        gap: 5,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.3,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    // Seller badge
    sellerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: `${COLORS.primary}12`,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
    },
    sellerBadgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.primary,
    },

    // Rating badge
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 10,
        fontWeight: '600',
    },
});

export default SellerCard;