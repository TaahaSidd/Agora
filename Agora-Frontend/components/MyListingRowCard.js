import React, {useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Animated, PanResponder} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {getTimeAgo} from '../utils/dateUtils';
import {COLORS} from '../utils/colors';

const MyListingRowCard = ({item, onEdit, onDelete}) => {
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(0)).current;
    const [isSwipeOpen, setIsSwipeOpen] = useState(false);

    if (!item) return null;

    const getStatusInfo = (status) => {
        switch (status) {
            case 'AVAILABLE':
                return {
                    label: 'ACTIVE',
                    gradient: ['#10B981', '#059669'],
                    icon: 'checkmark-circle'
                };
            case 'SOLD':
                return {
                    label: 'SOLD',
                    gradient: ['#EF4444', '#DC2626'],
                    icon: 'cash'
                };
            case 'DEACTIVATED':
                return {
                    label: 'DEACTIVATED',
                    gradient: ['#6B7280', '#4B5563'],
                    icon: 'pause-circle'
                };
            case 'RESERVED':
                return {
                    label: 'RESERVED',
                    gradient: ['#F59E0B', '#D97706'],
                    icon: 'bookmark'
                };
            case 'RENTED':
                return {
                    label: 'RENTED',
                    gradient: ['#3B82F6', '#2563EB'],
                    icon: 'calendar'
                };
            case 'EXCHANGED':
                return {
                    label: 'EXCHANGED',
                    gradient: ['#8B5CF6', '#7C3AED'],
                    icon: 'swap-horizontal'
                };
            default:
                return {
                    label: 'UNKNOWN',
                    gradient: ['#6B7280', '#4B5563'],
                    icon: 'help-circle'
                };
        }
    };

    const statusInfo = getStatusInfo(item.itemStatus);

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) =>
                Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10,
            onPanResponderMove: (_, gesture) => {
                if (gesture.dx < 0) translateX.setValue(Math.max(gesture.dx, -170));
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -70) {
                    setIsSwipeOpen(true);
                    Animated.spring(translateX, {
                        toValue: -170,
                        useNativeDriver: true,
                        tension: 80,
                        friction: 10,
                    }).start();
                } else {
                    setIsSwipeOpen(false);
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 80,
                        friction: 10,
                    }).start();
                }
            },
        })
    ).current;

    const handlePress = () => {
        if (isSwipeOpen) {
            setIsSwipeOpen(false);
            Animated.spring(translateX, {toValue: 0, useNativeDriver: true}).start();
        } else {
            navigation.navigate('ProductDetailsScreen', {item});
        }
    };

    return (
        <View style={styles.container}>
            {/* Swipe Actions */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onEdit}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={styles.actionGradient}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name="create-outline" size={20} color="#fff"/>
                        <Text style={styles.actionText}>Edit</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onDelete}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#EF4444', '#DC2626']}
                        style={styles.actionGradient}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name="trash-outline" size={20} color="#fff"/>
                        <Text style={styles.actionText}>Delete</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Card */}
            <Animated.View style={[styles.card, {transform: [{translateX}]}]} {...panResponder.panHandlers}>
                <TouchableOpacity style={styles.cardContent} onPress={handlePress} activeOpacity={0.85}>
                    {/* Image */}
                    <View style={styles.imageWrapper}>
                        <Image
                            source={item.images?.length ? item.images[0] : require('../assets/LW.jpg')}
                            style={styles.image}
                        />

                        {/* Gradient Overlay */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.5)']}
                            style={styles.imageGradient}
                        />

                        {/* Status Badge */}
                        <View style={styles.statusBadgeContainer}>
                            <LinearGradient
                                colors={statusInfo.gradient}
                                style={styles.statusBadge}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            >
                                <Ionicons name={statusInfo.icon} size={10} color="#fff"/>
                                <Text style={styles.statusText}>{statusInfo.label}</Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentSection}>
                        <Text style={styles.title} numberOfLines={2}>
                            {item.name || item.title || 'Untitled'}
                        </Text>

                        <Text style={styles.price}>
                            {typeof item.price === 'number' ? `₹${item.price}` : item.price}
                        </Text>

                        {/* College */}
                        {item.college && (
                            <View style={styles.infoRow}>
                                <Ionicons name="school-outline" size={13} color={COLORS.dark.textTertiary}/>
                                <Text style={styles.infoText} numberOfLines={1}>
                                    {typeof item.college === 'string'
                                        ? item.college
                                        : item.college?.collegeName || 'College'}
                                </Text>
                            </View>
                        )}

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Ionicons name="time-outline" size={12} color={COLORS.dark.textTertiary}/>
                                <Text style={styles.statText}>
                                    {item.postDate ? getTimeAgo(item.postDate) : 'Recently'}
                                </Text>
                            </View>
                            {item.views && (
                                <>
                                    <View style={styles.statDot}/>
                                    <View style={styles.statItem}>
                                        <Ionicons name="eye-outline" size={12} color={COLORS.dark.textTertiary}/>
                                        <Text style={styles.statText}>{item.views} views</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>

                    <Ionicons name="chevron-forward" size={18} color={COLORS.dark.textTertiary}/>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: 12,
    },
    actionContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 1,
        gap: 8,
    },
    actionButton: {
        width: 75,
        borderRadius: 18,
        height: '100%',
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
        marginTop: 4,
        letterSpacing: 0.2,
    },
    card: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
        overflow: 'hidden',
        zIndex: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    imageWrapper: {
        width: 110,
        height: 110,
        borderRadius: 14,
        overflow: 'hidden',
        marginRight: 14,
        backgroundColor: COLORS.dark.cardElevated,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },
    statusBadgeContainer: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    statusText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    contentSection: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
        lineHeight: 20,
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    price: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 4,
    },
    infoText: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        fontWeight: '600',
        flex: 1,
        letterSpacing: -0.1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    statText: {
        fontSize: 11,
        color: COLORS.dark.textTertiary,
        fontWeight: '600',
        letterSpacing: -0.1,
    },
    statDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: COLORS.dark.textTertiary,
        marginHorizontal: 6,
    },
});

export default MyListingRowCard;