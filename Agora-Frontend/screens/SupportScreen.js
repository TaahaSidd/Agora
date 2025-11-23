import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Linking } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';

import { COLORS } from '../utils/colors';

const SupportScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader title="Support" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="help-buoy" size={40} color={COLORS.primary} />
                    </View>
                    <Text style={styles.headerTitle}>How can we help you?</Text>
                    <Text style={styles.headerSubtitle}>
                        Our support team is here to assist you with any questions or issues
                    </Text>
                </View>

                {/* Contact Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Get in Touch</Text>

                    <View style={styles.optionsCard}>
                        <TouchableOpacity
                            style={styles.optionItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.optionIconCircle, { backgroundColor: '#DBEAFE' }]}>
                                <Ionicons name="chatbubble-ellipses" size={22} color="#2563EB" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Live Chat</Text>
                                <Text style={styles.optionDescription}>Chat with our support team</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.optionItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.optionIconCircle, { backgroundColor: '#FEE2E2' }]}>
                                <MaterialIcons name="support-agent" size={22} color="#DC2626" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Submit a Ticket</Text>
                                <Text style={styles.optionDescription}>We'll respond within 24hrs</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.optionItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.optionIconCircle, { backgroundColor: '#DCFCE7' }]}>
                                <Ionicons name="mail" size={22} color="#16A34A" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Email Us</Text>
                                <Text style={styles.optionDescription}>support@agora.com</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.optionItem}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.optionIconCircle, { backgroundColor: '#FEF3C7' }]}>
                                <Ionicons name="call" size={22} color="#D97706" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Phone Support</Text>
                                <Text style={styles.optionDescription}>+91 123 456 7890</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Links */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Links</Text>

                    <View style={styles.quickLinksGrid}>
                        <TouchableOpacity
                            style={styles.quickLinkCard}
                            activeOpacity={0.7}
                        >
                            <View style={styles.quickLinkIcon}>
                                <Ionicons name="document-text" size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.quickLinkText}>Help Center</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickLinkCard}
                            activeOpacity={0.7}
                        >
                            <View style={styles.quickLinkIcon}>
                                <Ionicons name="book" size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.quickLinkText}>User Guide</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickLinkCard}
                            activeOpacity={0.7}
                        >
                            <View style={styles.quickLinkIcon}>
                                <Ionicons name="bug" size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.quickLinkText}>Report Bug</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickLinkCard}
                            activeOpacity={0.7}
                        >
                            <View style={styles.quickLinkIcon}>
                                <Ionicons name="bulb" size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.quickLinkText}>Feedback</Text>
                        </TouchableOpacity>
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
                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                            <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
                            <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
                        </TouchableOpacity>
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
        backgroundColor: COLORS.dark.gray700,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
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
        color: COLORS.dark.textTertiary,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
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
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
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
        backgroundColor: COLORS.dark.gray700,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 2,
    },
    optionDescription: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.dark.divider,
        marginHorizontal: 16,
    },
    quickLinksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    quickLinkCard: {
        width: '48%',
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    quickLinkIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.dark.gray700,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    quickLinkText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark.text,
        textAlign: 'center',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
});

export default SupportScreen;