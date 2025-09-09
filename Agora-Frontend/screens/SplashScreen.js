import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/colors';

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

        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigation.replace('Explore');
            } else {
                navigation.replace('Login');
            }
        };

        const timer = setTimeout(checkAuth, 2500);

        return () => clearTimeout(timer);
    }, []);

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


//currently splash screen is not showing when opening app. -- fix thiss
