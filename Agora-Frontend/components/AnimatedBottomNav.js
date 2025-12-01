import React from 'react';
import { Animated, View } from 'react-native';
import BottomNavBar from './BottomNavBar';

export default function AnimatedBottomNavBar({ state, descriptors, navigation, scrollY, isGuest }) {
    const translateY = scrollY
        ? scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 100],
            extrapolate: 'clamp',
        })
        : new Animated.Value(0);

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
                isGuest={isGuest}
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
