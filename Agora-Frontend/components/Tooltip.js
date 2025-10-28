import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const Tooltip = ({
    message,
    position = 'bottom', // 'top', 'bottom', 'left', 'right'
    visible = true,
    onClose,
    showArrow = true,
    icon = 'hand-left-outline',
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
                styles.tooltipContainer,
                position === 'top' && styles.tooltipTop,
                position === 'bottom' && styles.tooltipBottom,
                position === 'left' && styles.tooltipLeft,
                position === 'right' && styles.tooltipRight,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                    style,
                },
            ]}
        >
            <View style={styles.tooltip}>
                {icon && (
                    <Ionicons name={icon} size={20} color="#fff" style={styles.icon} />
                )}
                <Text style={styles.tooltipText}>{message}</Text>
                {onClose && (
                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeButton}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="close" size={16} color="#fff" />
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
    tooltipContainer: {
        position: 'absolute',
        zIndex: 1000,
    },
    tooltipTop: {
        bottom: '100%',
        marginBottom: 12,
    },
    tooltipBottom: {
        top: '100%',
        marginTop: 12,
    },
    tooltipLeft: {
        right: '100%',
        marginRight: 12,
    },
    tooltipRight: {
        left: '100%',
        marginLeft: 12,
    },
    tooltip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        maxWidth: 250,
    },
    icon: {
        marginRight: 8,
    },
    tooltipText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        flex: 1,
        lineHeight: 18,
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
    },
    arrowTop: {
        position: 'absolute',
        top: -8,
        left: '50%',
        marginLeft: -8,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: COLORS.primary,
    },
    arrowBottom: {
        position: 'absolute',
        bottom: -8,
        left: '50%',
        marginLeft: -8,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.primary,
    },
    arrowLeft: {
        position: 'absolute',
        left: -8,
        top: '50%',
        marginTop: -8,
        borderTopWidth: 8,
        borderBottomWidth: 8,
        borderRightWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: COLORS.primary,
    },
    arrowRight: {
        position: 'absolute',
        right: -8,
        top: '50%',
        marginTop: -8,
        borderTopWidth: 8,
        borderBottomWidth: 8,
        borderLeftWidth: 8,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: COLORS.primary,
    },
});

export default Tooltip;