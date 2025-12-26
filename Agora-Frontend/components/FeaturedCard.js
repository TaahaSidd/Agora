import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {THEME} from '../utils/theme';
import {COLORS} from '../utils/colors';

const FeaturedCard = ({item, onPress}) => {
    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress?.(item)}>
            {/* Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={
                        item.images && item.images.length
                            ? item.images[0]
                            : require('../assets/LW.jpg')
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
                    <Ionicons name="star" size={12} color="#FCD34D"/>
                    <Text style={styles.featuredText}>Featured</Text>
                </View>

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
                    <Text style={styles.price}>{item.price}</Text>
                    <View style={styles.arrowCircle}>
                        <Ionicons name="arrow-forward" size={14} color={COLORS.primary}/>
                    </View>
                </View>

                {/* Location/College */}
                {item.college?.city && (
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={12} color={COLORS.dark.textTertiary}/>
                        <Text style={styles.locationText} numberOfLines={1}>
                            {item.college.city}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 220,
        borderRadius: 18,
        backgroundColor: COLORS.dark.card,
        marginRight: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    imageContainer: {
        width: '100%',
        height: 180,
        position: 'relative',
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
        height: 60,
    },
    featuredBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    featuredText: {
        color: '#FCD34D',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    soldBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
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
    info: {
        padding: 14,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 8,
        lineHeight: 20,
        letterSpacing: -0.2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.3,
    },
    arrowCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primaryLightest,
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        fontWeight: '600',
        flex: 1,
        letterSpacing: -0.1,
    },
});

export default FeaturedCard;