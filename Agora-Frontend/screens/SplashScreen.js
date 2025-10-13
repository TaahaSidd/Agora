import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing, Alert, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authApiPost } from '../services/api';
import { COLORS } from '../utils/colors';
import { jwtDecode } from 'jwt-decode';

export default function SplashScreen({ navigation }) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
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

        const timer = setTimeout(async () => {
            try {
                const accessToken = await SecureStore.getItemAsync('accessToken');
                const refreshToken = await SecureStore.getItemAsync('refreshToken');

                if (!accessToken || !refreshToken) {
                    navigation.replace('Login');
                    return;
                }

                const { exp } = jwtDecode(accessToken);
                const jwtExpired = Date.now() >= exp * 1000;

                let validToken = accessToken;

                if (jwtExpired) {
                    try {
                        const res = await authApiPost('/auth/refresh', { refreshToken });
                        validToken = res.jwt;
                    } catch {
                        await SecureStore.deleteItemAsync('accessToken');
                        await SecureStore.deleteItemAsync('refreshToken');
                        navigation.replace('Login');
                        return;
                    }
                }
                navigation.replace('MainLayout');
            } catch (error) {
                console.log('Token validation failed:', error);
                await SecureStore.deleteItemAsync('accessToken');
                await SecureStore.deleteItemAsync('refreshToken');
                Alert.alert(
                    'Network Error',
                    'Unable to verify login. Please check your connection.',
                    [{ text: 'OK', onPress: () => navigation.replace('Login') }]
                );
            }
        }, 3000);

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
            <Text style={styles.tagline}>India's First Student Marketplace</Text>
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
    },
    title: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    tagline: {
        position: 'absolute',
        bottom: 60,
        color: COLORS.white,
        fontSize: 16,
        opacity: 0.8,
        textAlign: 'center',
        width: '100%',
    },
});
