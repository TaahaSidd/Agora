import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, THEME } from '../utils/colors';

const SuccessModal = ({ visible, message, onClose }) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Green Check Circle */}
                    <View style={styles.iconWrapper}>
                        <Ionicons name="checkmark" size={36} color={COLORS.white} />
                    </View>

                    {/* Success Text */}
                    <Text style={styles.successText}>Success</Text>

                    {/* Message */}
                    <Text style={styles.messageText}>{message}</Text>

                    {/* OK Button */}
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: THEME.borderRadius.lg,
        padding: 25,
        alignItems: 'center',
    },
    iconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4BB543', // green
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    successText: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 8,
    },
    messageText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: THEME.borderRadius.md,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SuccessModal;
