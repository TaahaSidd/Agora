import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const AnimatedSearchBar = ({onPress}) => {
    const searchTerms = ['"books"', '"laptops"', '"furniture"', '"phones"', '"bikes"', '"textbooks"', '"electronics"', '"clothing"'];

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex((prev) => (prev + 1) % searchTerms.length);

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
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Ionicons
                name="search"
                size={20}
                color={COLORS.dark.textTertiary}
                style={styles.icon}
            />

            <View style={styles.placeholderContainer}>
                <Text style={styles.searchPrefix}>Search for </Text>
                <Animated.Text
                    style={[styles.searchTerm, {opacity: fadeAnim}]}
                >
                    {searchTerms[currentIndex]}
                </Animated.Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#0A0A0A',
        borderRadius: THEME.borderRadius.full,
        paddingHorizontal: 18,
        paddingVertical: 16,
        minHeight: 56,
        borderWidth: 1.5,
        borderColor: '#1A1A1A',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },

    icon: {
        marginRight: 14,
    },

    placeholderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    searchPrefix: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.dark.textTertiary,
        letterSpacing: -0.2,
    },

    searchTerm: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.3,
    },
});

export default AnimatedSearchBar;