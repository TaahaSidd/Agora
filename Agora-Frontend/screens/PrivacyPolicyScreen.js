import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';
import { COLORS } from '../utils/colors';

const sections = [
    {
        title: '1. Data Collection & Usage',
        body: 'Spica Labs collects information necessary to maintain a functional and safe marketplace. This includes your institutional email to verify campus affiliation and your phone number to facilitate peer-to-peer communication.',
        bullets: [
            'Account Data: Name, email, and encrypted credentials.',
            'Listing Data: Images, descriptions, and pricing of items.',
            'Metadata: IP addresses and device identifiers for fraud prevention.',
            'Location: Approximate campus location for proximity sorting.',
        ],
    },
    {
        title: '2. Retention & Deletion',
        body: 'Your data is stored as long as your account remains active. Users may request full account deletion at any time through the settings menu. Once requested, all personal identifiers are purged from our active databases within 30 days.',
    },
    {
        title: '3. Peer-to-Peer Safety',
        body: 'Agora acts solely as a discovery layer. We do not process payments or manage logistics. By using the app, you agree to:',
        bullets: [
            'Conduct all physical inspections before payment.',
            'Never share sensitive bank OTPs or login codes.',
            'Report suspicious listings or harassment immediately.',
        ],
    },
];

const disclaimerBullets = [
    'We do not verify the condition or legality of listed items.',
    'We are not liable for any injury or loss during physical meetups.',
    'Users are responsible for verifying the identity of the counterparty.',
    'No financial transactions are handled by Spica Labs.',
];

export default function PrivacyPolicyScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />
            <AppHeader title="Privacy Policy" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Privacy & Terms</Text>
                    <Text style={styles.heroSubtitle}>
                        Effective March 2026. Please read these terms carefully before using Agora.
                    </Text>
                </View>

                {/* Content card */}
                <View style={styles.card}>
                    {sections.map((section, index) => (
                        <View
                            key={index}
                            style={[styles.section, index < sections.length - 1 && styles.sectionBorder]}
                        >
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.paragraph}>{section.body}</Text>
                            {section.bullets && (
                                <View style={styles.bulletList}>
                                    {section.bullets.map((item, i) => (
                                        <BulletItem key={i} text={item} />
                                    ))}
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Disclaimer */}
                    <View style={styles.disclaimerBox}>
                        <View style={styles.disclaimerHeader}>
                            <View style={styles.disclaimerIconWrapper}>
                                <Ionicons name="shield-half" size={16} color={COLORS.error} />
                            </View>
                            <Text style={styles.disclaimerTitle}>Platform Disclaimer</Text>
                        </View>
                        <Text style={styles.disclaimerBody}>
                            Agora is provided "as-is" without warranties of any kind.
                        </Text>
                        <View style={styles.bulletList}>
                            {disclaimerBullets.map((item, i) => (
                                <BulletItem key={i} text={item} color={COLORS.error} />
                            ))}
                        </View>
                    </View>

                    {/* Contact */}
                    <View style={[styles.section, { marginBottom: 0 }]}>
                        <Text style={styles.sectionTitle}>5. Updates & Contact</Text>
                        <Text style={styles.paragraph}>
                            We may update this policy to reflect changes in campus regulations or app features. For legal inquiries, contact:
                        </Text>
                        <Text style={styles.emailText}>hello.spicalabs@gmail.com</Text>
                    </View>
                </View>

                <InfoBox
                    text="Your use of Agora constitutes acceptance of these terms. Stay safe and happy trading!"
                    icon="checkmark-circle"
                />
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const BulletItem = ({ text, color = COLORS.primary }) => (
    <View style={styles.bulletItem}>
        <View style={[styles.bullet, { backgroundColor: color }]} />
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    container: {
        padding: 16,
        paddingBottom: 40,
    },

    // Hero
    hero: {
        marginBottom: 20,
        marginTop: 4,
        paddingHorizontal: 4,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.6,
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },

    // Card
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.gray100,
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
    section: {
        paddingVertical: 16,
    },
    sectionBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 20,
    },

    // Bullets
    bulletList: {
        marginTop: 10,
        gap: 8,
    },
    bulletItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bullet: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginTop: 7,
        marginRight: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },

    // Disclaimer
    disclaimerBox: {
        backgroundColor: `${COLORS.error}08`,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: `${COLORS.error}15`,
        marginVertical: 16,
    },
    disclaimerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    disclaimerIconWrapper: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: `${COLORS.error}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disclaimerTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.error,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    disclaimerBody: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.light.text,
        marginBottom: 8,
    },

    // Email
    emailText: {
        color: COLORS.primary,
        fontWeight: '500',
        marginTop: 8,
        fontSize: 13,
    },
});