import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const SafetyBanner = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.container}
        >
            <LinearGradient
                colors={['#4F46E5', '#6366F1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.banner}
            >
                <View style={styles.decorCircle} />

                <View style={styles.content}>
                    <View style={styles.iconWrapper}>
                        <Ionicons name="shield-checkmark" size={20} color="#4F46E5" />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Trade Safely on Campus</Text>
                        <Text style={styles.subtitle} numberOfLines={1}>
                            Meet in public spots like the Canteen or Library
                        </Text>
                    </View>

                    <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.7)" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    banner: {
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderRadius: 16,
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.07)',
        top: -35,
        right: -35,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: -0.1,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 12,
        marginTop: 2,
    },
});

export default SafetyBanner;