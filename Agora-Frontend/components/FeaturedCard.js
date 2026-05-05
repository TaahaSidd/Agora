import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {COLORS} from '../utils/colors';
import {formatPrice} from '../utils/formatters';

const FeaturedCard = ({item, onPress}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => onPress?.(item)}
        >
            {/* Image */}
            <View style={styles.imageWrapper}>
                <Image
                    source={item.images?.length ? item.images[0] : require('../assets/no-image.jpg')}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Bottom gradient for text readability */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.55)']}
                    style={styles.gradient}
                />

                {/* Featured badge */}
                <View style={styles.featuredBadge}>
                    <Ionicons name="star" size={9} color="#fff"/>
                    <Text style={styles.featuredText}>FEATURED</Text>
                </View>

                {/* Sold badge */}
                {item.itemStatus === 'SOLD' && (
                    <View style={styles.soldBadge}>
                        <Text style={styles.soldText}>SOLD</Text>
                    </View>
                )}

                {/* Category — bottom left on image */}
                {item.category && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                )}
            </View>

            {/* Info */}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    <View style={styles.arrowBtn}>
                        <Ionicons name="arrow-forward" size={14} color={COLORS.white}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 220,
        marginRight: 12,
    },

    // Image
    imageWrapper: {
        width: '100%',
        height: 260,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: COLORS.gray100,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },

    // Badges
    featuredBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    featuredText: {
        color: COLORS.white,
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    soldBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    soldText: {
        color: COLORS.white,
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    categoryText: {
        color: COLORS.light.text,
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },

    // Info
    info: {
        paddingTop: 8,
        paddingHorizontal: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.4,
    },
    arrowBtn: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FeaturedCard;