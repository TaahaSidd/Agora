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
                    <Text style={styles.price}>{item.price}</Text>
                    <View style={styles.arrowCircle}>
                        <Ionicons name="arrow-forward" size={12} color="#fff"/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        backgroundColor: COLORS.dark.card,
        marginBottom: 12,
        padding: 8,
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
        borderRadius: 14,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 150,
    },
    horizontalImage: {
        height: 130,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
    },
    soldBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
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
        padding: 10,
        paddingTop: 8,
    },
    name: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '700',
        lineHeight: 19,
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
        marginBottom: 8,
        letterSpacing: -0.1,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    price: {
        fontWeight: '800',
        fontSize: 17,
        color: COLORS.gray400,
        letterSpacing: -0.4,
    },
    arrowCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Card;