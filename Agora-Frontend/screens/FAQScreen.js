import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';

import {COLORS} from '../utils/colors';

const faqData = [
    {
        question: "How do I buy or sell items?",
        answer: "Browse the feed, tap an item to see details, and chat with the seller. To sell, just tap the '+' icon and upload your item details.",
        icon: "cart-outline",
        gradient: ['#3B82F6', '#2563EB'],
    },
    {
        question: "How do I pay for items?",
        answer: "All payments happen directly between students. We recommend using UPI or cash only AFTER you have inspected the item in person.",
        icon: "card-outline",
        gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
        question: "Where should I meet the seller?",
        answer: "Always meet in public campus areas like the Library, Canteens, or Main Gate. Never meet in isolated areas or off-campus alone.",
        icon: "location-outline",
        gradient: ['#EC4899', '#DB2777'],
    },
    {
        question: "Is my data safe?",
        answer: "Absolutely. We only use your data for campus verification. Your phone number is only shared if you choose to show it.",
        icon: "shield-checkmark-outline",
        gradient: ['#10B981', '#059669'],
    },
    {
        question: "How do I report a scam or issue?",
        answer: "Tap the 'Flag' icon on any listing or user profile. Our student moderation team reviews all reports within 24 hours.",
        icon: "flag-outline",
        gradient: ['#F59E0B', '#D97706'],
    },
    {
        question: "Can I search for specific items?",
        answer: "Yes! Use the search bar at the top or filter by categories like Textbooks, Electronics, or Cycle to find what you need.",
        icon: "search-outline",
        gradient: ['#06B6D4', '#0891B2'],
    },
    {
        question: "Can I delete my account?",
        answer: "Yes. Go to Profile → Settings → Delete Account. All your listings and data will be permanently removed from our servers.",
        icon: "trash-outline",
        gradient: ['#EF4444', '#DC2626'],
    },
    {
        question: "Who runs Agora?",
        answer: "Agora is a student-led initiative built to help the college community. We aren't a business—we're your peers!",
        icon: "people-outline",
        gradient: ['#14B8A6', '#0D9488'],
    }
];


export default function FAQScreen({navigation}) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Status bar changed to light bg with dark icons */}
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content"/>
            <AppHeader title="FAQs" onBack={() => navigation.goBack()}/>

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
                        activeOpacity={0.85}
                    >
                        <View style={styles.questionRow}>
                            <LinearGradient
                                colors={item.gradient}
                                style={styles.iconCircle}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            >
                                <Ionicons
                                    name={item.icon}
                                    size={22}
                                    color="#fff"
                                />
                            </LinearGradient>
                            <Text style={styles.question}>{item.question}</Text>
                            <View style={styles.chevronContainer}>
                                <Ionicons
                                    name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={COLORS.light.textTertiary}
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
                        <LinearGradient
                            colors={['#3B82F6', '#2563EB']}
                            style={styles.helpIconGradient}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                        >
                            <Ionicons name="help-circle" size={32} color="#fff"/>
                        </LinearGradient>
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
        backgroundColor: COLORS.light.bg,
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    headerSection: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        fontWeight: '500',
        lineHeight: 20,
    },
    item: {
        backgroundColor: COLORS.white,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    itemExpanded: {
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderColor: COLORS.primary + '30', // Subtle highlight when expanded
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
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    question: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.text,
        lineHeight: 20,
        letterSpacing: -0.2,
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
        borderTopColor: COLORS.light.border,
    },
    answer: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        lineHeight: 22,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    helpCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.light.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    helpIconContainer: {
        marginBottom: 16,
    },
    helpIconGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    helpTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.light.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    helpText: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        letterSpacing: -0.1,
    },
});