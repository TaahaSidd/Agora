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
            title: 'Email Us',
            description: 'hello.spicalabs@gmail.com',
            icon: 'mail',
            gradient: ['#10B981', '#059669'],
            iconType: 'ion',
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader title="Support" onBack={() => navigation.goBack()} />

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
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.light.textTertiary}/>
                                </TouchableOpacity>
                                {index !== contactOptions.length - 1 && <View style={styles.divider}/>}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Info Card */}
                <InfoBox
                    icon="time-outline"
                    text="Our support team typically responds within 24 hours. For urgent issues, please use our email support."
                />
            </ScrollView>
        </SafeAreaView>
    );
};

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
        // Blue Glow for Light Mode
        shadowColor: '#3B82F6',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.light.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.light.textSecondary,
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
        color: COLORS.light.text,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    optionsCard: {
        backgroundColor: COLORS.light.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        overflow: 'hidden',
        // Softer shadow for light mode
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 10,
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
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.light.text,
        marginBottom: 2,
        letterSpacing: -0.2,
    },
    optionDescription: {
        fontSize: 13,
        color: COLORS.light.textSecondary,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.light.border,
        marginHorizontal: 16,
    },
});

export default SupportScreen;