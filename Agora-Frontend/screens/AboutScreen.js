import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    StatusBar,
    Image,
    TouchableOpacity,
    Linking
} from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../utils/theme';

export default function AboutScreen({ navigation }) {
    const handleEmail = () => {
        Linking.openURL('mailto:support@agora.com');
    };

    const handleWebsite = () => {
        Linking.openURL('https://agora.com');
    };

    const handleSocial = (platform) => {
        const urls = {
            instagram: 'https://instagram.com/agora',
            twitter: 'https://twitter.com/agora',
            facebook: 'https://facebook.com/agora',
        };
        Linking.openURL(urls[platform]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="About Agora" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* App Info Card */}
                <View style={styles.appCard}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/LogoApp.png')}
                            style={styles.logo}
                        />
                        {/* <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        </View> */}
                    </View>
                    <Text style={styles.title}>Agora</Text>
                    <Text style={styles.tagline}>Your Campus Marketplace</Text>
                    <Text style={styles.subtitle}>
                        Connecting students to buy, sell, and trade items within their college community.
                    </Text>

                    <View style={styles.versionBadge}>
                        <Ionicons name="code-outline" size={16} color={COLORS.primary} />
                        <Text style={styles.versionText}>Version 1.0.0</Text>
                    </View>
                </View>

                {/* Mission Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <View style={styles.missionCard}>
                        <Text style={styles.missionText}>
                            Agora empowers students to build a sustainable campus economy by making it easy to buy, sell, and exchange items with peers. We're creating a trusted community marketplace that puts students first.
                        </Text>
                    </View>
                </View>

                {/* Features Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Choose Agora?</Text>
                    <View style={styles.featuresGrid}>
                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="shield-checkmark" size={24} color="#2563EB" />
                            </View>
                            <Text style={styles.featureTitle}>Safe & Secure</Text>
                            <Text style={styles.featureText}>Campus-verified users only</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#D1FAE5' }]}>
                                <Ionicons name="flash" size={24} color="#10B981" />
                            </View>
                            <Text style={styles.featureTitle}>Fast & Easy</Text>
                            <Text style={styles.featureText}>List items in seconds</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="people" size={24} color="#F59E0B" />
                            </View>
                            <Text style={styles.featureTitle}>Community</Text>
                            <Text style={styles.featureText}>Connect with peers</Text>
                        </View>

                        <View style={styles.featureCard}>
                            <View style={[styles.featureIcon, { backgroundColor: '#FCE7F3' }]}>
                                <Ionicons name="leaf" size={24} color="#EC4899" />
                            </View>
                            <Text style={styles.featureTitle}>Sustainable</Text>
                            <Text style={styles.featureText}>Reduce, reuse, recycle</Text>
                        </View>
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>
                    <View style={styles.contactCard}>
                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={handleEmail}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: '#E0E7FF' }]}>
                                <Ionicons name="mail-outline" size={22} color="#4F46E5" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Email Support</Text>
                                <Text style={styles.contactValue}>support@agora.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={handleWebsite}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.contactIcon, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="globe-outline" size={22} color="#16A34A" />
                            </View>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Website</Text>
                                <Text style={styles.contactValue}>www.agora.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Social Media */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow Us</Text>
                    <View style={styles.socialCard}>
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleSocial('instagram')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.socialIcon, { backgroundColor: '#FCE7F3' }]}>
                                <Ionicons name="logo-instagram" size={24} color="#DB2777" />
                            </View>
                            <Text style={styles.socialText}>Instagram</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleSocial('twitter')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.socialIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="logo-twitter" size={24} color="#3B82F6" />
                            </View>
                            <Text style={styles.socialText}>Twitter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => handleSocial('facebook')}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.socialIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                            </View>
                            <Text style={styles.socialText}>Facebook</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Legal Links */}
                <View style={styles.section}>
                    <View style={styles.legalCard}>
                        <TouchableOpacity
                            style={styles.legalItem}
                            onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="shield-outline" size={18} color="#6B7280" />
                            <Text style={styles.legalText}>Privacy Policy</Text>
                        </TouchableOpacity>

                        <View style={styles.legalDivider} />

                        <TouchableOpacity
                            style={styles.legalItem}
                            onPress={() => navigation.navigate('TermsScreen')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="document-text-outline" size={18} color="#6B7280" />
                            <Text style={styles.legalText}>Terms of Service</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with</Text>
                    <Ionicons name="heart" size={16} color="#EF4444" style={styles.heartIcon} />
                    <Text style={styles.footerText}>by the Agora Team</Text>
                </View>

                <Text style={styles.copyright}>© 2025 Agora. All rights reserved.</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    appCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 32,
        marginBottom: 24,
        elevation: 1,
        alignItems: 'center',
    },
    logoContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: THEME.borderRadius.full,
        borderWidth: 3,
        borderColor: COLORS.dark.border,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: COLORS.dark.bg,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        fontWeight: '500',
    },
    versionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.gray700,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    versionText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
        marginLeft: 6,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    missionCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    missionText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 22,
        fontWeight: '500',
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    featureCard: {
        width: '50%',
        padding: 6,
    },
    featureIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        alignSelf: 'center',
        backgroundColor: COLORS.dark.gray700,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        marginBottom: 4,
    },
    featureText: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    contactCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 4,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    contactIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: COLORS.dark.gray700,
    },
    contactInfo: {
        flex: 1,
    },
    contactLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        marginBottom: 2,
    },
    contactValue: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.dark.border,
        marginHorizontal: 16,
    },
    socialCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingVertical: 20,
        borderRadius: 16,
        marginHorizontal: 4,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    socialIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: COLORS.dark.gray700,
    },
    socialText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.dark.text,
    },
    legalCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    legalItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    legalText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        marginLeft: 6,
    },
    legalDivider: {
        width: 1,
        backgroundColor: COLORS.dark.border,
        marginHorizontal: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    heartIcon: {
        marginHorizontal: 4,
    },
    copyright: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        textAlign: 'center',
        fontWeight: '500',
    },
});