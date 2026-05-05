import React, { useRef, useState } from 'react';
import { Animated, Image, Platform, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getTimeAgo } from '../utils/dateUtils';
import { COLORS } from '../utils/colors';
import { formatPrice } from '../utils/formatters';

const STATUS_MAP = {
    AVAILABLE: { label: 'Active', color: '#10B981' },
    SOLD: { label: 'Sold', color: COLORS.error },
    DEACTIVATED: { label: 'Deactivated', color: COLORS.gray400 },
    RESERVED: { label: 'Reserved', color: '#F59E0B' },
    RENTED: { label: 'Rented', color: '#3B82F6' },
    EXCHANGED: { label: 'Exchanged', color: '#8B5CF6' },
};

const SWIPE_THRESHOLD = 70;
const SWIPE_OPEN = -160;

const MyListingRowCard = ({ item, onEdit, onDelete }) => {
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(0)).current;
    const [isSwipeOpen, setIsSwipeOpen] = useState(false);

    if (!item) return null;

    const status = STATUS_MAP[item.itemStatus] || { label: 'Unknown', color: COLORS.gray400 };

    const panResponder = useRef(PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
        onPanResponderMove: (_, g) => {
            if (g.dx < 0) translateX.setValue(Math.max(g.dx, SWIPE_OPEN));
        },
        onPanResponderRelease: (_, g) => {
            const open = g.dx < -SWIPE_THRESHOLD;
            setIsSwipeOpen(open);
            Animated.spring(translateX, {
                toValue: open ? SWIPE_OPEN : 0,
                useNativeDriver: true,
                tension: 80,
                friction: 10,
            }).start();
        },
    })).current;

    const handlePress = () => {
        if (isSwipeOpen) {
            setIsSwipeOpen(false);
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        } else {
            navigation.navigate('ProductDetailsScreen', { item });
        }
    };

    const imageSource = item.images?.length
        ? (typeof item.images[0] === 'string' ? { uri: item.images[0] } : item.images[0])
        : require('../assets/no-image.jpg');

    return (
        <View style={styles.container}>
            {/* Card row */}
            <View style={styles.card}>
                <View style={styles.imageWrapper}>
                    <Image source={imageSource} style={styles.image} resizeMode="cover" />
                    <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>{status.label}</Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={2}>
                        {item.name || item.title || 'Untitled'}
                    </Text>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={11} color={COLORS.gray400} />
                        <Text style={styles.timeText}>
                            {item.postDate ? getTimeAgo(item.postDate) : 'Recent'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action bar below */}
            <View style={styles.actionBar}>
                <TouchableOpacity style={styles.editAction} onPress={onEdit} activeOpacity={0.7}>
                    <Ionicons name="create-outline" size={14} color={COLORS.info} />
                    <Text style={[styles.actionLabel, { color: COLORS.info }]}>Edit</Text>
                </TouchableOpacity>
                <View style={styles.actionDivider} />
                <TouchableOpacity style={styles.deleteAction} onPress={onDelete} activeOpacity={0.7}>
                    <Ionicons name="trash-outline" size={14} color={COLORS.error} />
                    <Text style={[styles.actionLabel, { color: COLORS.error }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        overflow: 'hidden',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 10,
        gap: 12,
    },
    actionBar: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.gray100,
    },
    editAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
    },
    deleteAction: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
    },
    actionDivider: {
        width: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.gray100,
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Swipe actions
    actions: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 1,
        gap: 6,
        paddingRight: 4,
    },
    editBtn: {
        width: 70,
        height: '100%',
        borderRadius: 14,
        backgroundColor: COLORS.info,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    deleteBtn: {
        width: 70,
        height: '100%',
        borderRadius: 14,
        backgroundColor: COLORS.error,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    actionText: {
        color: COLORS.white,
        fontSize: 11,
        fontWeight: '600',
    },

    // // Card — matches Cards component
    // card: {
    //     backgroundColor: COLORS.white,
    //     borderRadius: 16,
    //     borderWidth: 1,
    //     borderColor: COLORS.gray100,
    //     zIndex: 2,
    //     ...Platform.select({
    //         ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8 },
    //         android: { elevation: 1 },
    //     }),
    // },
    // cardContent: {
    //     flexDirection: 'row',
    //     alignItems: 'flex-start', padding: 10,
    //     gap: 12,
    // },

    // Image — matches Cards component
    imageWrapper: {
        width: 90,
        height: 90,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: COLORS.gray100,
    },
    image: {
        width: '100%',
        height: '100%',
    },

    // Status badge — exact same as Cards og tag
    statusBadge: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 6,
    },
    statusDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: COLORS.white,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '700',
        color: COLORS.white,
        letterSpacing: 0.3,
    },

    // Content
    content: {
        flex: 1,
        gap: 4,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        lineHeight: 18,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.3,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 11,
        color: COLORS.gray400,
    },
});

export default MyListingRowCard;