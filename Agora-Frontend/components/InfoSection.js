import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InfoInput from './InfoInput';

export default function InfoSection({ title, fields }) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.infoCard}>
                {fields.map((field, index) => (
                    <InfoInput
                        key={index}
                        label={field.label}
                        value={field.value}
                        icon={field.icon}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
});
