import React, { useState } from 'react';
import {
    Image,
    Linking,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import Constants from 'expo-constants';
import { COLORS } from '../utils/colors';

const features = [
    {
        icon: 'shield-checkmark',
        label: 'Safe & Secure',
        desc: 'Campus-verified users',
        detail: 'Every user must sign up with a valid institutional email. Our reporting system and community moderation ensure a safe environment for every transaction.',
        color: '#3B82F6',
    },
    {
        icon: 'flash',
        label: 'Fast & Easy',
        desc: 'List items in seconds',
        detail: 'Snap a photo, set your price, and reach hundreds of peers instantly. No more cluttered WhatsApp groups or sketchy external sites.',
        color: '#10B981',
    },
    {
        icon: 'people',
        label: 'Community',
        desc: 'Connect with peers',
        detail: 'Agora is more than an app — it is a campus ecosystem. Meet up at well-known campus spots and foster a real sense of belonging.',
        color: '#F59E0B',
    },
    {
        icon: 'leaf',
        label: 'Sustainable',
        desc: 'Give items a second life',
        detail: 'Join the circular economy. By trading within campus, you reduce waste and help fellow students save money.',
        color: '#EC4899',
    },
];

const socialButtons = [
    { icon: 'logo-instagram', label: 'Instagram', url: 'https://instagram.com/agora', color: '#E4405F' },
    { icon: 'globe-outline', label: 'Website', url: 'https://spicalabs.netlify.app', color: COLORS.primary },
];

export default function AboutScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openFeature = (feature) => {
        setSelectedFeature(feature);
        setModalVisible(true);
    };

    const handleLink = (url) => {
        Linking.openURL(url).catch(err => console.error(err));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <AppHeader title="About Agora" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Brand Hero */}
                <View style={styles.heroCard}>
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require('../assets/LogoApp.png')}
                            style={styles.logo}
                        />
                    </View>
                    <Text style={styles.heroTitle}>Agora</Text>
                    <TouchableOpacity
                        style={styles.studioBadge}
                        onPress={() => handleLink('https://spicalabs.netlify.app')}
                        activeOpacity={0.6}
                    >
                        <Text style={styles.studioBadgeText}>By Spica Labs</Text>
                        <Ionicons name="chevron-forward" size={11} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.heroSubtitle}>
                        The peer-to-peer marketplace built exclusively for your campus community.
                    </Text>
                </View>

                {/* The Story */}
                <SectionTitle>The Story</SectionTitle>
                <View style={styles.storyCard}>
                    <Text style={styles.storyText}>
                        Agora was born out of a simple observation: campus life is expensive and student groups are cluttered.
                        We created a dedicated space where students can trade safely and help one another.
                    </Text>
                </View>

                {/* Why Agora */}
                <SectionTitle>Why Agora?</SectionTitle>
                <View style={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.featureCard}
                            onPress={() => openFeature(feature)}
                            activeOpacity={0.6}
                        >
                            <View style={[styles.featureIconWrapper, { backgroundColor: `${feature.color}12` }]}>
                                <Ionicons name={feature.icon} size={18} color={feature.color} />
                            </View>
                            <Text style={styles.featureLabel}>{feature.label}</Text>
                            <Text style={styles.featureDesc}>{feature.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stay Connected */}
                <SectionTitle>Stay Connected</SectionTitle>
                <View style={styles.socialRow}>
                    {socialButtons.map((btn, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.socialCard}
                            onPress={() => handleLink(btn.url)}
                            activeOpacity={0.6}
                        >
                            <View style={[styles.socialIconWrapper, { backgroundColor: `${btn.color}12` }]}>
                                <Ionicons name={btn.icon} size={18} color={btn.color} />
                            </View>
                            <Text style={styles.socialLabel}>{btn.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Support & Legal */}
                <SectionTitle>Support & Legal</SectionTitle>
                <View style={styles.linksCard}>
                    <LinkRow
                        icon="mail-outline"
                        label="Contact Support"
                        onPress={() => handleLink('mailto:hello.spicalabs@gmail.com')}
                    />
                    <LinkRow
                        icon="shield-outline"
                        label="Privacy Policy"
                        onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                        isLast
                    />
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with </Text>
                    <Ionicons name="heart" size={13} color={COLORS.error} />
                    <Text style={styles.footerText}> by Spica Labs</Text>
                </View>
                <Text style={styles.copyright}>© 2026 Spica Labs · v{Constants.expoConfig.version}</Text>
            </ScrollView>

            {/* Feature Modal */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
                        <View style={styles.modalHandle} />
                        {selectedFeature && (
                            <>
                                <View style={[styles.modalIconWrapper, { backgroundColor: `${selectedFeature.color}12` }]}>
                                    <Ionicons name={selectedFeature.icon} size={24} color={selectedFeature.color} />
                                </View>
                                <Text style={styles.modalTitle}>{selectedFeature.label}</Text>
                                <Text style={styles.modalDesc}>{selectedFeature.detail}</Text>
                                <TouchableOpacity
                                    style={styles.modalBtn}
                                    activeOpacity={0.7}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.modalBtnText}>Got it</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionTitle = ({ children }) => (
    <Text style={styles.sectionTitle}>{children}</Text>
);

const LinkRow = ({ icon, label, onPress, isLast }) => (
    <TouchableOpacity
        style={[styles.linkRow, !isLast && styles.linkRowBorder]}
        onPress={onPress}
        activeOpacity={0.6}
    >
        <View style={[styles.iconWrapper, { backgroundColor: `${COLORS.primary}12` }]}>
            <Ionicons name={icon} size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.linkRowText}>{label}</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.gray300} />
    </TouchableOpacity>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    container: {
        padding: 16,
        paddingBottom: 60,
    },

    // Hero
    heroCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
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
    logoWrapper: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: COLORS.gray50,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
        overflow: 'hidden',
    },
    logo: {
        width: 64,
        height: 64,
        borderRadius: 16,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.8,
        marginBottom: 8,
    },
    studioBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${COLORS.primary}10`,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: `${COLORS.primary}20`,
        marginBottom: 14,
        gap: 4,
    },
    studioBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.primary,
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

    // Story
    storyCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
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
    storyText: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 20,
    },

    // Features grid
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    featureCard: {
        width: '47%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 14,
        marginBottom: 0,
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
    featureIconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    featureLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        marginBottom: 3,
    },
    featureDesc: {
        fontSize: 11,
        color: COLORS.gray400,
    },

    // Social
    socialRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    socialCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray100,
        gap: 8,
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
    socialIconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.light.text,
    },

    // Links card — mirrors SettingsOptionList exactly
    linksCard: {
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
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 11,
        paddingHorizontal: 14,
        minHeight: 52,
        gap: 12,
    },
    linkRowBorder: {
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
    linkRowText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.light.text,
        letterSpacing: -0.2,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.gray400,
    },
    copyright: {
        fontSize: 11,
        color: COLORS.gray300,
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 8,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    modalHandle: {
        width: 36,
        height: 4,
        backgroundColor: COLORS.gray200,
        borderRadius: 2,
        marginBottom: 20,
    },
    modalIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.4,
        marginBottom: 10,
    },
    modalDesc: {
        fontSize: 13,
        color: COLORS.gray400,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    modalBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 13,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    modalBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
    },
});