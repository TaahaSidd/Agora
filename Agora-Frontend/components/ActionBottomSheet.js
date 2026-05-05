import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../utils/colors';

const ActionSheet = ({
    visible,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDestructive = true,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade" // Fade feels smoother for small overlays
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View
                    style={[
                        styles.bottomSheet,
                        { paddingBottom: Math.max(insets.bottom, 24) }
                    ]}
                >
                    <View style={styles.sheetHandle} />

                    <View style={styles.content}>
                        <Text style={styles.sheetTitle}>{title}</Text>
                        {message && <Text style={styles.sheetMessage}>{message}</Text>}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onClose}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelText}>{cancelText}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.confirmButton,
                                    isDestructive && { backgroundColor: '#FEE2E2' } // Light red tint
                                ]}
                                onPress={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.confirmText,
                                    isDestructive && { color: '#EF4444' } // Bold red text
                                ]}>
                                    {confirmText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
    },
    sheetHandle: {
        width: 36,
        height: 5,
        backgroundColor: COLORS.light.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    content: {
        paddingBottom: 10,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.light.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    sheetMessage: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        backgroundColor: COLORS.light.bg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.light.textSecondary,
    },
    confirmButton: {
        flex: 1,
        height: 52,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.white,
    },
});

export default ActionSheet;