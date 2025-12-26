import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {THEME} from '../utils/theme';
import {COLORS} from '../utils/colors';
import FavoriteButton from './FavoriteButton';

const Card = ({item, horizontal = false}) => {
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);

    const handlePress = () => {
        navigation.navigate('ProductDetailsScreen', {item});
    };

    // Status badge colors
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
            style={[styles.card, horizontal ? styles.horizontalCard : styles.gridCard]}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={item.images && item.images.length ? item.images[0] : require('../assets/LW.jpg')}
                    style={[styles.image, horizontal && styles.horizontalImage]}
                />

                {/* Gradient Overlay - subtle */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)']}
                    style={styles.gradientOverlay}
                />

                {/* Status Badge */}
                {statusBadge && (
                    <View style={[styles.statusBadge, {backgroundColor: statusBadge.bg}]}>
                        <Ionicons name={statusBadge.icon} size={10} color="#fff"/>
                        <Text style={styles.statusText}>{statusBadge.text}</Text>
                    </View>
                )}

                {/* Favorite Button */}
                <FavoriteButton
                    listingId={item.id}
                    isFavorite={isFavorite}
                    onToggle={setIsFavorite}
                    size={THEME.iconSize.md}
                />
            </View>

            <View style={styles.info}>
                {/* Title */}
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>

                {/* Price & Arrow */}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.price}</Text>
                </View>

                {/* Location - only if exists */}
                {item.college?.city && (
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={11} color={COLORS.dark.textTertiary}/>
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
        borderRadius: 16,
        backgroundColor: COLORS.dark.card,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    gridCard: {
        width: '48%',
    },
    horizontalCard: {
        width: 160,
        marginRight: 12,
    },
    imageWrapper: {
        position: 'relative',
        backgroundColor: COLORS.dark.cardElevated,
    },
    image: {
        width: '100%',
        height: 140,
    },
    horizontalImage: {
        height: 120,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 3,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
    info: {
        padding: 12,
    },
    name: {
        fontSize: 14,
        color: COLORS.dark.text,
        fontWeight: '700',
        lineHeight: 19,
        marginBottom: 6,
        letterSpacing: -0.2,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    price: {
        fontWeight: '800',
        fontSize: 17,
        color: COLORS.primary,
        letterSpacing: -0.3,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    locationText: {
        fontSize: 11,
        color: COLORS.dark.textTertiary,
        fontWeight: '600',
        flex: 1,
        letterSpacing: -0.1,
    },
});

export default Card;