import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const ToastMessage = ({
                          type = 'info',
                          title,
                          message,
                          onHide,
                          duration = 3000,
                          position = 'top',
                      }) => {
    const slideAnim = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Slide in
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 65,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto hide
        const timer = setTimeout(() => {
            hideToast();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: position === 'top' ? -100 : 100,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => onHide && onHide());
    };

    const getToastStyle = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: COLORS.success,
                    textColor: '#FFFFFF',
                };
            case 'error':
                return {
                    backgroundColor: COLORS.error,
                    textColor: '#FFFFFF',
                };
            case 'warning':
                return {
                    backgroundColor: COLORS.warning,
                    textColor: '#FFFFFF',
                };
            case 'info':
            default:
                return {
                    backgroundColor: COLORS.info,
                    textColor: '#FFFFFF',
                };
        }
    };

    const toastStyle = getToastStyle();

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.topPosition : styles.bottomPosition,
                {
                    backgroundColor: toastStyle.backgroundColor,
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    {title && (
                        <Text style={[styles.title, { color: toastStyle.textColor }]} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                    {message && (
                        <Text style={[styles.message, { color: toastStyle.textColor }]} numberOfLines={2}>
                            {message}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={hideToast}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close" size={18} color={toastStyle.textColor} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        borderRadius: THEME.borderRadius.lg,
        shadowColor: COLORS.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
        zIndex: 9999,
    },
    topPosition: {
        top: Platform.OS === 'ios' ? 60 : 50,
    },
    bottomPosition: {
        bottom: Platform.OS === 'ios' ? 50 : 30,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing[4],
        paddingVertical: THEME.spacing[3] + 2,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: THEME.fontWeight.bold,
        fontSize: THEME.fontSize.base,
        marginBottom: 2,
        letterSpacing: THEME.letterSpacing.tight,
    },
    message: {
        fontSize: THEME.fontSize.sm,
        lineHeight: 18,
        fontWeight: THEME.fontWeight.medium,
        opacity: 0.95,
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: THEME.spacing[2],
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
});

export default ToastMessage;