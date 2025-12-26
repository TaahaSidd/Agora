import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';

import {COLORS} from '../utils/colors';

const SupportScreen = ({navigation}) => {
    const contactOptions = [
        {
            title: 'Live Chat',
            description: 'Chat with our support team',
            icon: 'chatbubble-ellipses',
            gradient: ['#3B82F6', '#2563EB'],
            iconType: 'ion',
        },
        {
            title: 'Submit a Ticket',
            description: "We'll respond within 24hrs",
            icon: 'support-agent',
            gradient: ['#EF4444', '#DC2626'],
            iconType: 'material',
        },
        {
            title: 'Email Us',
            description: 'support@agora.com',
            icon: 'mail',
            gradient: ['#10B981', '#059669'],
            iconType: 'ion',
        },
        {
            title: 'Phone Support',
            description: '+91 123 456 7890',
            icon: 'call',
            gradient: ['#F59E0B', '#D97706'],
            iconType: 'ion',
        },
    ];

    const quickLinks = [
        {icon: 'document-text', label: 'Help Center', gradient: ['#3B82F6', '#2563EB']},
        {icon: 'book', label: 'User Guide', gradient: ['#8B5CF6', '#7C3AED']},
        {icon: 'bug', label: 'Report Bug', gradient: ['#EF4444', '#DC2626']},
        {icon: 'bulb', label: 'Feedback', gradient: ['#F59E0B', '#D97706']},
    ];

    const socialLinks = [
        {icon: 'logo-twitter', color: '#1DA1F2'},
        {icon: 'logo-facebook', color: '#4267B2'},
        {icon: 'logo-instagram', color: '#E4405F'},
        {icon: 'logo-linkedin', color: '#0A66C2'},
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader title="Support" onBack={() => navigation.goBack()}/>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={styles.iconCircle}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name="help-buoy" size={40} color="#fff"/>
                    </LinearGradient>
                    <Text style={styles.headerTitle}>How can we help you?</Text>
                    <Text style={styles.headerSubtitle}>
                        Our support team is here to assist you with any questions or issues
                    </Text>
                </View>

                {/* Contact Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>

                    <View style={styles.optionsCard}>
                        {contactOptions.map((option, index) => (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    activeOpacity={0.85}
                                >
                                    <LinearGradient
                                        colors={option.gradient}
                                        style={styles.optionIconCircle}
                                        start={{x: 0, y: 0}}
                                        end={{x: 1, y: 1}}
                                    >
                                        {option.iconType === 'material' ? (
                                            <MaterialIcons name={option.icon} size={22} color="#fff"/>
                                        ) : (
                                            <Ionicons name={option.icon} size={22} color="#fff"/>
                                        )}
                                    </LinearGradient>
                                    <View style={styles.optionContent}>
                                        <Text style={styles.optionTitle}>{option.title}</Text>
                                        <Text style={styles.optionDescription}>{option.description}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.dark.textTertiary}/>
                                </TouchableOpacity>
                                {index !== contactOptions.length - 1 && <View style={styles.divider}/>}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Quick Links */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Links</Text>

                    <View style={styles.quickLinksGrid}>
                        {quickLinks.map((link, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.quickLinkCard}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={link.gradient}
                                    style={styles.quickLinkIcon}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                >
                                    <Ionicons name={link.icon} size={24} color="#fff"/>
                                </LinearGradient>
                                <Text style={styles.quickLinkText}>{link.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Info Card */}
                <InfoBox
                    icon="time-outline"
                    text="Our support team typically responds within 24 hours. For urgent issues, please use the live chat option."
                />

                {/* Social Media */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Follow Us</Text>
                    <View style={styles.socialContainer}>
                        {socialLinks.map((social, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.socialButton}
                                activeOpacity={0.85}
                            >
                                <Ionicons name={social.icon} size={24} color={social.color}/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 32,
        paddingVertical: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#3B82F6',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
        letterSpacing: -0.1,
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
    optionsCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    optionIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 2,
        letterSpacing: -0.2,
    },
    optionDescription: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.dark.border,
        marginHorizontal: 16,
    },
    quickLinksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickLinkCard: {
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
    quickLinkIcon: {
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
    quickLinkText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
        letterSpacing: -0.2,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    socialButton: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.dark.card,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
});

export default SupportScreen;