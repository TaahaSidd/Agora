import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Text, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authApiPost } from '../services/api';
import { COLORS } from '../utils/colors';
import { jwtDecode } from 'jwt-decode';
import { useUserStore } from "../stores/userStore";
import LogoAppSVG from '../assets/svg/LogoAppSVG.svg';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const taglineAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const circle1 = useRef(new Animated.Value(0)).current;
    const circle2 = useRef(new Animated.Value(0)).current;
    const circle3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
        ]).start();

        Animated.timing(taglineAnim, {
            toValue: 1,
            duration: 800,
            delay: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.03,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.parallel([
                Animated.timing(circle1, {
                    toValue: 1,
                    duration: 10000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(circle2, {
                    toValue: 1,
                    duration: 13000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(circle3, {
                    toValue: 1,
                    duration: 16000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        const setOnboardingSeen = async () => {
            await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        };

        const getOnboardingSeen = async () => {
            const value = await SecureStore.getItemAsync('hasSeenOnboarding');
            return value === 'true';
        };

        const timer = setTimeout(async () => {
            try {
                const hasSeenOnboarding = await getOnboardingSeen();
                const accessToken = await SecureStore.getItemAsync('accessToken');
                const refreshToken = await SecureStore.getItemAsync('refreshToken');

                if (!hasSeenOnboarding) {
                    navigation.replace('Onboarding', { guest: !accessToken });
                    return;
                }

                if (!accessToken && !refreshToken) {
                    navigation.replace('Login');
                    return;
                }

                if (accessToken) {
                    const { exp } = jwtDecode(accessToken);
                    const jwtExpired = Date.now() >= exp * 1000;

                    if (!jwtExpired) {
                        await useUserStore.getState().fetchUser();
                        navigation.replace('MainLayout', { guest: false });
                        return;
                    }
                }

                if (refreshToken) {
                    try {
                        const res = await authApiPost('/auth/refresh', { refreshToken });
                        await SecureStore.setItemAsync('accessToken', res.jwt);
                        if (res.refreshToken) await SecureStore.setItemAsync('refreshToken', res.refreshToken);

                        await useUserStore.getState().fetchUser();
                        navigation.replace('MainLayout', { guest: false });
                        return;
                    } catch {
                        await SecureStore.deleteItemAsync('accessToken');
                        await SecureStore.deleteItemAsync('refreshToken');
                        navigation.replace('Login');
                        return;
                    }
                }

                await SecureStore.deleteItemAsync('accessToken');
                navigation.replace('Login');

            } catch (error) {
                console.log('Token validation failed:', error);
                navigation.replace('Login');
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation, scaleAnim, opacityAnim]);

    const circle1Y = circle1.interpolate({
        inputRange: [0, 1],
        outputRange: [height, -300],
    });
    const circle2Y = circle2.interpolate({
        inputRange: [0, 1],
        outputRange: [height + 150, -350],
    });
    const circle3Y = circle3.interpolate({
        inputRange: [0, 1],
        outputRange: [height + 300, -400],
    });

    const circle1X = circle1.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 30, 0],
    });
    const circle2X = circle2.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -40, 0],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.circle,
                    styles.circle1,
                    {
                        transform: [
                            { translateY: circle1Y },
                            { translateX: circle1X }
                        ]
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.circle,
                    styles.circle2,
                    {
                        transform: [
                            { translateY: circle2Y },
                            { translateX: circle2X }
                        ]
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.circle,
                    styles.circle3,
                    { transform: [{ translateY: circle3Y }] },
                ]}
            />

            {/* Main Content - SVG Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                <LogoAppSVG width={280} height={280} />
            </Animated.View>

            {/* Tagline */}
            <Animated.View
                style={[
                    styles.taglineContainer,
                    {
                        opacity: taglineAnim,
                        transform: [
                            {
                                translateY: taglineAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [30, 0],
                                }),
                            },
                        ],
                    },
                ]}
            >
                <Text style={styles.tagline}>India's First Student Marketplace</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlue,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.04,
    },
    circle1: {
        width: 500,
        height: 500,
        backgroundColor: COLORS.primary,
        left: -150,
    },
    circle2: {
        width: 400,
        height: 400,
        backgroundColor: '#3B82F6',
        right: -120,
    },
    circle3: {
        width: 350,
        height: 350,
        backgroundColor: '#8B5CF6',
        left: width / 2 - 175,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    taglineContainer: {
        position: 'absolute',
        bottom: 80,
        alignItems: 'center',
    },
    tagline: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.8,
    },
});


/*
SPLASH SCREEN LOGIC - PRODUCTION PATTERN

1. Purpose:
- Hide app loading / cold start
    - Run auth + onboarding checks
    - Decide initial navigation
    - Mask startup time with animation

2. What we need:
    - Minimum display time(e.g., 1 - 1.5s)
    - Async logic completion tracking:
        • Onboarding check
        • Access / refresh token validation
        • Fetch user if logged in
    - Animation(logo, pulses, background motion)
    - Navigation only after BOTH:
        • Async logic finished
        • Minimum time elapsed

3. Notes:
    - Avoid fixed timeouts(do not just wait 3s)
    - Do not fetch heavy data here(keep splash lightweight)
    - Hide Expo native splash immediately when JS is ready
    - Ensure navigation happens once(guard against race conditions)
*/