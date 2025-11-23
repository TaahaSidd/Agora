import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const faqData = [
    {
        question: "How do I buy or sell items?",
        answer: "Explore listings, tap an item to see details, and contact the seller via the in-app chat.",
        icon: "cart-outline",
        iconColor: "#3B82F6",
        iconBg: "#DBEAFE",
    },
    {
        question: "Is my data safe?",
        answer: "Yes, we follow strict privacy policies. Your personal info is never shared without consent.",
        icon: "shield-checkmark-outline",
        iconColor: "#10B981",
        iconBg: "#D1FAE5",
    },
    {
        question: "Can I delete my account?",
        answer: "Yes, navigate to Settings → Account → Delete Account. Please note this is permanent.",
        icon: "trash-outline",
        iconColor: "#EF4444",
        iconBg: "#FEE2E2",
    },
    {
        question: "What payment methods are supported?",
        answer: "Currently, all transactions happen in person. Online payment methods may be added in future updates.",
        icon: "card-outline",
        iconColor: "#8B5CF6",
        iconBg: "#EDE9FE",
    },
    {
        question: "How do I report a user or listing?",
        answer: "Go to the listing or user profile, tap 'Report', and provide details. Our team will review it promptly.",
        icon: "flag-outline",
        iconColor: "#F59E0B",
        iconBg: "#FEF3C7",
    },
    {
        question: "Can I search for items by category?",
        answer: "Yes, use the category filters on the Explore screen to narrow down listings by type and price.",
        icon: "search-outline",
        iconColor: "#06B6D4",
        iconBg: "#CFFAFE",
    },
    {
        question: "How can I see items near my college?",
        answer: "We currently show listings from your selected college. Future updates may include real-time location filters.",
        icon: "location-outline",
        iconColor: "#EC4899",
        iconBg: "#FCE7F3",
    },
    {
        question: "How do I contact the seller?",
        answer: "Each listing has a chat button. Tap it to start a conversation with the seller.",
        icon: "chatbubble-outline",
        iconColor: "#14B8A6",
        iconBg: "#CCFBF1",
    }
];

export default function FAQScreen({ navigation }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="FAQs" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
                    <Text style={styles.headerSubtitle}>
                        Find answers to common questions about using Agora
                    </Text>
                </View>

                {/* FAQ Items */}
                {faqData.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.item,
                            expandedIndex === index && styles.itemExpanded
                        ]}
                        onPress={() => toggleExpand(index)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.questionRow}>
                            <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                                <Ionicons
                                    name={item.icon}
                                    size={22}
                                    color={item.iconColor}
                                />
                            </View>
                            <Text style={styles.question}>{item.question}</Text>
                            <View style={styles.chevronContainer}>
                                <Ionicons
                                    name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color="#9CA3AF"
                                />
                            </View>
                        </View>

                        {expandedIndex === index && (
                            <View style={styles.answerContainer}>
                                <Text style={styles.answer}>{item.answer}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}

                {/* Bottom Help Section */}
                <View style={styles.helpCard}>
                    <View style={styles.helpIconContainer}>
                        <Ionicons name="help-circle" size={32} color={COLORS.primary} />
                    </View>
                    <Text style={styles.helpTitle}>Still need help?</Text>
                    <Text style={styles.helpText}>
                        Can't find what you're looking for? Our support team is here to help.
                    </Text>
                    <Button
                        title="Contact Support"
                        onPress={() => navigation.navigate('SupportScreen')}
                        icon="headset-outline"
                        fullWidth
                        size="medium"
                    />
                </View>
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

    // Header
    headerSection: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.dark.text,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
        lineHeight: 20,
    },

    // FAQ Item
    item: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 2,
    },

    itemExpanded: {
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 3,
    },

    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        backgroundColor: COLORS.dark.gray700,
    },

    question: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
        lineHeight: 20,
    },

    chevronContainer: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    answerContainer: {
        marginTop: 12,
        marginLeft: 56,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.dark.divider,
    },

    answer: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 22,
        fontWeight: '500',
    },

    // Help Card
    helpCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 2,
    },

    helpIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.primaryLightest,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    helpTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
    },

    helpText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
});