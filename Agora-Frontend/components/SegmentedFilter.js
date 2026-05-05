import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../utils/colors';

const AgoraSegmentedFilter = ({ options, activeFilter, onSelect, counts = {} }) => {
    const translateX = useRef(new Animated.Value(0)).current;
    const [containerWidth, setContainerWidth] = useState(0);

    const segmentWidth = containerWidth ? (containerWidth - 8) / options.length : 0;

    useEffect(() => {
        const activeIndex = options.indexOf(activeFilter);
        if (activeIndex !== -1 && segmentWidth > 0) {
            Animated.spring(translateX, {
                toValue: activeIndex * segmentWidth,
                useNativeDriver: true,
                bounciness: 0,
                speed: 15,
            }).start();
        }
    }, [activeFilter, segmentWidth]);

    return (
        <View
            style={styles.container}
            onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        >
            {/* Sliding Pill */}
            {containerWidth > 0 && (
                <Animated.View
                    style={[styles.activePill, { width: segmentWidth, transform: [{ translateX }] }]}
                />
            )}

            {options.map((option) => {
                const isActive = activeFilter === option;
                const count = counts[option]; // Check if a count exists for this key

                return (
                    <TouchableOpacity
                        key={option}
                        onPress={() => onSelect(option)}
                        activeOpacity={1}
                        style={styles.segment}
                    >
                        <View style={styles.contentRow}>
                            <Text style={[styles.text, isActive ? styles.textActive : styles.textInactive]}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </Text>

                            {/* Render badge only if count is provided and > 0 */}
                            {typeof count === 'number' && count > 0 && (
                                <View style={[styles.badge, isActive ? styles.badgeActive : styles.badgeInactive]}>
                                    <Text style={[styles.badgeText, isActive ? styles.badgeTextActive : styles.badgeTextInactive]}>
                                        {count}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 46,
        borderRadius: 14,
        padding: 4,
        backgroundColor: COLORS.gray50,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        position: 'relative',
        marginBottom: 10,
    },
    segment: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    activePill: {
        position: 'absolute',
        top: 4,
        bottom: 4,
        left: 4,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        elevation: 3,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    text: {
        fontSize: 13,
        fontWeight: '700',
    },
    textActive: { color: COLORS.white },
    textInactive: { color: COLORS.gray400 },

    // Badge Styles
    badge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        minWidth: 20,
        alignItems: 'center',
    },
    badgeActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    badgeInactive: {
        backgroundColor: COLORS.gray100,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
    },
    badgeTextActive: { color: COLORS.white },
    badgeTextInactive: { color: COLORS.gray500 },
});

export default AgoraSegmentedFilter;