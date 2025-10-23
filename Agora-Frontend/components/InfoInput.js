import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InfoInput({ label, value, icon, editable = false, placeholder }) {
    return (
        <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputContainer}>
                <Ionicons name={icon} size={18} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    value={value || ''}
                    editable={editable}
                    placeholder={placeholder}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: { flex: 1, marginBottom: 16 },
    inputLabel: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, paddingVertical: 12, fontSize: 15, color: '#111827', fontWeight: '500' },
});
