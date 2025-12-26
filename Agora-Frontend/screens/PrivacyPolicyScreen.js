import React from 'react';
import {View, Text, SafeAreaView, ScrollView, StyleSheet, StatusBar} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';

import {COLORS} from '../utils/colors';

export default function PrivacyPolicyScreen({navigation}) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>
            <AppHeader title="Privacy Policy" onBack={() => navigation.goBack()}/>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.headerCard}>
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.headerIconCircle}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name="shield-checkmark" size={32} color="#fff"/>
                    </LinearGradient>
                    <Text style={styles.headerTitle}>Your Privacy Matters</Text>
                    <Text style={styles.headerSubtitle}>Last updated: January 2025</Text>
                </View>

                {/* Content Card */}
                <View style={styles.contentCard}>
                    {/* Introduction */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Introduction</Text>
                        <Text style={styles.paragraph}>
                            We value your privacy and are committed to protecting your personal information. This policy
                            explains how we collect, use, and safeguard your data.
                        </Text>
                    </View>

                    {/* Information We Collect */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Information We Collect</Text>
                        <Text style={styles.paragraph}>
                            We collect the following information to provide you with our services:
                        </Text>
                        <View style={styles.list}>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Name, email address, and phone number</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Profile details and preferences</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>App usage data and analytics</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Device information and location</Text>
                            </View>
                        </View>
                    </View>

                    {/* How We Use Your Data */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>How We Use Your Data</Text>
                        <Text style={styles.paragraph}>Your information is used to:</Text>
                        <View style={styles.list}>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Provide and improve our services</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Communicate important updates</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Ensure security and prevent fraud</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Comply with legal obligations</Text>
                            </View>
                        </View>
                    </View>

                    {/* Third-party Sharing */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Third-party Sharing</Text>
                        <Text style={styles.paragraph}>
                            We do not share your personal data with third parties without your consent, except when
                            required by law or necessary to provide our services.
                        </Text>
                    </View>

                    {/* Your Rights */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Your Rights</Text>
                        <Text style={styles.paragraph}>You have the right to:</Text>
                        <View style={styles.list}>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Access and update your personal data</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Request deletion of your information</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Withdraw consent at any time</Text>
                            </View>
                            <View style={styles.listItem}>
                                <View style={styles.bullet}/>
                                <Text style={styles.listText}>Export your data in a readable format</Text>
                            </View>
                        </View>
                    </View>

                    {/* Data Security */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Data Security</Text>
                        <Text style={styles.paragraph}>
                            We implement industry-standard security measures to protect your data from unauthorized
                            access, alteration, or destruction.
                        </Text>
                    </View>

                    {/* Contact */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Us</Text>
                        <Text style={styles.paragraph}>
                            For privacy-related questions or concerns, please contact us at support@agora.com
                        </Text>
                    </View>
                </View>

                {/* Footer Note */}
                <InfoBox
                    text="By using Agora, you agree to our Privacy Policy and Terms of Service."
                    icon="information-circle"
                />
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
    headerCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    headerIconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#10B981',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
    },
    contentCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    paragraph: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        lineHeight: 24,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    list: {
        marginTop: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginTop: 9,
        marginRight: 12,
    },
    listText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        lineHeight: 24,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
});