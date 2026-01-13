// import React from 'react';
// import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
// import {Ionicons} from '@expo/vector-icons';
// import {LinearGradient} from 'expo-linear-gradient';
// import {THEME} from '../utils/theme';
// import {COLORS} from '../utils/colors';
//
// const FeaturedCard = ({item, onPress}) => {
//     return (
//         <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={() => onPress?.(item)}>
//             {/* Image Container */}
//             <View style={styles.imageContainer}>
//                 <Image
//                     source={
//                         item.images && item.images.length
//                             ? item.images[0]
//                             : require('../assets/LW.jpg')
//                     }
//                     style={styles.image}
//                     resizeMode="cover"
//                 />
//
//                 {/* Gradient Overlay */}
//                 <LinearGradient
//                     colors={['transparent', 'rgba(0,0,0,0.7)']}
//                     style={styles.gradientOverlay}
//                 />
//
//                 {/* Featured Badge */}
//                 <View style={styles.featuredBadge}>
//                     <Ionicons name="star" size={12} color="#FCD34D"/>
//                     <Text style={styles.featuredText}>Featured</Text>
//                 </View>
//
//                 {/* Status Badge (if sold/available) */}
//                 {item.itemStatus === 'SOLD' && (
//                     <View style={styles.soldBadge}>
//                         <Text style={styles.soldText}>SOLD</Text>
//                     </View>
//                 )}
//             </View>
//
//             {/* Info Section */}
//             <View style={styles.info}>
//                 <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
//
//                 <View style={styles.priceRow}>
//                     <Text style={styles.price}>{item.price}</Text>
//                     <View style={styles.arrowCircle}>
//                         <Ionicons name="arrow-forward" size={14} color={COLORS.primary}/>
//                     </View>
//                 </View>
//
//                 {/* Location/College */}
//                 {item.college?.city && (
//                     <View style={styles.locationRow}>
//                         <Ionicons name="location-outline" size={12} color={COLORS.dark.textTertiary}/>
//                         <Text style={styles.locationText} numberOfLines={1}>
//                             {item.college.city}
//                         </Text>
//                     </View>
//                 )}
//             </View>
//         </TouchableOpacity>
//     );
// };
//
// const styles = StyleSheet.create({
//     card: {
//         width: 220,
//         borderRadius: 18,
//         backgroundColor: COLORS.dark.card,
//         marginRight: 16,
//         overflow: 'hidden',
//         borderWidth: 1,
//         borderColor: COLORS.dark.border,
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 4},
//         shadowOpacity: 0.15,
//         shadowRadius: 8,
//         elevation: 4,
//     },
//     imageContainer: {
//         width: '100%',
//         height: 180,
//         position: 'relative',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//     },
//     gradientOverlay: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 60,
//     },
//     featuredBadge: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.7)',
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 12,
//         gap: 4,
//     },
//     featuredText: {
//         color: '#FCD34D',
//         fontSize: 11,
//         fontWeight: '700',
//         letterSpacing: 0.3,
//     },
//     soldBadge: {
//         position: 'absolute',
//         top: 10,
//         left: 10,
//         backgroundColor: '#EF4444',
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 8,
//     },
//     soldText: {
//         color: '#fff',
//         fontSize: 11,
//         fontWeight: '800',
//         letterSpacing: 0.5,
//     },
//     info: {
//         padding: 14,
//     },
//     title: {
//         fontSize: 15,
//         fontWeight: '700',
//         color: COLORS.dark.text,
//         marginBottom: 8,
//         lineHeight: 20,
//         letterSpacing: -0.2,
//     },
//     priceRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 8,
//     },
//     price: {
//         fontSize: 18,
//         fontWeight: '800',
//         color: COLORS.primary,
//         letterSpacing: -0.3,
//     },
//     arrowCircle: {
//         width: 28,
//         height: 28,
//         borderRadius: 14,
//         backgroundColor: COLORS.primaryLightest,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     locationRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 4,
//     },
//     locationText: {
//         fontSize: 12,
//         color: COLORS.dark.textTertiary,
//         fontWeight: '600',
//         flex: 1,
//         letterSpacing: -0.1,
//     },
// });
//
// export default FeaturedCard;

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
                    <Text style={styles.featuredText}>FEATURED</Text>
                </View>

                {/* Category Badge - Bottom Left */}
                {item.category && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
                    </View>
                )}

                {/* Distance Badge - Bottom Right */}
                {item.distance && (
                    <View style={styles.distanceBadge}>
                        <Text style={styles.distanceText}>{item.distance}</Text>
                    </View>
                )}

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
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>{item.price}</Text>
                    </View>
                    <View style={styles.arrowCircle}>
                        <Ionicons name="arrow-forward" size={16} color="#fff"/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 240,
        borderRadius: 24,
        backgroundColor: COLORS.dark.card,
        marginRight: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
    },
    imageContainer: {
        width: '100%',
        height: 240,
        position: 'relative',
        borderRadius: 16,
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
        height: 80,
    },
    featuredBadge: {
        position: 'absolute',
        top: 14,
        left: 14,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    featuredText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    categoryBadge: {
        position: 'absolute',
        bottom: 14,
        left: 14,
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    categoryText: {
        color: '#000',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    distanceBadge: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    distanceText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    soldBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        backgroundColor: '#EF4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    soldText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    info: {
        paddingTop: 12,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.dark.textSecondary,
        marginBottom: 4,
        lineHeight: 24,
        letterSpacing: -0.3,
    },
    locationText: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
        marginBottom: 12,
        letterSpacing: -0.1,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.gray400,
        letterSpacing: -0.5,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewCount: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    arrowCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default FeaturedCard;