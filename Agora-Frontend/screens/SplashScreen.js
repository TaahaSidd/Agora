import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/colors';

const BASE_URL = "http://10.0.2.2:9000/Agora/Token";

export default function SplashScreen({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 1️⃣ Start splash animation
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 1200,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
        ]).start();

        // 2️⃣ After splash delay, check token
        const timer = setTimeout(async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                if (!token) {
                    // No token → Login
                    navigation.replace('Login');
                    return;
                }

                // 3️⃣ Validate token with backend
                const response = await fetch(`${BASE_URL}/validate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    // Valid token → Explore
                    navigation.replace('MainLayout');
                } else {
                    // Invalid/expired token → remove and go to Login
                    await AsyncStorage.removeItem('token');
                    navigation.replace('Login');
                }
            } catch (error) {
                // Network/server error
                console.log('Token validation failed:', error);
                await AsyncStorage.removeItem('token');
                Alert.alert(
                    'Network Error',
                    'Unable to verify login. Please check your connection.',
                    [{ text: 'OK', onPress: () => navigation.replace('Login') }]
                );
            }
        }, 2500); // 2.5s splash

        return () => clearTimeout(timer);
    }, [navigation, scaleAnim, opacityAnim]);

    return (
        <View style={styles.container}>
            <Animated.Text
                style={[
                    styles.title,
                    { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
                ]}
            >
                Agora
            </Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.darkBlue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});
