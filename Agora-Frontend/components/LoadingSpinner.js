import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const LoadingSpinner = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        spinValue.setValue(0);
        const spin = spinValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
        });

        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.spinner,
                {
                    transform: [{
                        rotate: spin.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                        })
                    }],
                }
            ]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    spinner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderLeftWidth: 4,
        borderTopWidth: 4,
        borderLeftColor: '#008CFE',
        borderTopColor: '#008CFE',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        shadowColor: '#008CFE',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
});

export default LoadingSpinner;
