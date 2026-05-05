import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const SEARCH_TERMS = ['"books"', '"laptops"', '"furniture"', '"phones"', '"bikes"', '"textbooks"', '"electronics"', '"clothing"'];

const AnimatedSearchBar = ({ onPress }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex(prev => (prev + 1) % SEARCH_TERMS.length);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Ionicons name="search" size={16} color={COLORS.gray400} style={styles.icon} />
            <View style={styles.placeholder}>
                <Text style={styles.prefix}>Search for </Text>
                <Animated.Text style={[styles.term, { opacity: fadeAnim }]}>
                    {SEARCH_TERMS[currentIndex]}
                </Animated.Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        elevation: 1,
    },
    icon: {
        marginRight: 10,
    },
    placeholder: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    prefix: {
        fontSize: 14,
        fontWeight: '400',
        color: COLORS.gray400,
    },
    term: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        letterSpacing: -0.2,
    },
});

export default AnimatedSearchBar;