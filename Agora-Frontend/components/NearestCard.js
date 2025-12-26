import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {COLORS} from '../utils/colors';

const {width} = Dimensions.get('window');

export default function NearestCard({item, onPress}) {
    // Status badge logic
    const getStatusBadge = () => {
        if (item.itemStatus === 'SOLD') {
            return {bg: '#EF4444', text: 'Sold', icon: 'checkmark-circle'};
        }
        if (item.itemCondition === 'NEW' || item.itemCondition === 'new') {
            return {bg: '#10B981', text: 'New', icon: 'sparkles'};
        }
        return null;
    };

    const statusBadge = getStatusBadge();

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
                            : require('../assets/LW.jpg')
                    }
                    style={styles.image}
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                    style={styles.gradientOverlay}
                />

                {/* Status Badge */}
                {statusBadge && (
                    <View style={[styles.statusBadge, {backgroundColor: statusBadge.bg}]}>
                        <Ionicons name={statusBadge.icon} size={10} color="#fff"/>
                        <Text style={styles.statusText}>{statusBadge.text}</Text>
                    </View>
                )}

                {/* Distance Badge */}
                <View style={styles.distanceBadge}>
                    <Ionicons name="location" size={10} color="#fff"/>
                    <Text style={styles.distanceText}>2.5 km</Text>
                </View>
            </View>

            {/* Content Section */}
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.name || item.title}
                </Text>

                {/* College/Location */}
                <View style={styles.locationRow}>
                    <Ionicons name="school-outline" size={13} color={COLORS.dark.textTertiary}/>
                    <Text style={styles.location} numberOfLines={1}>
                        {item.college?.collegeName || item.college?.city || 'Nearby'}
                    </Text>
                </View>

                {/* Price Row */}
                <View style={styles.bottomRow}>
                    <Text style={styles.price}>{item.price}</Text>
                    <View style={styles.arrowCircle}>
                        <Ionicons name="arrow-forward" size={14} color={COLORS.primary}/>
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
        backgroundColor: COLORS.dark.card,
        borderRadius: 18,
        marginRight: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    imageContainer: {
        position: 'relative',
        width: 100,
        height: 100,
        borderRadius: 14,
        backgroundColor: COLORS.dark.cardElevated,
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
        height: 35,
    },
    statusBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
        gap: 3,
    },
    statusText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    distanceBadge: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 3,
    },
    distanceText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: -0.1,
    },
    textContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.dark.text,
        lineHeight: 21,
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 4,
    },
    location: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        fontWeight: '600',
        flex: 1,
        letterSpacing: -0.1,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 19,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.4,
    },
    arrowCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primaryLightest,
        alignItems: 'center',
        justifyContent: 'center',
    },
});