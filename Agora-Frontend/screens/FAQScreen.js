import React, {useState} from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const faqData = [
    {
        question: "How do I buy or sell items?",
        answer: "Explore listings, tap an item to see details, and contact the seller via the in-app chat.",
        icon: "cart-outline",
        gradient: ['#3B82F6', '#2563EB'],
    },
    {
        question: "Is my data safe?",
        answer: "Yes, we follow strict privacy policies. Your personal info is never shared without consent.",
        icon: "shield-checkmark-outline",
        gradient: ['#10B981', '#059669'],
    },
    {
        question: "Can I delete my account?",
        answer: "Yes, navigate to Settings → Account → Delete Account. Please note this is permanent.",
        icon: "trash-outline",
        gradient: ['#EF4444', '#DC2626'],
    },
    {
        question: "What payment methods are supported?",
        answer: "Currently, all transactions happen in person. Online payment methods may be added in future updates.",
        icon: "card-outline",
        gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
        question: "How do I report a user or listing?",
        answer: "Go to the listing or user profile, tap 'Report', and provide details. Our team will review it promptly.",
        icon: "flag-outline",
        gradient: ['#F59E0B', '#D97706'],
    },
    {
        question: "Can I search for items by category?",
        answer: "Yes, use the category filters on the Explore screen to narrow down listings by type and price.",
        icon: "search-outline",
        gradient: ['#06B6D4', '#0891B2'],
    },
    {
        question: "How can I see items near my college?",
        answer: "We currently show listings from your selected college. Future updates may include real-time location filters.",
        icon: "location-outline",
        gradient: ['#EC4899', '#DB2777'],
    },
    {
        question: "How do I contact the seller?",
        answer: "Each listing has a chat button. Tap it to start a conversation with the seller.",
        icon: "chatbubble-outline",
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
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>
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
                                    color={COLORS.dark.textTertiary}
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
        backgroundColor: COLORS.dark.bg,
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
    item: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    itemExpanded: {
        shadowOpacity: 0.15,
        shadowRadius: 8,
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
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    question: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
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
        borderTopColor: COLORS.dark.border,
    },
    answer: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 22,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    helpCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
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
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    helpTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    helpText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        letterSpacing: -0.1,
    },
});