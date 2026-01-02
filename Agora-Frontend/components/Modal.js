import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import Button from './Button';

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

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
    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    title: title || 'Success!',
                    primaryButtonText: primaryButtonText || 'Continue',
                    showSecondary: false,
                };
            case 'warning':
                return {
                    title: title || 'Warning',
                    primaryButtonText: primaryButtonText || 'Yes, Continue',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    showSecondary: true,
                };
            case 'error':
                return {
                    title: title || 'Error',
                    primaryButtonText: primaryButtonText || 'Try Again',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    showSecondary: true,
                };
            case 'confirm':
                return {
                    title: title || 'Confirm Action',
                    primaryButtonText: primaryButtonText || 'Confirm',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    showSecondary: true,
                };
            case 'delete':
                return {
                    title: title || 'Delete Item?',
                    primaryButtonText: primaryButtonText || 'Delete',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    showSecondary: true,
                };
            case 'logout':
                return {
                    title: title || 'Logout?',
                    primaryButtonText: primaryButtonText || 'Logout',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    showSecondary: true,
                };
            default:
                return {
                    title: title || 'Information',
                    primaryButtonText: primaryButtonText || 'OK',
                    showSecondary: false,
                };
        }
    };

    const config = getConfig();

    const handlePrimaryPress = () => {
        if (onPrimaryPress) {
            onPrimaryPress();
        } else if (onClose) {
            onClose();
        }
    };

    const handleSecondaryPress = () => {
        if (onSecondaryPress) {
            onSecondaryPress();
        } else if (onClose) {
            onClose();
        }
    };

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
                onPress={config.showSecondary ? null : handleSecondaryPress}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.container}>
                        {/* Title */}
                        <Text style={styles.title}>{config.title}</Text>

                        {/* Message */}
                        {message && (
                            <Text style={styles.message}>{message}</Text>
                        )}

                        {/* Divider */}
                        <View style={styles.divider}/>

                        {/* Buttons */}
                        <View style={styles.buttonsContainer}>
                            {config.showSecondary && (
                                <>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={handleSecondaryPress}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.secondaryButtonText}>
                                            {config.secondaryButtonText}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={styles.buttonDivider}/>
                                </>
                            )}
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handlePrimaryPress}
                                activeOpacity={0.7}
                            >
                                <Text style={[
                                    styles.primaryButtonText,
                                    type === 'delete' && styles.deleteButtonText,
                                    type === 'logout' && styles.deleteButtonText,
                                ]}>
                                    {config.primaryButtonText}
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
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
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
    deleteButtonText: {
        color: '#EF4444',
    },
});

export default ModalComponent;