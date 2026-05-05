import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const getVibe = (score) => {
    if (!score || score === 0) return {
        title: 'Rising Seller',
        msg: 'New to Agora! Be among the first to trade and leave a review.',
        icon: 'leaf-outline',
        color: COLORS.info,
    };
    if (score >= 4.5) return {
        title: 'Campus Elite',
        msg: 'Highly trusted. This seller has a consistent track record of great trades.',
        icon: 'shield-checkmark',
        color: COLORS.success,
    };
    if (score >= 3.5) return {
        title: 'Verified Reliable',
        msg: 'A solid choice. Most students are happy with their transactions.',
        icon: 'checkmark-circle-outline',
        color: COLORS.info,
    };
    if (score >= 2.5) return {
        title: 'Casual Seller',
        msg: 'Active on campus. Remember to check item photos and descriptions.',
        icon: 'person-outline',
        color: COLORS.gray400,
    };
    return {
        title: 'Trade with Care',
        msg: 'Lower rating detected. Always meet in busy public spots like the Library or Canteen.',
        icon: 'alert-circle-outline',
        color: COLORS.warning,
    };
};

const ReputationModal = ({visible, onClose, rating, onRatePress, isOwnProfile, isGuest, onAuthPress}) => {
    const insets = useSafeAreaInsets();
    const vibe = getVibe(rating || 0);

    const handleAction = () => {
        onClose();
        if (isGuest) onAuthPress?.();
        else onRatePress?.();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 24)}]}>
                    {/* Handle */}
                    <View style={styles.handle}/>

                    {/* Icon */}
                    <View style={[styles.iconWrapper, {backgroundColor: `${vibe.color}12`}]}>
                        <Ionicons name={vibe.icon} size={28} color={vibe.color}/>
                    </View>

                    {/* Text */}
                    <Text style={[styles.title, {color: vibe.color}]}>
                        {isGuest ? 'Join the Community' : vibe.title}
                    </Text>
                    <Text style={styles.message}>
                        {isGuest
                            ? 'Sign up to leave ratings and share your trading experience with other students!'
                            : isOwnProfile
                                ? 'This is how other students see your trading reputation on campus.'
                                : vibe.msg}
                    </Text>

                    {/* CTA */}
                    {!isOwnProfile && (
                        <TouchableOpacity
                            style={[styles.cta, isGuest && {backgroundColor: COLORS.primary, borderColor: COLORS.primary}]}
                            onPress={handleAction}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.ctaText, isGuest && {color: COLORS.white}]}>
                                {isGuest ? 'Login to Rate' : 'Rate this Seller'}
                            </Text>
                            <Ionicons
                                name={isGuest ? 'log-in-outline' : 'chevron-forward'}
                                size={14}
                                color={isGuest ? COLORS.white : COLORS.primary}
                            />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={onClose} activeOpacity={0.6} style={styles.closeBtn}>
                        <Text style={styles.closeBtnText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        alignItems: 'center',
    },

    // Handle
    handle: {
        width: 36,
        height: 4,
        backgroundColor: COLORS.gray200,
        borderRadius: 2,
        marginBottom: 20,
    },

    // Icon
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },

    // Text
    title: {
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: -0.3,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 13,
        color: COLORS.gray400,
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 20,
        paddingHorizontal: 8,
    },

    // CTA
    cta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 11,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        marginBottom: 4,
        width: '100%',
        justifyContent: 'center',
    },
    ctaText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },

    // Close
    closeBtn: {
        marginTop: 12,
        paddingVertical: 6,
    },
    closeBtnText: {
        fontSize: 13,
        color: COLORS.gray400,
        fontWeight: '500',
    },
});

export default ReputationModal;