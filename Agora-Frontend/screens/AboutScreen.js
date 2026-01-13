import React from 'react';
import {
    Image,
    Linking,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import AppHeader from '../components/AppHeader';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

export default function AboutScreen({navigation}) {
    const handleEmail = () => {
        Linking.openURL('mailto:hello.spicalabs@gmail.com');
    };

    const handleWebsite = () => {
        Linking.openURL('https://spicalabs.netlify.app/products/agora');
    };

    const handleSocial = (platform) => {
        const urls = {
            instagram: 'https://instagram.com/agora',
            twitter: 'https://twitter.com/agora',
            facebook: 'https://facebook.com/agora',
        };
        Linking.openURL(urls[platform]);
    };

    const features = [
        {
            icon: 'shield-checkmark',
            label: 'Safe & Secure',
            desc: 'Campus-verified users',
            gradient: ['#3B82F6', '#2563EB']
        },
        {icon: 'flash', label: 'Fast & Easy', desc: 'List items in seconds', gradient: ['#10B981', '#059669']},
        {icon: 'people', label: 'Community', desc: 'Connect with peers', gradient: ['#F59E0B', '#D97706']},
        {icon: 'leaf', label: 'Sustainable', desc: 'Give items a second life', gradient: ['#EC4899', '#DB2777']},
    ];

    const socialButtons = [
        {icon: 'logo-instagram', label: 'Instagram', platform: 'instagram', gradient: ['#E4405F', '#C13584']},
        {icon: 'logo-twitter', label: 'Twitter', platform: 'twitter', gradient: ['#1DA1F2', '#0C85D0']},
        {icon: 'logo-facebook', label: 'Facebook', platform: 'facebook', gradient: ['#1877F2', '#0D5DBE']},
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>
            <AppHeader title="About Agora" onBack={() => navigation.goBack()}/>

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
                    </View>
                    <Text style={styles.title}>Agora</Text>
                    <Text style={styles.tagline}>Your Campus Marketplace</Text>
                    <Text style={styles.subtitle}>
                        Connecting students to buy, sell, and trade items within their college community.
                    </Text>

                    {/*<View style={styles.versionBadge}>*/}
                    {/*    <Ionicons name="code-outline" size={16} color={COLORS.primary}/>*/}
                    {/*    <Text style={styles.versionText}>Version 1.0.0</Text>*/}
                    {/*</View>*/}
                </View>

                {/* Mission Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Our Mission</Text>
                    <View style={styles.missionCard}>
                        {/* Added a subtle icon background for personality */}
                        <Ionicons
                            name="megaphone-outline"
                            size={40}
                            color={`${COLORS.primary}15`}
                            style={styles.quoteIcon}
                        />
                        <Text style={styles.missionText}>
                            Agora was built by students, for students. We believe campus life is better when we help
                            each other out—whether it’s passing down a textbook or finding a deal on a cycle. Our
                            mission is to create a trusted, sustainable marketplace that belongs to the community.
                        </Text>
                    </View>
                </View>

                {/* Features Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Why Choose Agora?</Text>
                    <View style={styles.featuresGrid}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureCard}>
                                <LinearGradient
                                    colors={feature.gradient}
                                    style={styles.featureIcon}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                >
                                    <Ionicons name={feature.icon} size={24} color="#fff"/>
                                </LinearGradient>
                                <Text style={styles.featureTitle}>{feature.label}</Text>
                                <Text style={styles.featureText}>{feature.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Contact Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>
                    <View style={styles.contactCard}>
                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={handleEmail}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={['#8B5CF6', '#7C3AED']}
                                style={styles.contactIcon}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            >
                                <Ionicons name="mail-outline" size={22} color="#fff"/>
                            </LinearGradient>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Email Support</Text>
                                <Text style={styles.contactValue}>hello.spicalabs@gmail.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.dark.textTertiary}/>
                        </TouchableOpacity>

                        <View style={styles.divider}/>

                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={handleWebsite}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={['#10B981', '#059669']}
                                style={styles.contactIcon}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            >
                                <Ionicons name="globe-outline" size={22} color="#fff"/>
                            </LinearGradient>
                            <View style={styles.contactInfo}>
                                <Text style={styles.contactLabel}>Website</Text>
                                <Text style={styles.contactValue}>spicalabs.netlify.app/agora</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={COLORS.dark.textTertiary}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Social Media */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow Us</Text>
                    <View style={styles.socialCard}>
                        {socialButtons.map((social, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.socialButton}
                                onPress={() => handleSocial(social.platform)}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={social.gradient}
                                    style={styles.socialIcon}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                >
                                    <Ionicons name={social.icon} size={24} color="#fff"/>
                                </LinearGradient>
                                <Text style={styles.socialText}>{social.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Legal Links */}
                <View style={styles.section}>
                    <View style={styles.legalCard}>
                        <TouchableOpacity
                            style={styles.legalItem}
                            onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="shield-outline" size={18} color={COLORS.dark.textSecondary}/>
                            <Text style={styles.legalText}>Privacy Policy</Text>
                        </TouchableOpacity>

                        <View style={styles.legalDivider}/>

                        <TouchableOpacity
                            style={styles.legalItem}
                            onPress={() => navigation.navigate('PrivacyPolicyScreen')}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="document-text-outline" size={18} color={COLORS.dark.textSecondary}/>
                            <Text style={styles.legalText}>Terms of Service</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with</Text>
                    <Ionicons name="heart" size={16} color="#EF4444" style={styles.heartIcon}/>
                    <Text style={styles.footerText}>by the Agora Team</Text>
                </View>

                <Text style={styles.copyright}>© 2026 Agora. All rights reserved.</Text>
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
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    logoContainer: {
        marginBottom: 16,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: THEME.borderRadius.full,
        borderWidth: 3,
        borderColor: COLORS.dark.border,
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
        letterSpacing: -0.1,
    },
    versionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.cardElevated,
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
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primary,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    missionText: {
        fontSize: 15,
        color: COLORS.dark.text,
        lineHeight: 24,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    quoteIcon: {
        position: 'absolute',
        top: -5,
        right: -5,
        transform: [{rotate: '-15deg'}],
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    featureCard: {
        width: '48%',
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    featureIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    featureTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    featureText: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    contactCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
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
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
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
        letterSpacing: -0.2,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.dark.border,
        marginHorizontal: 16,
    },
    socialCard: {
        flexDirection: 'row',
        gap: 12,
    },
    socialButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        paddingVertical: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    socialIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    socialText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.dark.text,
        letterSpacing: -0.2,
    },
    legalCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    legalItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    legalText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
        letterSpacing: -0.1,
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