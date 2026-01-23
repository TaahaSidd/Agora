import React, {useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'expo-linear-gradient';

import {THEME} from '../utils/theme';
import {COLORS} from '../utils/colors';
import {formatPrice} from '../utils/formatters';

import FavoriteButton from './FavoriteButton';

const Card = ({item, horizontal = false, showToast}) => {
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);

    const handlePress = () => {
        navigation.navigate('ProductDetailsScreen', {item});
    };

    const handleGuestFavorite = () => {
        if (showToast) {
            showToast({
                type: 'info',
                title: 'Save for later?',
                message: 'Sign up to keep track of your favorite items!'
            });
        }
    };

    return (
        <TouchableOpacity
            style={[styles.card, horizontal ? styles.horizontalCard : styles.gridCard]}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={item.images && item.images.length ? item.images[0] : require('../assets/no-image.jpg')}
                    style={[styles.image, horizontal && styles.horizontalImage]}
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

                {/* Favorite Button */}
                <FavoriteButton
                    listingId={item.id}
                    isFavorite={isFavorite}
                    onToggle={setIsFavorite}
                    size={THEME.iconSize.md}
                    onGuestPress={handleGuestFavorite}
                />
            </View>

            <View style={styles.info}>
                {/* Title */}
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>

                {/*/!* Location - only if exists *!/*/}
                {/*{item.college?.city && (*/}
                {/*    <Text style={styles.locationText} numberOfLines={1}>*/}
                {/*        {item.college.city}*/}
                {/*    </Text>*/}
                {/*)}*/}

                {/* Price & Arrow */}
                <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                    {/*<View style={styles.arrowCircle}>*/}
                    {/*    <Ionicons name="arrow-forward" size={12} color="#fff"/>*/}
                    {/*</View>*/}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        backgroundColor: COLORS.white,
        marginBottom: 16,
        padding: 8,
        borderWidth: 1.5,
        borderColor: COLORS.light.border,
        elevation: 2,
    },
    gridCard: {
        width: '48.5%',
    },
    horizontalCard: {
        width: 170,
        marginRight: 14,
    },
    imageWrapper: {
        position: 'relative',
        backgroundColor: COLORS.light.bg,
        borderRadius: 14,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 155,
    },
    horizontalImage: {
        height: 135,
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
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 2,
    },
    soldText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
    info: {
        padding: 6,
        paddingTop: 8,
    },
    name: {
        fontSize: 14,
        color: COLORS.light.text,
        fontWeight: '700',
        lineHeight: 18,
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 'auto',
    },
    price: {
        fontWeight: '900',
        fontSize: 16,
        color: COLORS.primary,
        letterSpacing: -0.3,
    },
});

export default Card;