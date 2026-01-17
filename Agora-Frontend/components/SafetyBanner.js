import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';

const SafetyBanner = ({onPress}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={styles.container}
        >
            <LinearGradient
                // Changed to a trustworthy Indigo/Blue theme
                colors={['#4F46E5', '#3730A3']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.banner}
            >
                {/* Decorative circle remains for visual depth */}
                <View style={styles.decorCircle}/>

                <View style={styles.content}>
                    {/* Left - Icon & Text */}
                    <View style={styles.leftSection}>
                        <View style={styles.iconCircle}>
                            {/* Changed to Shield icon */}
                            <Ionicons name="shield-checkmark" size={22} color="#4F46E5"/>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.title}>Trade Safely on Campus</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>
                                Meet in public spots like the Canteen or Library
                            </Text>
                        </View>
                    </View>

                    {/* Right - Chevron */}
                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.8)"/>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    banner: {
        width: '100%',
        height: 75,
        borderRadius: 16,
        padding: 14,
        position: 'relative',
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#4F46E5',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    decorCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        top: -30,
        right: -30,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 12, // Switched to slightly rounded square for a modern look
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 12,
        fontWeight: '400',
        marginTop: 2,
    },
});

export default SafetyBanner;