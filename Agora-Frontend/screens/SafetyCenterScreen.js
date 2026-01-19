import React from 'react';
import {Linking, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

export default function SafetyCenterScreen({navigation}) {
    const insets = useSafeAreaInsets();

    const contactSupport = () => {
        Linking.openURL('mailto:support@agora-app.com');
    };

    return (<View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg}/>

        {/* Header */}
        <AppHeader title="Safety Center" onBack={() => navigation.goBack()}/>

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Hero Card - Trust Building */}
            <View style={styles.rewardCard}>
                <View style={styles.rewardIconCircle}>
                    <Ionicons name="shield-checkmark" size={40} color={COLORS.primary}/>
                </View>
                <Text style={styles.rewardTitle}>Trade with Confidence</Text>
                <Text style={styles.rewardSubtitle}>
                    Agora is built for students. Follow these simple rules to ensure a safe experience for everyone.
                </Text>
            </View>

            {/* The Golden Rules */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>The Golden Rules</Text>

                <View style={styles.stepCard}>
                    <View style={[styles.stepNumber, {backgroundColor: '#4F46E5'}]}>
                        <Ionicons name="location" size={16} color="#fff"/>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Meet in Public Places</Text>
                        <Text style={styles.stepDescription}>
                            Always meet at busy campus spots like the Library, Canteens, or Student Activity
                            Centers.
                        </Text>
                    </View>
                </View>

                <View style={styles.stepCard}>
                    <View style={[styles.stepNumber, {backgroundColor: '#10B981'}]}>
                        <Ionicons name="eye" size={16} color="#fff"/>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>Inspect Before Paying</Text>
                        <Text style={styles.stepDescription}>
                            Check the item thoroughly for any damage or defects before handing over money.
                        </Text>
                    </View>
                </View>

                <View style={styles.stepCard}>
                    <View style={[styles.stepNumber, {backgroundColor: '#F59E0B'}]}>
                        <Ionicons name="wallet" size={16} color="#fff"/>
                    </View>
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>No Advance Payments</Text>
                        <Text style={styles.stepDescription}>
                            Avoid sending money before seeing the item. Secure UPI or Cash at pickup is best.
                        </Text>
                    </View>
                </View>
            </View>

            {/* Red Flags Card */}
            <View style={[styles.codeCard, {borderColor: `${COLORS.error}50`}]}>
                <View style={styles.flexRow}>
                    <Ionicons name="warning" size={20} color={COLORS.error}/>
                    <Text style={[styles.codeLabel, {color: COLORS.error, marginLeft: 8, marginBottom: 0}]}>
                        Watch out for Red Flags
                    </Text>
                </View>
                <View style={styles.redFlagList}>
                    <Text style={styles.flagItem}>• Deals that seem "too good to be true"</Text>
                    <Text style={styles.flagItem}>• Sellers pushing for immediate advance payment</Text>
                    <Text style={styles.flagItem}>• Requests to meet in isolated or off-campus areas</Text>
                </View>
            </View>

            {/* Disclaimer Section */}
            <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>
                    <Text style={{fontWeight: '700'}}>Disclaimer: </Text>
                    Agora is a peer-to-peer marketplace. While we strive for a safe community, we are not liable for any
                    losses, damages, or disputes arising from transactions between users. Please trade responsibly.
                </Text>
            </View>


        </ScrollView>


        {/* Bottom Button */}
        <View style={[
            styles.bottomButton,
            {paddingBottom: Math.max(insets.bottom, 16)}
        ]}>
            <Button
                title="Report a Problem"
                onPress={contactSupport}
                icon="mail-outline"
                fullWidth
                size="large"
            />
        </View>
    </View>);
}

const styles = StyleSheet.create({
    // I am keeping your existing styles but adding/tweaking a few for the new content
    container: {flex: 1, backgroundColor: COLORS.dark.bg},
    scrollContent: {padding: 20, paddingBottom: 100},
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
        backgroundColor: `${COLORS.primary}20`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    rewardTitle: {
        fontSize: 22, fontWeight: '800', color: COLORS.dark.text, marginBottom: 8,
    },
    rewardSubtitle: {
        fontSize: 14, color: COLORS.dark.textSecondary, textAlign: 'center', lineHeight: 20,
    },
    section: {marginBottom: 24},
    sectionTitle: {
        fontSize: 18, fontWeight: '700', color: COLORS.dark.text, marginBottom: 16,
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
        width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    stepContent: {flex: 1},
    stepTitle: {fontSize: 15, fontWeight: '700', color: COLORS.dark.text, marginBottom: 4},
    stepDescription: {fontSize: 13, color: COLORS.dark.textSecondary, lineHeight: 18},
    codeCard: {
        backgroundColor: COLORS.dark.card, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1,
    },
    codeLabel: {fontSize: 14, fontWeight: '700', marginBottom: 12},
    redFlagList: {marginTop: 12},
    flagItem: {color: COLORS.dark.textSecondary, fontSize: 13, marginBottom: 6, lineHeight: 20},
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
    benefitItem: {alignItems: 'center', gap: 8},
    benefitText: {fontSize: 12, fontWeight: '600', color: COLORS.dark.textSecondary},
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
    flexRow: {flexDirection: 'row', alignItems: 'center'},
    disclaimerContainer: {
        marginTop: 10,
        marginBottom: 20,
        padding: 16,
        backgroundColor: `${COLORS.dark.bgElevated}`,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    disclaimerText: {
        fontSize: 12, color: COLORS.dark.textSecondary, lineHeight: 18, textAlign: 'center', fontStyle: 'italic',
    },
});