import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../utils/colors';

const privacyData = [
    {
        title: 'Introduction',
        icon: 'shield-checkmark',
        color: '#3B82F6',
        content: 'We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.',
    },
    {
        title: 'Information We Collect',
        icon: 'document-text',
        color: '#8B5CF6',
        content: 'We collect the following information to provide you with our services:',
        list: [
            'Name, email address, and phone number',
            'Profile details and preferences',
            'App usage data and analytics',
            'Device information and location',
        ],
    },
    {
        title: 'How We Use Your Data',
        icon: 'settings',
        color: '#10B981',
        content: 'Your information is used to:',
        list: [
            'Provide and improve our services',
            'Communicate important updates',
            'Ensure security and prevent fraud',
            'Comply with legal obligations',
        ],
    },
    {
        title: 'Third-party Sharing',
        icon: 'people',
        color: '#F59E0B',
        content: 'We do not share your personal data with third parties without your consent, except when required by law or necessary to provide our services.',
    },
    {
        title: 'Your Rights',
        icon: 'hand-right',
        color: '#EF4444',
        content: 'You have the right to:',
        list: [
            'Access and update your personal data',
            'Request deletion of your information',
            'Withdraw consent at any time',
            'Export your data in a readable format',
        ],
    },
    {
        title: 'Data Security',
        icon: 'lock-closed',
        color: '#6366F1',
        content: 'We implement industry-standard security measures to protect your data from unauthorized access, alteration, or destruction.',
    },
    {
        title: 'Contact Us',
        icon: 'mail',
        color: '#14B8A6',
        content: 'For privacy-related questions or concerns, please contact us at support@agora.com',
    },
];

export default function PrivacyPolicyScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="Privacy Policy" onBack={() => navigation.goBack()} />

            <ScrollView 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
            >
                {/* Header Info */}
                <View style={styles.headerCard}>
                    <View style={styles.headerIconCircle}>
                        <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
                    </View>
                    <Text style={styles.headerTitle}>Your Privacy Matters</Text>
                    <Text style={styles.headerSubtitle}>
                        Last updated: January 2025
                    </Text>
                </View>

                {/* Privacy Sections */}
                {privacyData.map((section, index) => (
                    <View key={index} style={styles.sectionCard}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.iconCircle, { backgroundColor: `${section.color}15` }]}>
                                <Ionicons name={section.icon} size={22} color={section.color} />
                            </View>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                        </View>

                        <Text style={styles.sectionContent}>{section.content}</Text>

                        {section.list && (
                            <View style={styles.listContainer}>
                                {section.list.map((item, idx) => (
                                    <View key={idx} style={styles.listItem}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.listText}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                {/* Footer Note */}
                <View style={styles.footerCard}>
                    <Ionicons name="information-circle" size={20} color={COLORS.primary} />
                    <Text style={styles.footerText}>
                        By using Agora, you agree to our Privacy Policy and Terms of Service.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    headerCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerIconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        flex: 1,
        letterSpacing: -0.3,
    },
    sectionContent: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 24,
        marginBottom: 12,
        fontWeight: '500',
    },
    listContainer: {
        marginTop: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        paddingLeft: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginTop: 8,
        marginRight: 12,
    },
    listText: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 22,
        fontWeight: '500',
    },
    footerCard: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    footerText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        marginLeft: 12,
        lineHeight: 20,
        fontWeight: '500',
    },
});