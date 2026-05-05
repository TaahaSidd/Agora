import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import { COLORS } from '../utils/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
    {
        question: 'How do I buy or sell items?',
        answer: "Browse the feed, tap an item to see details, and chat with the seller. To sell, tap the '+' icon and upload your item details.",
        icon: 'cart',
        color: '#3B82F6',
    },
    {
        question: 'How do I pay for items?',
        answer: 'All payments happen directly between students. We recommend using UPI or cash only after you have inspected the item in person.',
        icon: 'card',
        color: '#8B5CF6',
    },
    {
        question: 'Where should I meet the seller?',
        answer: 'Always meet in public campus areas like the Library, Canteens, or Main Gate. Never meet in isolated areas or off-campus alone.',
        icon: 'location',
        color: '#EC4899',
    },
    {
        question: 'Is my data safe?',
        answer: 'We only use your data for campus verification. Your phone number is only shared if you choose to show it.',
        icon: 'shield-checkmark',
        color: '#10B981',
    },
    {
        question: 'How do I report a scam or issue?',
        answer: "Tap the 'Flag' icon on any listing or user profile. Our moderation team reviews all reports within 24 hours.",
        icon: 'flag',
        color: '#F59E0B',
    },
];

export default function FAQScreen({ navigation }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />
            <AppHeader title="Help Center" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Support & FAQs</Text>
                    <Text style={styles.heroSubtitle}>
                        Everything you need to know about the Agora campus marketplace.
                    </Text>
                </View>

                {/* FAQ items */}
                {faqData.map((item, index) => {
                    const isExpanded = expandedIndex === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.item, isExpanded && styles.itemExpanded]}
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.6}
                        >
                            <View style={styles.questionRow}>
                                <View style={[styles.iconWrapper, { backgroundColor: `${item.color}12` }]}>
                                    <Ionicons name={item.icon} size={18} color={item.color} />
                                </View>
                                <Text style={styles.question}>{item.question}</Text>
                                <Ionicons
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={14}
                                    color={isExpanded ? COLORS.primary : COLORS.gray300}
                                />
                            </View>

                            {isExpanded && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answer}>{item.answer}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

                {/* Help card */}
                <View style={styles.helpCard}>
                    <Text style={styles.helpTitle}>Still have questions?</Text>
                    <Text style={styles.helpSubtitle}>
                        Our student support team is online and ready to help.
                    </Text>
                    <Button
                        title="Chat with Support"
                        onPress={() => navigation.navigate('SupportScreen')}
                        icon="chatbubbles-outline"
                        fullWidth
                        variant="primary"
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
        padding: 16,
        paddingBottom: 40,
    },

    // Hero
    hero: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },

    // FAQ items
    item: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 14,
        marginBottom: 8,
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
    itemExpanded: {
        borderColor: `${COLORS.primary}30`,
    },
    questionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    question: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
    },
    answerContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.gray100,
    },
    answer: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 20,
    },

    // Help card
    helpCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        alignItems: 'center',
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
    helpTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    helpSubtitle: {
        fontSize: 12,
        color: COLORS.gray400,
        textAlign: 'center',
        marginBottom: 14,
        lineHeight: 17,
    },
});