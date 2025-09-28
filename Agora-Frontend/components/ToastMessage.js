import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/colors';

const ToastMessage = ({ type = 'info', title, message, onHide }) => {
    const slideAnim = useRef(new Animated.Value(-500)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => onHide && onHide());
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const backgroundColor =
        type === 'success' ? COLORS.green :
            type === 'error' ? COLORS.red :
                COLORS.primary;

    return (
        <Animated.View style={[styles.container, { backgroundColor, transform: [{ translateY: slideAnim }] }]}>
            {title && <Text style={styles.title}>{title}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        padding: 14,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 5,
        zIndex: 1000,
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
        marginBottom: 2,
    },
    message: {
        fontSize: 14,
        color: '#fff',
    },
});

export default ToastMessage;
