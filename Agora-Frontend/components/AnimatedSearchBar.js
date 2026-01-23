import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
                color={COLORS.light.textTertiary}
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
        // Switched from #0A0A0A to your white/elevated color
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.full,
        paddingHorizontal: 18,
        paddingVertical: 14, // Slightly tighter to match modern light UI
        minHeight: 52,
        // Using your light border color
        borderWidth: 1.5,
        borderColor: COLORS.light.border,
        // Softened the shadow for white mode
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    icon: {
        marginRight: 12,
        // Changed to light mode text color
        color: COLORS.light.textTertiary,
    },

    placeholderContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },

    searchPrefix: {
        fontSize: 15,
        fontWeight: '500',
        // Changed to light mode text secondary
        color: COLORS.light.textSecondary,
        letterSpacing: -0.2,
    },

    searchTerm: {
        fontSize: 15,
        fontWeight: '700', // Matches your AddListing label weight
        color: COLORS.primary,
        letterSpacing: -0.3,
    },
});

export default AnimatedSearchBar;