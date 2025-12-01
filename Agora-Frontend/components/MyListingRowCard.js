import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTimeAgo } from '../utils/dateUtils';
import { COLORS } from '../utils/colors';

const MyListingRowCard = ({ item, onEdit, onDelete }) => {
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(0)).current;
    const [isSwipeOpen, setIsSwipeOpen] = useState(false);

    if (!item) return null;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'AVAILABLE': return { label: 'ACTIVE', style: styles.activeBadge };
            case 'SOLD': return { label: 'SOLD', style: styles.soldBadge };
            case 'DEACTIVATED': return { label: 'DEACTIVATED', style: styles.deactivatedBadge };
            case 'RESERVED': return { label: 'RESERVED', style: styles.reservedBadge };
            case 'RENTED': return { label: 'RENTED', style: styles.rentedBadge };
            case 'EXCHANGED': return { label: 'EXCHANGED', style: styles.exchangedBadge };
            default: return { label: 'UNKNOWN', style: styles.unknownBadge };
        }
    };

    const { label: statusLabel, style: statusStyle } = getStatusInfo(item.itemStatus);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) =>
                Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dx < 0) translateX.setValue(Math.max(gesture.dx, -180));
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -80) {
                    setIsSwipeOpen(true);
                    Animated.spring(translateX, { toValue: -180, useNativeDriver: true }).start();
                } else {
                    setIsSwipeOpen(false);
                    Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
                }
            },
        })
    ).current;

    const handlePress = () => {
        if (isSwipeOpen) {
            setIsSwipeOpen(false);
            Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        } else {
            navigation.navigate('ProductDetailsScreen', { item });
        }
    };

    return (
        <View style={styles.container}>
            {/* Swipe Actions */}
            <View style={styles.actionContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={onEdit}>
                    <Icon name="create-outline" size={22} color="#fff" />
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
                    <Icon name="trash-outline" size={22} color="#fff" />
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>

            {/* Card */}
            <Animated.View style={[styles.card, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
                <TouchableOpacity style={styles.cardContent} onPress={handlePress} activeOpacity={0.7}>
                    {/* Image */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={item.images?.length ? item.images[0] : require('../assets/LW.jpg')}
                            style={styles.image}
                        />
                        <View style={[styles.statusBadge, statusStyle]}>
                            <Text style={styles.statusText}>{statusLabel}</Text>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentSection}>
                        <View style={styles.topRow}>
                            <Text style={styles.title} numberOfLines={1}>
                                {item.name || item.title || 'Untitled'}
                            </Text>
                        </View>

                        <Text style={styles.price}>
                            {typeof item.price === 'number' ? `₹${item.price}` : item.price}
                        </Text>

                        {/* College */}
                        {item.college && (
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Icon name="school-outline" size={14} color="#9CA3AF" />
                                    <Text style={styles.infoText} numberOfLines={1}>
                                        {item.college.collegeName || item.college}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Time */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Icon name="time-outline" size={14} color="#6B7280" />
                                <Text style={styles.statText}>
                                    {item.postDate ? getTimeAgo(item.postDate) : 'Recently'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Icon name="chevron-forward" size={20} style={styles.arrowIcon} />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { position: 'relative', marginBottom: 12 },
    actionContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 1,
        gap: 6,
    },
    actionButton: { width: 80, height: '100%', justifyContent: 'center', alignItems: 'center' },
    editButton: { backgroundColor: COLORS.primary, borderRadius: 16 },
    deleteButton: { backgroundColor: COLORS.error, borderRadius: 16 },
    actionText: { color: COLORS.white, fontSize: 12, fontWeight: '700', marginTop: 4 },
    card: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        elevation: 1,
        overflow: 'hidden',
        zIndex: 2,
    },
    cardContent: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    imageWrapper: {
        width: 100,
        height: 100,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 14,
        backgroundColor: COLORS.dark.bgElevated,
        position: 'relative',
    },
    image: { width: '100%', height: '100%' },
    statusBadge: { position: 'absolute', top: 6, left: 6, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    statusText: { color: COLORS.white, fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
    activeBadge: { backgroundColor: COLORS.success },
    soldBadge: { backgroundColor: COLORS.danger },
    deactivatedBadge: { backgroundColor: COLORS.dark.textTertiary },
    reservedBadge: { backgroundColor: COLORS.warning },
    rentedBadge: { backgroundColor: COLORS.info },
    exchangedBadge: { backgroundColor: COLORS.secondary },
    unknownBadge: { backgroundColor: COLORS.dark.textTertiary },

    contentSection: { flex: 1 },
    topRow: { marginBottom: 6 },
    title: { fontSize: 16, fontWeight: '700', color: COLORS.dark.text, lineHeight: 22 },
    price: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    infoItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    infoText: { fontSize: 12, color: COLORS.dark.textTertiary, marginLeft: 5, fontWeight: '500' },
    statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statText: { fontSize: 11, color: COLORS.dark.textTertiary, fontWeight: '600' },
    arrowIcon: { marginLeft: 8, color: COLORS.dark.textQuaternary },
});

export default MyListingRowCard;
