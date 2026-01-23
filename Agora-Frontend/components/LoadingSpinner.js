import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { COLORS } from '../utils/colors';

const LoadingSpinner = ({
                            size = 'medium',
                            color = COLORS.primary,
                        }) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    const sizes = {
        small: 24,
        medium: 40,
        large: 56,
    };

    const spinnerSize = sizes[size] || sizes.medium;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 800,
                easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            {/* BACKGROUND TRACK (The circle the spinner follows) */}
            <View
                style={[
                    styles.spinner,
                    {
                        width: spinnerSize,
                        height: spinnerSize,
                        borderRadius: spinnerSize / 2,
                        borderWidth: spinnerSize / 10,
                        // This makes the path visible but very faint on white
                        borderColor: COLORS.light.border,
                        position: 'absolute',
                    },
                ]}
            />

            {/* ACTIVE SPINNER */}
            <Animated.View
                style={[
                    styles.spinner,
                    {
                        width: spinnerSize,
                        height: spinnerSize,
                        borderRadius: spinnerSize / 2,
                        borderWidth: spinnerSize / 10,
                        borderTopColor: color,
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent',
                        borderLeftColor: 'transparent',
                        transform: [{ rotate: spin }],
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinner: {
        borderStyle: 'solid',
    },
});

export default LoadingSpinner;