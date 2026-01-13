import React from 'react';
import {Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const ReputationModal = ({visible, onClose, rating, onRatePress}) => {
    const getVibe = (score, reviewCount = 0) => {

        if (reviewCount === 0 || score === 0) return {
            title: "Rising Seller",
            msg: "New to Agora! Be among the first to trade and leave a review.",
            icon: "leaf-outline",
            color: COLORS.info
        };
        if (score >= 4.5) return {
            title: "Campus Elite",
            msg: "Highly trusted. This seller has a consistent track record of great trades.",
            icon: "shield-checkmark",
            color: COLORS.success
        };

        if (score >= 3.5) return {
            title: "Verified Reliable",
            msg: "A solid choice. Most students are happy with their transactions.",
            icon: "checkmark-circle-outline",
            color: COLORS.info
        };
        if (score >= 2.5) return {
            title: "Casual Seller",
            msg: "Active on campus. Remember to check item photos and descriptions.",
            icon: "person-outline",
            color: COLORS.dark.textSecondary
        };

        return {
            title: "Trade with Care",
            msg: "Lower rating detected. Always meet in busy public spots like the Library or Canteen.",
            icon: "alert-circle-outline",
            color: COLORS.warning
        };
    };

    const vibe = getVibe(rating || 0);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.content}>
                    <View style={styles.handle}/>

                    <View style={[styles.iconCircle, {backgroundColor: vibe.color + '20'}]}>
                        <Ionicons name={vibe.icon} size={40} color={vibe.color}/>
                    </View>

                    <Text style={[styles.title, {color: vibe.color}]}>{vibe.title}</Text>
                    <Text style={styles.message}>{vibe.msg}</Text>

                    <TouchableOpacity style={styles.cta} onPress={onRatePress}>
                        <Text style={styles.ctaText}>Rate this Seller</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.primary}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                        <Text style={styles.closeBtnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end'},
    content: {
        backgroundColor: COLORS.dark.card,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, alignItems: 'center',
        paddingBottom: Platform.OS === 'ios' ? 40 : 24
    },
    handle: {width: 40, height: 4, backgroundColor: COLORS.dark.divider, borderRadius: 2, marginBottom: 20},
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    title: {fontSize: 22, fontWeight: '900', marginBottom: 8},
    message: {fontSize: 14, color: COLORS.dark.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24},
    cta: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.cardElevated,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        gap: 8
    },
    ctaText: {color: COLORS.primary, fontWeight: '800'},
    closeBtn: {marginTop: 20},
    closeBtnText: {color: COLORS.dark.textTertiary, fontWeight: '600'}
});

export default ReputationModal;