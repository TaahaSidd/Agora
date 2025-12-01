import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');

export default function NearestCard({ item, onPress }) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
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
                {/* Condition Badge */}
                {/* {item.itemCondition && (
                    <View style={styles.conditionBadge}>
                        <Text style={styles.conditionText}>{item.itemCondition}</Text>
                    </View>
                )} */}
            </View>

            {/* Content Section */}
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.name || item.title}
                </Text>

                {/* Location with icon */}
                <View style={styles.locationRow}>
                    <Icon name="location" size={14} color="#9CA3AF" />
                    <Text style={styles.location} numberOfLines={1}>
                        {item.college?.city || item.college?.collegeName || 'Nearby'}
                    </Text>
                </View>

                {/* Bottom row with price and verified badge */}
                <View style={styles.bottomRow}>
                    <Text style={styles.price}>{item.price}</Text>
                    {/* <View style={styles.verifiedBadge}>
                        <Icon name="shield-checkmark" size={12} color="#10B981" />
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View> */}
                </View>
            </View>

            {/* Arrow indicator */}
            <Icon name="chevron-forward" size={20} color="#D1D5DB" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.90,
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        marginRight: 16,
        padding: 12,
        elevation: 1,
    },
    imageContainer: {
        position: 'relative',
        width: 90,
        height: 90,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
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
        lineHeight: 22,
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    location: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        marginLeft: 5,
        fontWeight: '500',
        flex: 1,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: -0.3,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    verifiedText: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '700',
        marginLeft: 4,
    },
});