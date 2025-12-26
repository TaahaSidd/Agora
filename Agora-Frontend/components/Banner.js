import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {Ionicons} from '@expo/vector-icons';
import {THEME} from '../utils/theme';
import {COLORS} from '../utils/colors';

const Banner = ({
                    source,
                    style,
                    onPress,
                    resizeMode = 'cover',
                    borderRadius = 18,
                    height = 160,
                    width = '100%',
                    title,
                    subtitle,
                    showOverlay = true,
                    showBadge = false,
                    badgeText = 'NEW',
                    badgeIcon = 'flame',
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

            {/* Gradient Overlay - Stronger */}
            {showOverlay && (
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.8)']}
                    style={styles.overlay}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                />
            )}

            {/* Badge with Icon */}
            {showBadge && (
                <View style={styles.badgeContainer}>
                    <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={styles.badge}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name={badgeIcon} size={12} color="#fff"/>
                        <Text style={styles.badgeText}>{badgeText}</Text>
                    </LinearGradient>
                </View>
            )}

            {/* Text Content */}
            {(title || subtitle) && (
                <View style={styles.textContainer}>
                    {title && (
                        <Text style={styles.title} numberOfLines={2}>
                            {title}
                        </Text>
                    )}
                    {subtitle && (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    )}
                    {onPress && (
                        <View style={styles.ctaContainer}>
                            <Text style={styles.ctaText}>Explore Now</Text>
                            <View style={styles.arrowCircle}>
                                <Ionicons name="arrow-forward" size={14} color="#fff"/>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    banner: {
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
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
    badgeContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 4,
        shadowColor: '#EF4444',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    textContainer: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 0, height: 2},
        textShadowRadius: 6,
        letterSpacing: -0.4,
        lineHeight: 26,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 3,
        letterSpacing: -0.1,
    },
    ctaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 8,
    },
    ctaText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    arrowCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
});

export default Banner;