import React from 'react';
import { Linking, ScrollView, StatusBar, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

import HandsSVG from '../assets/svg/HandsSVG.svg';

const rules = [
    {
        icon: 'location',
        color: '#4F46E5',
        title: 'Meet in Public Places',
        desc: 'Always meet at busy campus spots like the Library, Canteens, or Student Activity Centers.',
    },
    {
        icon: 'eye',
        color: '#10B981',
        title: 'Inspect Before Paying',
        desc: 'Check the item thoroughly for any damage or defects before handing over money.',
    },
    {
        icon: 'wallet',
        color: '#F59E0B',
        title: 'No Advance Payments',
        desc: 'Avoid sending money before seeing the item. Secure UPI or cash at pickup is best.',
    },
];

const redFlags = [
    'Deals that seem "too good to be true"',
    'Sellers pushing for immediate advance payment',
    'Requests to meet in isolated or off-campus areas',
];

export default function SafetyCenterScreen({ navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.light.bg} />
            <AppHeader title="Safety Center" onBack={() => navigation.goBack()} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 100, 120) }]}
            >
                {/* Hero */}
                <View style={styles.heroCard}>
                    <HandsSVG width={200} height={110} style={styles.heroSVG} />
                    <Text style={styles.heroTitle}>Trade with Confidence</Text>
                    <Text style={styles.heroSubtitle}>
                        Agora is built by students, for students. Follow these simple rules to ensure a safe experience for everyone.
                    </Text>
                </View>
                {/* Golden Rules */}
                <Text style={styles.sectionTitle}>The Golden Rules</Text>
                <View style={styles.rulesCard}>
                    {rules.map((rule, index) => (
                        <View
                            key={index}
                            style={[styles.ruleRow, index < rules.length - 1 && styles.ruleRowBorder]}
                        >
                            <View style={[styles.iconWrapper, { backgroundColor: `${rule.color}12` }]}>
                                <Ionicons name={rule.icon} size={18} color={rule.color} />
                            </View>
                            <View style={styles.ruleContent}>
                                <Text style={styles.ruleTitle}>{rule.title}</Text>
                                <Text style={styles.ruleDesc}>{rule.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Red Flags */}
                <Text style={styles.sectionTitle}>Watch out for Red Flags</Text>
                <View style={styles.warningCard}>
                    <View style={styles.warningHeader}>
                        <View style={styles.warningIconWrapper}>
                            <Ionicons name="warning" size={16} color={COLORS.error} />
                        </View>
                        <Text style={styles.warningTitle}>Red Flags</Text>
                    </View>
                    {redFlags.map((flag, index) => (
                        <View key={index} style={styles.flagRow}>
                            <View style={[styles.bullet, { backgroundColor: COLORS.error }]} />
                            <Text style={styles.flagText}>{flag}</Text>
                        </View>
                    ))}
                </View>

                {/* Disclaimer */}
                <View style={styles.disclaimer}>
                    <Text style={styles.disclaimerText}>
                        <Text style={styles.disclaimerBold}>Disclaimer: </Text>
                        Agora is a peer-to-peer marketplace. While we strive for a safe community, we are not liable for any losses or disputes. Please trade responsibly.
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <Button
                    title="Report a Problem"
                    onPress={() => Linking.openURL('mailto:hello.spicalabs@gmail.com')}
                    icon="mail-outline"
                    variant="primary"
                    size="large"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    scrollContent: {
        padding: 16,
    },

    // Hero
    heroCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        paddingTop: 24,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 8 },
            android: { elevation: 1 },
        }),
    },
    heroSVG: {
        marginBottom: 16,
    },
    heroTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.4,
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
        textAlign: 'center',
        lineHeight: 19,
    },

    // Section title
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        marginBottom: 10,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // Rules — grouped card like SettingsOptionList
    rulesCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        overflow: 'hidden',
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: { elevation: 1 },
        }),
    },
    ruleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        minHeight: 52,
        gap: 12,
    },
    ruleRowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ruleContent: {
        flex: 1,
    },
    ruleTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        marginBottom: 2,
    },
    ruleDesc: {
        fontSize: 12,
        color: COLORS.gray400,
        lineHeight: 17,
    },

    // Warning card
    warningCard: {
        backgroundColor: `${COLORS.error}08`,
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: `${COLORS.error}15`,
    },
    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    warningIconWrapper: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: `${COLORS.error}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    warningTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.error,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    flagRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 10,
    },
    bullet: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginTop: 7,
    },
    flagText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },

    // Disclaimer
    disclaimer: {
        paddingHorizontal: 4,
        paddingVertical: 8,
        marginBottom: 8,
    },
    disclaimerText: {
        fontSize: 11,
        color: COLORS.gray400,
        lineHeight: 17,
        textAlign: 'center',
    },
    disclaimerBold: {
        fontWeight: '600',
        color: COLORS.gray400,
    },

    // Bottom bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: COLORS.light.bg,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.gray100,
    },
});