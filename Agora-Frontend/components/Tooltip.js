import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const Tooltip = ({
    message,
    position = 'bottom',
    visible = true,
    onClose,
    showArrow = true,
    style,
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' && styles.posTop,
                position === 'bottom' && styles.posBottom,
                position === 'left' && styles.posLeft,
                position === 'right' && styles.posRight,
                { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                style,
            ]}
        >
            <View style={styles.bubble}>
                <Text style={styles.message}>{message}</Text>
                {onClose && (
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeBtn}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={14} color={COLORS.white} />
                    </TouchableOpacity>
                )}
            </View>

            {showArrow && (
                <View style={[
                    styles.arrow,
                    position === 'top' && styles.arrowBottom,
                    position === 'bottom' && styles.arrowTop,
                    position === 'left' && styles.arrowRight,
                    position === 'right' && styles.arrowLeft,
                ]} />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 1000,
    },

    // Position
    posTop: { bottom: '100%', marginBottom: 12 },
    posBottom: { top: '100%', marginTop: 12 },
    posLeft: { right: '100%', marginRight: 12 },
    posRight: { left: '100%', marginLeft: 12 },

    // Bubble
    bubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 10,
        maxWidth: 240,
        gap: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    message: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '500',
        flexShrink: 1,
        lineHeight: 17,
    },
    closeBtn: {
        width: 20,
        height: 20,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Arrow
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
    },
    arrowTop: {
        position: 'absolute',
        top: -7,
        left: '50%',
        marginLeft: -7,
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderBottomWidth: 7,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: COLORS.primary,
    },
    arrowBottom: {
        position: 'absolute',
        bottom: -7,
        left: '50%',
        marginLeft: -7,
        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderTopWidth: 7,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.primary,
    },
    arrowLeft: {
        position: 'absolute',
        left: -7,
        top: '50%',
        marginTop: -7,
        borderTopWidth: 7,
        borderBottomWidth: 7,
        borderRightWidth: 7,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: COLORS.primary,
    },
    arrowRight: {
        position: 'absolute',
        right: -7,
        top: '50%',
        marginTop: -7,
        borderTopWidth: 7,
        borderBottomWidth: 7,
        borderLeftWidth: 7,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: COLORS.primary,
    },
});

export default Tooltip;