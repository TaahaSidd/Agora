import React from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import {COLORS} from '../utils/colors';
import {formatPrice} from '../utils/formatters';


const {width} = Dimensions.get('window');

export default function NearestCard({item, onPress}) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.85}
        >
            {/* Image Section */}
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
                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.gradientOverlay}
                />

                {/* Status Badge */}
                {item.itemStatus === 'SOLD' && (
                    <View style={styles.soldBadge}>
                        <Text style={styles.soldText}>SOLD</Text>
                    </View>
                )}
            </View>

            {/* Content Section */}
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.name || item.title}
                </Text>

                {/* College/Location */}
                {item.college?.city && (
                    <Text style={styles.location} numberOfLines={1}>
                        {item.college.city}
                    </Text>
                )}

                {/* Price Row */}
                <View style={styles.bottomRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    </View>
                    <View style={styles.arrowCircle}>
                        <Ionicons name="arrow-forward" size={14} color="#fff"/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.90,
        backgroundColor: COLORS.white, // Changed from dark.card
        borderRadius: 20,
        marginBottom: 12,
        marginRight: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        elevation: 2,
    },
    imageContainer: {
        position: 'relative',
        width: 110,
        height: 110,
        borderRadius: 16,
        backgroundColor: COLORS.light.bg, // Changed from dark.cardElevated
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
        height: 40,
    },
    soldBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#EF4444',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    soldText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    textContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.light.text, // Changed from dark.textSecondary
        lineHeight: 21,
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    location: {
        fontSize: 13,
        color: COLORS.light.textSecondary, // Changed from dark.textSecondary
        fontWeight: '500',
        marginBottom: 10,
        letterSpacing: -0.1,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary, // Changed from gray400
        letterSpacing: -0.5,
    },
    viewCount: {
        fontSize: 13,
        color: COLORS.light.textSecondary, // Changed from dark.textSecondary
        fontWeight: '600',
    },
    arrowCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});