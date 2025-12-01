import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';

const Banner = ({
    source,
    style,
    onPress,
    resizeMode = 'cover',
    borderRadius = 20,
    height = 180,
    width = '100%',
    title,
    subtitle,
    showOverlay = true,
    showBadge = false,
    badgeText = 'NEW',
}) => {
    const bannerStyle = [
        styles.banner,
        {
            borderRadius,
            height,
            width,
        },
        style
    ];

    const content = (
        <View style={bannerStyle}>
            {/* Main Image */}
            <Image
                source={source}
                style={styles.image}
                resizeMode={resizeMode}
            />

            {/* Gradient Overlay */}
            {showOverlay && (
                <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                    style={styles.overlay}
                />
            )}

            {/* Badge */}
            {showBadge && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{badgeText}</Text>
                </View>
            )}

            {/* Text Content */}
            {(title || subtitle) && (
                <View style={styles.textContainer}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    {onPress && (
                        <View style={styles.ctaContainer}>
                            <Text style={styles.ctaText}>Learn More</Text>
                            <Ionicons name="arrow-forward" size={16} color="#fff" />
                        </View>
                    )}
                </View>
            )}

            {/* Decorative Elements */}
            <View style={styles.decorCircle1} />
            <View style={styles.decorCircle2} />
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.touchable}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    touchable: {
        marginBottom: 20,
    },
    banner: {
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    badge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    textContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        letterSpacing: -0.3,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.95)',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    ctaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 4,
    },
    ctaText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 6,
    },
    decorCircle1: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        top: -30,
        right: -20,
    },
    decorCircle2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        bottom: -20,
        left: -30,
    },
});

export default Banner;