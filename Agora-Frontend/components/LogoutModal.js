import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import Button from './Button';

import { Ionicons } from '@expo/vector-icons';

export default function LogoutModal({ visible, onClose, onConfirm }) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalIconContainer}>
                        <Ionicons name="log-out-outline" size={40} color="#EF4444" />
                    </View>
                    <Text style={styles.modalTitle}>Logout?</Text>
                    <Text style={styles.modalText}>
                        Are you sure you want to logout from your account?
                    </Text>

                    <View style={styles.modalButtons}>
                        <Button
                            title="Cancel"
                            variant="outline"
                            size="medium"
                            onPress={onClose}
                        // style={styles.cancelButton}   // optional if you have spacing/custom styles
                        // textStyle={styles.cancelText} // optional for custom text styling
                        />

                        <Button
                            title="Yes, Logout"
                            variant="danger"
                            size="medium"
                            onPress={onConfirm}
                        // style={styles.confirmButton}   // optional for layout/styling
                        // textStyle={styles.confirmText} // optional if you have custom text styles
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    modalIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        marginRight: 8,
    },
    cancelText: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '700',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginLeft: 8,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});
