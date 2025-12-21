import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const ImageUploadField = ({
    label,
    value,
    onImageSelect,
    error,
    style,
    placeholder = 'Tap to upload',
    maxSizeInMB = 5,
    aspectRatio = [4, 3],
}) => {
    const [uploading, setUploading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const checkPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please allow access to your photos to upload ID card.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const checkCameraPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please allow camera access to take a photo.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const validateImage = (imageInfo) => {
        const sizeInMB = imageInfo.fileSize / (1024 * 1024);
        if (sizeInMB > maxSizeInMB) {
            Alert.alert(
                'File Too Large',
                `Please select an image smaller than ${maxSizeInMB}MB. Current size: ${sizeInMB.toFixed(2)}MB`,
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await checkPermissions();
        if (!hasPermission) return;

        try {
            setUploading(true);

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: aspectRatio,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const imageInfo = result.assets[0];

                if (validateImage(imageInfo)) {
                    onImageSelect(imageInfo.uri);
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const takePhoto = async () => {
        const hasPermission = await checkCameraPermissions();
        if (!hasPermission) return;

        try {
            setUploading(true);

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: false,
                aspect: aspectRatio,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const imageInfo = result.assets[0];

                if (validateImage(imageInfo)) {
                    onImageSelect(imageInfo.uri);
                }
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Upload ID Card',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: takePhoto,
                },
                {
                    text: 'Choose from Gallery',
                    onPress: pickImage,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const removeImage = () => {
        Alert.alert(
            'Remove Image',
            'Are you sure you want to remove this image?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => onImageSelect(null),
                },
            ]
        );
    };

    // Match InputField styling
    const borderColor = error ? COLORS.error : isFocused ? COLORS.primary : COLORS.dark.border;
    const shadowOpacity = isFocused ? 0.2 : 0.08;
    const showFloatingLabel = isFocused || value;

    return (
        <View style={[styles.container, style]}>
            {/* Match InputField wrapper style */}
            <View
                style={[
                    styles.inputWrapper,
                    {
                        borderColor,
                        shadowOpacity,
                    },
                ]}
            >
                {/* Floating label - same as InputField */}
                {label && showFloatingLabel && (
                    <View style={styles.floatingLabelContainer}>
                        <Text
                            style={[
                                styles.floatingLabel,
                                {
                                    color: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.dark.text,
                                },
                            ]}
                        >
                            {label}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={styles.uploadTouchable}
                    onPress={value ? null : onImageSelect}
                    onPressIn={() => setIsFocused(true)}
                    onPressOut={() => setIsFocused(false)}
                    activeOpacity={0.7}
                    disabled={uploading}
                >
                    {uploading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                            <Text style={styles.loadingText}>Uploading...</Text>
                        </View>
                    ) : value ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image
                                source={{ uri: value }}
                                style={styles.imagePreview}
                                resizeMode="cover"
                            />
                            <View style={styles.imageActions}>
                                <TouchableOpacity
                                    style={styles.imageActionButton}
                                    onPress={showImageOptions}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons
                                        name="camera-flip"
                                        size={16}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.imageActionButton, styles.deleteButton]}
                                    onPress={removeImage}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons
                                        name="delete"
                                        size={16}
                                        color={COLORS.error}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.successBadge}>
                                <MaterialCommunityIcons
                                    name="check-circle"
                                    size={14}
                                    color={COLORS.success}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.placeholderContainer}>
                            <MaterialCommunityIcons
                                name="card-account-details"
                                size={22}
                                color={isFocused ? COLORS.primary : COLORS.dark.textTertiary}
                                style={styles.placeholderIcon}
                            />
                            <Text style={styles.placeholderText}>
                                {showFloatingLabel ? placeholder : (label || placeholder)}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Footer - same as InputField */}
            {error && (
                <View style={styles.footerContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: THEME.spacing.md,
    },
    // Match InputField wrapper exactly
    inputWrapper: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.full,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 1,
        overflow: 'visible',
    },
    // Match InputField floating label exactly
    floatingLabelContainer: {
        position: 'absolute',
        top: -10,
        left: 16,
        backgroundColor: COLORS.dark.card,
        paddingHorizontal: 4,
        zIndex: 2,
        borderRadius: THEME.borderRadius.full,
    },
    floatingLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    uploadTouchable: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        minHeight: 56, // Match InputField height
    },
    placeholderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholderIcon: {
        marginRight: 12,
    },
    placeholderText: {
        fontSize: 16,
        color: COLORS.dark.textTertiary,
        flex: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    imagePreview: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: COLORS.dark.bgElevated,
    },
    imageActions: {
        flexDirection: 'row',
        gap: 8,
    },
    imageActionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    deleteButton: {
        // No extra background, just border change on press
    },
    successBadge: {
        marginLeft: 8,
    },
    // Match InputField footer exactly
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
        paddingHorizontal: 4,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        fontWeight: '500',
        flex: 1,
    },
});

export default ImageUploadField;