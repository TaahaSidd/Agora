import React, {useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const AnimatedSearchBar = ({onPress}) => {
    const searchTerms = ['books', 'laptops', 'furniture', 'phones', 'bikes', 'textbooks', 'electronics', 'clothing'];

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            Animated.timing(fadeAnim, {
                toValue: 0, duration: 300, useNativeDriver: true,
            }).start(() => {
                // Change text
                setCurrentIndex((prev) => (prev + 1) % searchTerms.length);

                // Fade in
                Animated.timing(fadeAnim, {
                    toValue: 1, duration: 300, useNativeDriver: true,
                }).start();
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (<TouchableOpacity
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
    </TouchableOpacity>);
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.full,
        paddingHorizontal: 14,
        height: 44,
    },
    icon: {
        marginRight: 10,
    },
    placeholderContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
    },
    searchPrefix: {
        fontSize: 15, fontWeight: '500', color: COLORS.dark.textTertiary,
    },
    searchTerm: {
        fontSize: 15, fontWeight: '700', color: COLORS.primary,
    },
});

export default AnimatedSearchBar;