import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const ToastMessage = ({
    type = 'info',
    title,
    message,
    onHide,
    duration = 3000,
    position = 'top',
}) => {
    const slideAnim = useRef(new Animated.Value(position === 'top' ? -200 : 200)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;
    const progressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 70,
                friction: 9,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Progress bar animation
        Animated.timing(progressAnim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(() => {
            hideToast();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: position === 'top' ? -200 : 200,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 0.92,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => onHide && onHide());
    };

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    iconColor: COLORS.success,
                    accentColor: COLORS.success,
                    backgroundColor: COLORS.dark.cardElevated,
                    titleColor: COLORS.successLight,
                    messageColor: COLORS.dark.textSecondary,
                };
            case 'error':
                return {
                    icon: 'close-circle',
                    iconColor: COLORS.error,
                    accentColor: COLORS.error,
                    backgroundColor: COLORS.dark.cardElevated,
                    titleColor: COLORS.errorLight,
                    messageColor: COLORS.dark.textSecondary,
                };
            case 'warning':
                return {
                    icon: 'warning',
                    iconColor: COLORS.warning,
                    accentColor: COLORS.warning,
                    backgroundColor: COLORS.dark.cardElevated,
                    titleColor: COLORS.warningLight,
                    messageColor: COLORS.dark.textSecondary,
                };
            case 'info':
            default:
                return {
                    icon: 'information-circle',
                    iconColor: COLORS.info,
                    accentColor: COLORS.info,
                    backgroundColor: COLORS.dark.cardElevated,
                    titleColor: COLORS.infoLight,
                    messageColor: COLORS.dark.textSecondary,
                };
        }
    };

    const config = getToastConfig();

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.topPosition : styles.bottomPosition,
                {
                    backgroundColor: config.backgroundColor,
                    transform: [
                        { translateY: slideAnim },
                        { scale: scaleAnim }
                    ],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: `${config.iconColor}20` }]}>
                    <Ionicons name={config.icon} size={22} color={config.iconColor} />
                </View>

                <View style={styles.textContainer}>
                    {title && (
                        <Text style={[styles.title, { color: config.titleColor }]} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                    {message && (
                        <Text style={[styles.message, { color: config.messageColor }]} numberOfLines={2}>
                            {message}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={hideToast}
                    style={styles.closeButton}
                    activeOpacity={0.6}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close" size={20} color={COLORS.dark.textTertiary} />
                </TouchableOpacity>
            </View>

            {/* Progress bar */}
            <View style={styles.progressBarContainer}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            backgroundColor: config.accentColor,
                            width: progressWidth,
                        },
                    ]}
                />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 18,
        right: 18,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
        elevation: 8,
        zIndex: 9999,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    topPosition: {
        top: Platform.OS === 'ios' ? 60 : 50,
    },
    bottomPosition: {
        bottom: Platform.OS === 'ios' ? 50 : 30,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        paddingTop: 2,
    },
    title: {
        fontWeight: '600',
        fontSize: 15,
        marginBottom: 3,
        letterSpacing: -0.3,
    },
    message: {
        fontSize: 14,
        lineHeight: 19,
        fontWeight: '400',
        letterSpacing: -0.1,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    progressBarContainer: {
        height: 2,
        backgroundColor: COLORS.dark.border,
        width: '100%',
    },
    progressBar: {
        height: '100%',
    },
});

export default ToastMessage;