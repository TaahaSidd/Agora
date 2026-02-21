import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';

import { COLORS } from '../utils/colors';

const MODAL_CONFIG = {
    success: {
        title: 'Success!',
        primary: 'Continue',
    },
    warning: {
        title: 'Warning',
        primary: 'Yes, Continue',
        secondary: 'Cancel',
    },
    error: {
        title: 'Error',
        primary: 'Try Again',
        secondary: 'Cancel',
    },
    confirm: {
        title: 'Confirm Action',
        primary: 'Confirm',
        secondary: 'Cancel',
    },
    delete: {
        title: 'Delete Item?',
        primary: 'Delete',
        secondary: 'Cancel',
        danger: true,
    },
    logout: {
        title: 'Logout?',
        primary: 'Logout',
        secondary: 'Cancel',
        danger: true,
    },
};

const ModalComponent = ({
    visible,
    type = 'success',
    title,
    message,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    onClose,
}) => {
    const base = MODAL_CONFIG[type] || {};

    const config = {
        title: title || base.title || 'Information',
        primary: primaryButtonText || base.primary || 'OK',
        secondary: secondaryButtonText || base.secondary,
        danger: base.danger,
    };

    const handlePress = (callback) => {
        callback ? callback() : onClose?.();
    };

    const allowBackdropClose = !config.secondary;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={allowBackdropClose ? onClose : undefined}
            >
                <TouchableOpacity activeOpacity={1}>
                    <View style={styles.container}>
                        {/* Title */}
                        <Text style={styles.title}>{config.title}</Text>

                        {/* Message */}
                        {message ? (
                            <Text style={styles.message}>{message}</Text>
                        ) : null}

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Buttons */}
                        <View>
                            {config.secondary && (
                                <>
                                    <TouchableOpacity
                                        style={styles.button}
                                        activeOpacity={0.7}
                                        onPress={() => handlePress(onSecondaryPress)}
                                    >
                                        <Text style={styles.secondaryButtonText}>
                                            {config.secondary}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.divider} />
                                </>
                            )}

                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.7}
                                onPress={() => handlePress(onPrimaryPress)}
                            >
                                <Text
                                    style={[
                                        styles.primaryButtonText,
                                        config.danger && styles.dangerText,
                                    ]}
                                >
                                    {config.primary}
                                </Text>
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
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 280,
        backgroundColor: COLORS.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        overflow: 'hidden',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.light.text,
        textAlign: 'center',
        paddingTop: 20,
        paddingBottom: 6,
        paddingHorizontal: 20,
    },
    message: {
        fontSize: 13.5,
        fontWeight: '500',
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
        lineHeight: 19,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.light.border,
    },
    button: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontSize: 15.5,
        fontWeight: '700',
        color: COLORS.primary,
    },
    secondaryButtonText: {
        fontSize: 15.5,
        fontWeight: '600',
        color: COLORS.light.textSecondary,
    },
    dangerText: {
        color: '#EF4444',
    },
});

export default ModalComponent;
