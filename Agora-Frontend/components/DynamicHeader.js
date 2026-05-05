import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();

    if (day === 0) return [
        { text: 'Campus on Standby', gradient: ['#E0E7FF', '#C7D2FE'], color: '#3730A3' },
        { text: 'Sukoon...', gradient: ['#D1FAE5', '#A7F3D0'], color: '#065F46' },
        { text: 'Academic Detox', gradient: ['#FCE7F3', '#FBCFE8'], color: '#9F1239' },
        { text: 'Slow Motion Day', gradient: ['#FEF3C7', '#FDE68A'], color: '#92400E' },
        { text: 'Zero Pressure.', gradient: ['#E9D5FF', '#D8B4FE'], color: '#6B21A8' },
        { text: 'Sunday Solitude', gradient: ['#DBEAFE', '#BFDBFE'], color: '#1E40AF' },
    ];

    if (hour < 5) return [
        { text: 'Maggi Break?', gradient: ['#DDD6FE', '#C4B5FD'], color: '#5B21B6' },
        { text: 'Late Night Deals?', gradient: ['#FEF3C7', '#FDE68A'], color: '#92400E' },
        { text: 'One Last Scroll?', gradient: ['#E9D5FF', '#D8B4FE'], color: '#6B21A8' },
        { text: 'Abhi tak jaag rahe ho?', gradient: ['#BFDBFE', '#93C5FD'], color: '#1E40AF' },
    ];

    if (hour < 12) return [
        { text: 'Aaiye Aaiye!', gradient: ['#FEF3C7', '#FDE68A'], color: '#92400E' },
        { text: 'Morning Hustle!', gradient: ['#DBEAFE', '#BFDBFE'], color: '#1E40AF' },
        { text: 'Chalo, Uth Jao!', gradient: ['#FCE7F3', '#FBCFE8'], color: '#9F1239' },
        { text: 'Early Bird Deals?', gradient: ['#D1FAE5', '#A7F3D0'], color: '#065F46' },
        { text: '8 AM Lecture?', gradient: ['#FEF3C7', '#FDE68A'], color: '#92400E' },
    ];

    if (hour < 17) return [
        { text: 'Namaste Ji!', gradient: ['#E0E7FF', '#C7D2FE'], color: '#3730A3' },
        { text: 'Kya Haal Chaal?', gradient: ['#D1FAE5', '#A7F3D0'], color: '#065F46' },
        { text: 'Lecture Bored?', gradient: ['#FED7AA', '#FDBA74'], color: '#9A3412' },
        { text: 'Lunch Break?', gradient: ['#E0E7FF', '#C7D2FE'], color: '#3730A3' },
        { text: 'Arrey Machaa!', gradient: ['#FCE7F3', '#FBCFE8'], color: '#9F1239' },
    ];

    return [
        { text: 'Shaam ki Gedi!', gradient: ['#DDD6FE', '#C4B5FD'], color: '#5B21B6' },
        { text: 'Good Evening!', gradient: ['#BFDBFE', '#93C5FD'], color: '#1E40AF' },
        { text: 'One Last Scroll?', gradient: ['#E9D5FF', '#D8B4FE'], color: '#6B21A8' },
        { text: 'Maggi Break?', gradient: ['#DDD6FE', '#C4B5FD'], color: '#5B21B6' },
        { text: 'Late Night Deals?', gradient: ['#FDE68A', '#FEF3C7'], color: '#92400E' },
    ];
};

const DynamicHeader = () => {
    const messages = getTimeBasedGreeting();
    const [currentIndex, setCurrentIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Shimmer loop
    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, { toValue: 1, duration: 4000, useNativeDriver: true })
        ).start();
    }, []);

    // Pulse loop
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    // Cycle messages
    useEffect(() => {
        const interval = setInterval(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: -30, duration: 600, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 0.9, duration: 600, useNativeDriver: true }),
            ]).start(() => {
                setCurrentIndex(prev => (prev + 1) % messages.length);
                slideAnim.setValue(30);
                scaleAnim.setValue(1.1);
                Animated.parallel([
                    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
                    Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
                    Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
                ]).start();
            });
        }, 15000);
        return () => clearInterval(interval);
    }, [messages.length]);

    const shimmerTranslate = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [-100, 100] });
    const current = messages[currentIndex];

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.gradientWrapper, { transform: [{ scale: pulseAnim }] }]}>
                <LinearGradient colors={current.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
                    <Animated.View style={[styles.shimmer, { transform: [{ translateX: shimmerTranslate }] }]} />
                </LinearGradient>
            </Animated.View>

            <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
                <Text style={[styles.greeting, { color: current.color }]}>{current.text}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 4,
        minHeight: 60,
    },
    gradientWrapper: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        borderRadius: 14,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        borderRadius: 14,
        overflow: 'hidden',
    },
    shimmer: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.4)',
        width: 100,
    },
    textContainer: {
        zIndex: 1,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
        textAlign: 'center',
        paddingVertical: 4,
    },
});

export default DynamicHeader;