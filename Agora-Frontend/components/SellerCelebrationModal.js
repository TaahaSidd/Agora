import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import {COLORS} from '../utils/colors';

const SellerCelebrationModal = ({visible, onClose, onNavigate}) => {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.container}>
                        {/* Confetti */}
                        {visible && (
                            <ConfettiCannon
                                count={120}
                                origin={{x: -10, y: 0}}
                                fadeOut
                                fallSpeed={2500}
                            />
                        )}

                        {/* Icon */}
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark" size={28} color={COLORS.primary}/>
                        </View>

                        {/* Title */}
                        <Text style={styles.title}>You're now a Seller</Text>

                        {/* Message */}
                        <Text style={styles.message}>
                            Your first listing is live and ready for buyers.
                        </Text>

                        {/* Divider */}
                        <View style={styles.divider}/>

                        {/* Buttons */}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    onClose();
                                    onNavigate();
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.primaryButtonText}>View Listing</Text>
                            </TouchableOpacity>

                            <View style={styles.buttonDivider}/>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.secondaryButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 300,
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 24,
        marginBottom: 12,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingBottom: 8,
        letterSpacing: -0.3,
    },
    message: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
        lineHeight: 20,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.dark.border,
    },
    buttonsContainer: {
        flexDirection: 'column',
    },
    button: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDivider: {
        height: 1,
        backgroundColor: COLORS.dark.border,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: -0.2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        letterSpacing: -0.2,
    },
});

export default SellerCelebrationModal;