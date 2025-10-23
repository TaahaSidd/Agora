import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const { width } = Dimensions.get('window');

const ReferralBanner = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={{ marginVertical: 10 }}>
            <LinearGradient
                colors={['#c670ffff', '#3effd5ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.banner}
            >
                <Text style={styles.title}>Upload your first listing</Text>
                <Text style={styles.subtitle}>Get ₹50 instantly!</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    banner: {
        width: width * 0.9,
        height: 80,
        borderRadius: THEME.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
    },
    subtitle: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 5,
    },
});

export default ReferralBanner;
