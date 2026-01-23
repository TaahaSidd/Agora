import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {COLORS} from '../utils/colors';
import {formatPrice} from '../utils/formatters';


const FeaturedCard = ({item, onPress}) => {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress?.(item)}>
            {/* Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={
                        item.images && item.images.length
                            ? item.images[0]
                            : require('../assets/no-image.jpg')
                    }
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.gradientOverlay}
                />

                {/* Featured Badge */}
                <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>FEATURED</Text>
                </View>

                {/* Category Badge - Bottom Left */}
                {item.category && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
                    </View>
                )}

                {/* Distance Badge - Bottom Right */}
                {item.distance && (
                    <View style={styles.distanceBadge}>
                        <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                )}

                {/* Status Badge (if sold/available) */}
                {item.itemStatus === 'SOLD' && (
                    <View style={styles.soldBadge}>
                        <Text style={styles.soldText}>SOLD</Text>
                    </View>
                )}
            </View>

            {/* Info Section */}
            <View style={styles.info}>
                <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
                <View style={styles.priceRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    </View>
                    <View style={styles.arrowCircle}>
                        <Ionicons name="arrow-forward" size={16} color="#fff"/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 240,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        marginRight: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        elevation: 2,
    },
    imageContainer: {
        width: '100%',
        height: 240,
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    featuredBadge: {
        position: 'absolute',
        top: 14,
        left: 14,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    featuredText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    categoryText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    distanceBadge: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    distanceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    soldBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    soldText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    info: {
        paddingTop: 12,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.light.text, // Changed from dark.textSecondary
        marginBottom: 4,
        lineHeight: 24,
        letterSpacing: -0.3,
    },
    locationText: {
        fontSize: 13,
        color: COLORS.light.textSecondary,
        fontWeight: '500',
        marginBottom: 12,
        letterSpacing: -0.1,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewCount: {
        fontSize: 13,
        color: COLORS.light.textSecondary,
        fontWeight: '600',
    },
    arrowCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FeaturedCard;