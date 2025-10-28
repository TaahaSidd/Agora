import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const ImageUploader = ({ image, onPickImage, error }) => (
    <TouchableOpacity
        style={[styles.container, error && styles.errorBorder]}
        onPress={onPickImage}
    >
        {image ? (
            <View style={styles.previewContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity style={styles.changeButton} onPress={onPickImage}>
                    <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.placeholder}>
                <View style={styles.iconBox}>
                    <Ionicons name="cloud-upload-outline" size={40} color={COLORS.primary} />
                </View>
                <Text style={styles.text}>Tap to upload image</Text>
                <Text style={styles.subtext}>JPG, PNG up to 5MB</Text>
            </View>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        padding: 0,
        backgroundColor: '#fff',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    errorBorder: {
        borderColor: COLORS.error || '#dc2626',
    },
    previewContainer: {
        width: 140,
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    changeButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 2,
    },
    placeholder: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        width: 140,
        height: 140,
    },
    iconBox: {
        backgroundColor: '#F3F4F6',
        borderRadius: 999,
        marginBottom: 12,
        padding: 10,
    },
    text: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    subtext: {
        color: '#9CA3AF',
        fontSize: 12,
        textAlign: 'center',
    },
    errorText: {
        color: COLORS.error || '#dc2626',
        fontSize: 13,
        marginTop: 8,
    },
});

export default ImageUploader;
