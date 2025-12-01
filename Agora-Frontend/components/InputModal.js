import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Animated, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

import Button from '../components/Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 100;

const InputModal = ({
    visible,
    type = 'info',
    title,
    message,
    icon,
    iconSize = 50,
    iconColor,
    iconBgColor,
    placeholder = 'Share your experience...',
    initialValue = '',
    multiline = false,
    maxLength = 300,
    primaryButtonText = 'Submit',
    secondaryButtonText = 'Cancel',
    onPrimaryPress,
    onSecondaryPress,
    onClose,
    enableRating = false,
    initialRating = 0,
    showCharCount = true,
    userName,
}) => {
    const [inputValue, setInputValue] = useState(initialValue);
    const [selectedRating, setSelectedRating] = useState(initialRating);

    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setInputValue(initialValue);
            setSelectedRating(initialRating);
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    damping: 50,
                    stiffness: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(MAX_TRANSLATE_Y + gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    closeSheet();
                } else {
                    Animated.spring(translateY, {
                        toValue: MAX_TRANSLATE_Y,
                        damping: 50,
                        stiffness: 400,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const closeSheet = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (onSecondaryPress) onSecondaryPress();
        });
    };

    const getConfig = () => {
        switch (type) {
            case 'review':
                return {
                    icon: icon || 'star',
                    iconColor: iconColor || '#FFD700',
                    iconBgColor: iconBgColor || '#FFF9E6',
                    title: title || 'Rate Your Experience',
                };
            case 'feedback':
                return {
                    icon: icon || 'chatbubbles',
                    iconColor: iconColor || '#10B981',
                    iconBgColor: iconBgColor || '#D1FAE5',
                    title: title || 'Share Feedback',
                };
            case 'report':
                return {
                    icon: icon || 'flag',
                    iconColor: iconColor || '#EF4444',
                    iconBgColor: iconBgColor || '#FEE2E2',
                    title: title || 'Report Issue',
                };
            default:
                return {
                    icon: icon || 'create-outline',
                    iconColor: iconColor || COLORS.primary,
                    iconBgColor: iconBgColor || '#EFF6FF',
                    title: title || 'Input Required',
                };
        }
    };

    const config = getConfig();

    const getRatingLabel = (rating) => {
        switch (rating) {
            case 1: return { text: 'Poor', color: '#EF4444', emoji: '' };
            case 2: return { text: 'Fair', color: '#F59E0B', emoji: '' };
            case 3: return { text: 'Good', color: '#F59E0B', emoji: '' };
            case 4: return { text: 'Great', color: '#10B981', emoji: '' };
            case 5: return { text: 'Excellent', color: '#10B981', emoji: '' };
            default: return { text: 'Tap to rate', color: '#9CA3AF', emoji: '' };
        }
    };

    const ratingLabel = getRatingLabel(selectedRating);

    const handlePrimaryPress = () => {
        if (inputValue.trim() || selectedRating > 0) {
            if (onPrimaryPress) onPrimaryPress(inputValue, selectedRating);
            closeSheet();
            resetForm();
        }
    };

    const handleSecondaryPress = () => {
        closeSheet();
        resetForm();
    };

    const resetForm = () => {
        setTimeout(() => {
            setInputValue('');
            setSelectedRating(initialRating);
        }, 300);
    };

    const isSubmitDisabled = !inputValue.trim() && selectedRating === 0;

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={closeSheet}
            statusBarTranslucent
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.overlay}>
                    {/* Backdrop */}
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFill,
                            {
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                opacity: opacity,
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={StyleSheet.absoluteFill}
                            activeOpacity={1}
                            onPress={closeSheet}
                        />
                    </Animated.View>

                    {/* Bottom Sheet */}
                    <Animated.View
                        style={[
                            styles.bottomSheet,
                            {
                                transform: [{ translateY: translateY }],
                            },
                        ]}
                    >
                        {/* Drag Handle */}
                        <View {...panResponder.panHandlers} style={styles.dragHandleContainer}>
                            <View style={styles.dragHandle} />
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            bounces={false}
                        >
                            <View style={styles.content}>
                                {/* Icon */}
                                <View style={styles.iconWrapper}>
                                    <View style={[styles.iconContainer, { backgroundColor: config.iconBgColor }]}>
                                        <Ionicons name={config.icon} size={iconSize} color={config.iconColor} />
                                    </View>
                                </View>

                                {/* Title */}
                                <Text style={styles.title}>{config.title}</Text>

                                {/* User Info */}
                                {userName && (
                                    <View style={styles.userInfo}>
                                        <Text style={styles.userLabel}>Rating for</Text>
                                        <Text style={styles.userName}>{userName}</Text>
                                    </View>
                                )}

                                {/* Message */}
                                {message && <Text style={styles.message}>{message}</Text>}

                                {/* Star Rating */}
                                {enableRating && (
                                    <View style={styles.ratingSection}>
                                        <View style={styles.starsContainer}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <TouchableOpacity
                                                    key={star}
                                                    onPress={() => setSelectedRating(star)}
                                                    activeOpacity={0.7}
                                                    style={styles.starButton}
                                                >
                                                    <Ionicons
                                                        name={star <= selectedRating ? 'star' : 'star-outline'}
                                                        size={44}
                                                        color={star <= selectedRating ? '#FFD700' : '#E5E7EB'}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>

                                        {/* Rating Label */}
                                        <View style={styles.ratingLabelContainer}>
                                            {ratingLabel.emoji && (
                                                <Text style={styles.ratingEmoji}>{ratingLabel.emoji}</Text>
                                            )}
                                            <Text style={[styles.ratingLabel, { color: ratingLabel.color }]}>
                                                {ratingLabel.text}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {/* Input Field */}
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={[styles.input, multiline && styles.multilineInput]}
                                        placeholder={placeholder}
                                        placeholderTextColor="#9CA3AF"
                                        value={inputValue}
                                        onChangeText={setInputValue}
                                        multiline={multiline}
                                        maxLength={maxLength}
                                        textAlignVertical={multiline ? 'top' : 'center'}
                                    />
                                    {showCharCount && maxLength && (
                                        <Text style={styles.charCount}>
                                            {inputValue.length}/{maxLength}
                                        </Text>
                                    )}
                                </View>

                                {/* Quick Tags */}
                                {type === 'review' && selectedRating > 0 && (
                                    <View style={styles.tagsContainer}>
                                        <Text style={styles.tagsLabel}>Quick tags</Text>
                                        <View style={styles.tagsRow}>
                                            {['Quick Response', 'Great Quality', 'Fair Price', 'Reliable'].map((tag) => (
                                                <TouchableOpacity
                                                    key={tag}
                                                    style={styles.tag}
                                                    activeOpacity={0.7}
                                                    onPress={() => {
                                                        const currentValue = inputValue.trim();
                                                        const newValue = currentValue
                                                            ? `${currentValue} • ${tag}`
                                                            : tag;
                                                        if (newValue.length <= maxLength) {
                                                            setInputValue(newValue);
                                                        }
                                                    }}
                                                >
                                                    <Text style={styles.tagText}>{tag}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {/* Buttons */}
                                <View style={styles.buttonsContainer}>
                                    <Button
                                        title={secondaryButtonText}
                                        variant="secondary"
                                        onPress={handleSecondaryPress}
                                        style={{ flex: 1, marginRight: 6 }}
                                    />

                                    <Button
                                        title={primaryButtonText}
                                        variant="primary"
                                        icon='checkmark-circle'
                                        onPress={handlePrimaryPress}
                                        disabled={isSubmitDisabled}
                                        style={{ flex: 1, marginRight: 6 }}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: COLORS.dark.overlay, // dark overlay
    },
    bottomSheet: {
        backgroundColor: COLORS.dark.card,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        maxHeight: SCREEN_HEIGHT * 0.9,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        transform: [{ translateY: SCREEN_HEIGHT }],
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: COLORS.dark.border,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 10,
    },
    iconWrapper: {
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.dark.cardElevated,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    userInfo: {
        alignItems: 'center',
        marginBottom: 12,
    },
    userLabel: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        marginBottom: 4,
    },
    userName: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.primary,
    },
    message: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    ratingSection: {
        marginBottom: 24,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 16,
    },
    starButton: {
        padding: 6,
    },
    ratingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    ratingEmoji: {
        fontSize: 28,
    },
    ratingLabel: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        width: '100%',
        borderWidth: 2,
        borderColor: COLORS.dark.border,
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        color: COLORS.dark.text,
        backgroundColor: COLORS.dark.cardElevated,
    },
    multilineInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        textAlign: 'right',
        marginTop: 8,
        fontWeight: '500',
    },
    tagsContainer: {
        marginBottom: 20,
    },
    tagsLabel: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '700',
        marginBottom: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    tag: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: 1.5,
        borderColor: COLORS.dark.border,
    },
    tagText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '700',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
});

export default InputModal;