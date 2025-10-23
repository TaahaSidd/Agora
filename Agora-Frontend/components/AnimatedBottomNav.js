import React from 'react';
import { Animated, View } from 'react-native';
import BottomNavBar from './BottomNavBar';

export default function AnimatedBottomNavBar({ state, descriptors, navigation, scrollY }) {
    // Animate hide on scroll
    const translateY = scrollY
        ? scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 80], // adjust for your nav height
            extrapolate: 'clamp',
        })
        : new Animated.Value(0);

    // Current active route name
    const activeRoute = state.routes[state.index].name;

    return (
        <Animated.View
            style={{
                transform: [{ translateY }],
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <BottomNavBar
                active={activeRoute}
                onNavigate={(routeName) => {
                    const route = state.routes.find(r => r.name === routeName);
                    if (route) {
                        navigation.navigate(routeName);
                    }
                }}
            />
        </Animated.View>
    );
}
