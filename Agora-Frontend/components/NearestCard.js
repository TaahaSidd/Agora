import React from 'react';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {formatPrice} from '../utils/formatters';

const {width} = Dimensions.get('window');

export default function NewListingCard({item, onPress}) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Image */}
            <View style={styles.imageWrapper}>
                <Image
                    source={item.images?.length ? item.images[0] : require('../assets/no-image.jpg')}
                    style={styles.image}
                    resizeMode="cover"
                />
                {item.itemStatus === 'SOLD' && (
                    <View style={styles.soldBadge}>
                        <Text style={styles.soldText}>SOLD</Text>
                    </View>
                )}
                <View style={styles.newBadge}>
                    <View style={styles.newDot}/>
                    <Text style={styles.newText}>NEW</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{item.name || item.title}</Text>

                {item.category && (
                    <View style={styles.categoryPill}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                )}

                {item.college?.name && (
                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={11} color={COLORS.gray400}/>
                        <Text style={styles.location} numberOfLines={1}>{item.college.name}</Text>
                    </View>
                )}

                <View style={styles.bottomRow}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    <View style={styles.arrowBtn}>
                        <Ionicons name="arrow-forward" size={13} color={COLORS.white}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',  // ← top aligned
        width: width * 0.88,
        marginRight: 12,
        marginBottom: 4,
    },

    // Image
    imageWrapper: {
        width: 105,
        height: 105,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: COLORS.gray100,
        flexShrink: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    soldBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: COLORS.error,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
    },
    soldText: {
        color: COLORS.white,
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.4,
    },
    newBadge: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
    },
    newDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    newText: {
        color: COLORS.white,
        fontSize: 8,
        fontWeight: '700',
        letterSpacing: 0.4,
    },

    // Content
    content: {
        flex: 1,
        marginLeft: 12,
        gap: 5,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        lineHeight: 18,
    },
    categoryPill: {
        alignSelf: 'flex-start',
        backgroundColor: `${COLORS.primary}12`,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    location: {
        fontSize: 11,
        color: COLORS.gray400,
        flex: 1,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.4,
    },
    arrowBtn: {
        width: 28,
        height: 28,
        borderRadius: 9,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});