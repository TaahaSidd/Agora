import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../utils/colors';

const TYPE_MAP = {
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
    info: COLORS.info,
};

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
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 8, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(hideToast, duration);
        return () => clearTimeout(timer);
    }, []);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: position === 'top' ? -100 : 100, duration: 200, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]).start(() => onHide?.());
    };

    const bg = TYPE_MAP[type] || TYPE_MAP.info;

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.top : styles.bottom,
                { backgroundColor: bg, transform: [{ translateY: slideAnim }], opacity: opacityAnim },
            ]}
        >
            {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
            {message && <Text style={styles.message} numberOfLines={2}>{message}</Text>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        zIndex: 9999,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
            },
            android: { elevation: 6 },
        }),
    },
    top: { top: Platform.OS === 'ios' ? 64 : 50 },
    bottom: { bottom: Platform.OS === 'ios' ? 60 : 40 },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 2,
        letterSpacing: -0.2,
    },
    message: {
        fontSize: 12,
        fontWeight: '400',
        color: COLORS.white,
        lineHeight: 17,
        opacity: 0.9,
    },
});

export default ToastMessage;