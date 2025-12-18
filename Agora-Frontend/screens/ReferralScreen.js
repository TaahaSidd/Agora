import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Share,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

export default function ReferralScreen({ navigation, route }) {
    const [referralCode] = useState('AGORA2024XYZ'); // Get from user data
    const [referralCount] = useState(route?.params?.referralCount || 0);

    const shareReferralCode = async () => {
        try {
            await Share.share({
                message: `Join Agora - the best student marketplace! 🎓\n\nBuy & sell textbooks, electronics & more within your campus.\n\nUse my code: ${referralCode} and we both get ₹50!\n\nDownload now: [App Link]`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const copyToClipboard = () => {
        // Add clipboard functionality
        alert('Referral code copied!');
    };

    return (
        <View style={styles.container} >
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg} />

            {/* Header */}
            <AppHeader title="Refer & Earn" onBack={() => navigation.goBack()} />


            < ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Reward Card */}
                < View style={styles.rewardCard} >
                    <View style={styles.rewardIconCircle}>
                        <Ionicons name="gift" size={40} color={COLORS.success} />
                    </View>
                    < Text style={styles.rewardTitle} > Earn ₹50 per Friend </Text>
                    < Text style={styles.rewardSubtitle} >
                        Invite your classmates and earn rewards when they join
                    </Text>

                    {/* Stats */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}> {referralCount} </Text>
                            < Text style={styles.statLabel} > Friends Invited </Text>
                        </View>
                        < View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>₹{referralCount * 50} </Text>
                            < Text style={styles.statLabel} > Total Earned </Text>
                        </View>
                    </View>
                </View>

                {/* How it Works */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> How it Works </Text>

                    < View style={styles.stepCard} >
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}> 1 </Text>
                        </View>
                        < View style={styles.stepContent} >
                            <Text style={styles.stepTitle}> Share Your Code </Text>
                            < Text style={styles.stepDescription} >
                                Send your unique referral code to friends
                            </Text>
                        </View>
                    </View>

                    < View style={styles.stepCard} >
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}> 2 </Text>
                        </View>
                        < View style={styles.stepContent} >
                            <Text style={styles.stepTitle}> They Sign Up </Text>
                            < Text style={styles.stepDescription} >
                                Friend signs up using your code
                            </Text>
                        </View>
                    </View>

                    < View style={styles.stepCard} >
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}> 3 </Text>
                        </View>
                        < View style={styles.stepContent} >
                            <Text style={styles.stepTitle}> Both Get Rewarded </Text>
                            < Text style={styles.stepDescription} >
                                You both receive ₹50 credit instantly
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Referral Code Card */}
                <View style={styles.codeCard}>
                    <Text style={styles.codeLabel}> Your Referral Code </Text>
                    < View style={styles.codeBox} >
                        <Text style={styles.codeText}> {referralCode} </Text>
                        < TouchableOpacity
                            onPress={copyToClipboard}
                            style={styles.copyButton}
                        >
                            <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Benefits */}
                <View style={styles.benefitsContainer}>
                    <View style={styles.benefitItem}>
                        <Ionicons name="flash" size={20} color={COLORS.warning} />
                        <Text style={styles.benefitText}> Instant credit </Text>
                    </View>
                    < View style={styles.benefitItem} >
                        <Ionicons name="infinite" size={20} color={COLORS.info} />
                        <Text style={styles.benefitText}> No limit </Text>
                    </View>
                    < View style={styles.benefitItem} >
                        <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
                        <Text style={styles.benefitText}> Safe & secure </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomButton}>
                <Button
                    title="Share Referral Code"
                    onPress={shareReferralCode}
                    icon="share-social"
                    fullWidth
                    size="large"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    rewardCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    rewardIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: `${COLORS.success}20`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    rewardTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
    },
    rewardSubtitle: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: COLORS.dark.bgElevated,
        borderRadius: 12,
        padding: 16,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.dark.border,
        marginHorizontal: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 16,
    },
    stepCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 4,
    },
    stepDescription: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        lineHeight: 18,
    },
    codeCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    codeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        marginBottom: 12,
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.dark.bgElevated,
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
    },
    codeText: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
        letterSpacing: 2,
    },
    copyButton: {
        padding: 8,
    },
    benefitsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: COLORS.dark.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        marginBottom: 12,
    },
    benefitItem: {
        alignItems: 'center',
        gap: 8,
    },
    benefitText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
    },
    bottomButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: COLORS.dark.bg,
        borderTopWidth: 1,
        borderTopColor: COLORS.dark.border,
    },
});