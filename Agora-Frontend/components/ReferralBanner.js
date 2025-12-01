// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from '@expo/vector-icons';
// import { COLORS } from '../utils/colors';

// const { width } = Dimensions.get('window');

// const ReferralBanner = ({ onPress, referralCount = 0 }) => {
//     const totalReferrals = 3;
//     const remainingReferrals = Math.max(0, totalReferrals - referralCount);
//     const progress = Math.min((referralCount / totalReferrals) * 100, 100);

//     return (
//         <TouchableOpacity
//             onPress={onPress}
//             activeOpacity={0.85}
//             style={styles.container}
//         >
//             <LinearGradient
//                 colors={['#10B981', '#059669', '#047857']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.banner}
//             >
//                 {/* Decorative circles */}
//                 <View style={styles.circleTop} />
//                 <View style={styles.circleBottom} />

//                 <View style={styles.content}>
//                     {/* Left Section - Icon & Text */}
//                     <View style={styles.leftSection}>
//                         <View style={styles.iconCircle}>
//                             <Ionicons name="people" size={26} color="#fff" />
//                         </View>
//                         <View style={styles.textContainer}>
//                             <View style={styles.titleRow}>
//                                 <Text style={styles.title}>Invite Friends</Text>
//                                 <View style={styles.badge}>
//                                     <Ionicons name="gift" size={12} color="#10B981" />
//                                 </View>
//                             </View>
//                             <Text style={styles.subtitle}>
//                                 Get ₹50 for each friend who joins
//                             </Text>

//                             {/* Progress Indicator */}
//                             {referralCount > 0 && referralCount < totalReferrals && (
//                                 <View style={styles.progressContainer}>
//                                     <View style={styles.progressBar}>
//                                         <View style={[styles.progressFill, { width: `${progress}%` }]} />
//                                     </View>
//                                     <Text style={styles.progressText}>
//                                         {referralCount}/{totalReferrals} friends
//                                     </Text>
//                                 </View>
//                             )}
//                         </View>
//                     </View>

//                     {/* Right Section - Reward & CTA */}
//                     <View style={styles.rightSection}>
//                         <View style={styles.rewardCard}>
//                             <Text style={styles.rewardLabel}>Earn up to</Text>
//                             <View style={styles.priceRow}>
//                                 <Text style={styles.currency}>₹</Text>
//                                 <Text style={styles.amount}>150</Text>
//                             </View>
//                         </View>
//                         <View style={styles.ctaButton}>
//                             <Text style={styles.ctaText}>Invite Now</Text>
//                             <Ionicons name="arrow-forward" size={14} color="#10B981" />
//                         </View>
//                     </View>
//                 </View>

//                 {/* Bottom Info Strip */}
//                 <View style={styles.bottomStrip}>
//                     <View style={styles.infoItem}>
//                         <Ionicons name="checkmark-circle" size={14} color="rgba(255,255,255,0.9)" />
//                         <Text style={styles.infoText}>Easy sharing</Text>
//                     </View>
//                     <View style={styles.divider} />
//                     <View style={styles.infoItem}>
//                         <Ionicons name="flash" size={14} color="rgba(255,255,255,0.9)" />
//                         <Text style={styles.infoText}>Instant credit</Text>
//                     </View>
//                     <View style={styles.divider} />
//                     <View style={styles.infoItem}>
//                         <Ionicons name="infinite" size={14} color="rgba(255,255,255,0.9)" />
//                         <Text style={styles.infoText}>No limit</Text>
//                     </View>
//                 </View>
//             </LinearGradient>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     // container: {
//     //     marginVertical: 12,
//     // },
//     banner: {
//         width: '100%',
//         minHeight: 160,
//         borderRadius: 20,
//         padding: 18,
//         position: 'relative',
//         overflow: 'hidden',
//         shadowColor: '#10B981',
//         shadowOffset: {
//             width: 0,
//             height: 6,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 12,
//         elevation: 1,
//     },
//     circleTop: {
//         position: 'absolute',
//         width: 180,
//         height: 180,
//         borderRadius: 90,
//         backgroundColor: 'rgba(255, 255, 255, 0.08)',
//         top: -60,
//         right: -40,
//     },
//     circleBottom: {
//         position: 'absolute',
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: 'rgba(255, 255, 255, 0.06)',
//         bottom: -40,
//         left: -30,
//     },
//     content: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         justifyContent: 'space-between',
//         zIndex: 1,
//         marginBottom: 14,
//     },
//     leftSection: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//         flex: 1,
//         paddingRight: 12,
//     },
//     iconCircle: {
//         width: 52,
//         height: 52,
//         borderRadius: 26,
//         backgroundColor: 'rgba(255, 255, 255, 0.2)',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 12,
//         borderWidth: 2,
//         borderColor: 'rgba(255, 255, 255, 0.3)',
//     },
//     textContainer: {
//         flex: 1,
//     },
//     titleRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 4,
//     },
//     title: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: '800',
//         marginRight: 6,
//         textShadowColor: 'rgba(0, 0, 0, 0.15)',
//         textShadowOffset: { width: 0, height: 1 },
//         textShadowRadius: 2,
//     },
//     badge: {
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     subtitle: {
//         color: 'rgba(255, 255, 255, 0.95)',
//         fontSize: 13,
//         fontWeight: '600',
//         lineHeight: 18,
//         marginBottom: 8,
//     },
//     progressContainer: {
//         marginTop: 6,
//     },
//     progressBar: {
//         height: 4,
//         backgroundColor: 'rgba(255, 255, 255, 0.25)',
//         borderRadius: 2,
//         overflow: 'hidden',
//         marginBottom: 4,
//     },
//     progressFill: {
//         height: '100%',
//         backgroundColor: '#fff',
//         borderRadius: 2,
//     },
//     progressText: {
//         fontSize: 10,
//         fontWeight: '700',
//         color: 'rgba(255, 255, 255, 0.9)',
//     },
//     rightSection: {
//         alignItems: 'flex-end',
//     },
//     rewardCard: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         borderRadius: 12,
//         alignItems: 'center',
//         marginBottom: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 2,
//     },
//     rewardLabel: {
//         fontSize: 10,
//         fontWeight: '700',
//         color: '#059669',
//         textTransform: 'uppercase',
//         letterSpacing: 0.5,
//         marginBottom: 2,
//     },
//     priceRow: {
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//     },
//     currency: {
//         fontSize: 14,
//         fontWeight: '800',
//         color: '#10B981',
//         marginTop: 2,
//         marginRight: 1,
//     },
//     amount: {
//         fontSize: 26,
//         fontWeight: '900',
//         color: '#10B981',
//         lineHeight: 26,
//     },
//     ctaButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//         paddingHorizontal: 12,
//         paddingVertical: 6,
//         borderRadius: 8,
//         gap: 4,
//     },
//     ctaText: {
//         fontSize: 12,
//         fontWeight: '800',
//         color: '#10B981',
//     },
//     bottomStrip: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         paddingTop: 12,
//         borderTopWidth: 1,
//         borderTopColor: 'rgba(255, 255, 255, 0.2)',
//         marginTop: 8,
//     },
//     infoItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 4,
//     },
//     infoText: {
//         fontSize: 11,
//         fontWeight: '700',
//         color: 'rgba(255, 255, 255, 0.95)',
//     },
//     divider: {
//         width: 1,
//         height: 12,
//         backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     },
// });

// export default ReferralBanner;



import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const CompactReferralBanner = ({ onPress, referralCount = 0 }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={styles.container}
        >
            <LinearGradient
                colors={['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.banner}
            >
                {/* Decorative circle */}
                <View style={styles.decorCircle} />

                <View style={styles.content}>
                    {/* Left - Icon & Text */}
                    <View style={styles.leftSection}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="gift" size={20} color="#10B981" />
                        </View>
                        <View>
                            <Text style={styles.title}>Invite Friends & Earn ₹50</Text>
                            <Text style={styles.subtitle}>
                                {referralCount > 0 ? `${referralCount} friends invited` : 'Share with your classmates'}
                            </Text>
                        </View>
                    </View>

                    {/* Right - Arrow */}
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.9)" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    banner: {
        width: '100%',
        height: 70,
        borderRadius: 16,
        padding: 14,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    decorCircle: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        top: -20,
        right: -20,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        zIndex: 1,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default CompactReferralBanner;