import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Linking } from 'react-native';

import AppHeader from '../components/AppHeader';
import SettingsOptionList from '../components/SettingsOptionList';
import { COLORS } from '../utils/colors';

const contactOptions = [
    {
        label: 'Email Support',
        description: 'hello.spicalabs@gmail.com',
        icon: 'mail',
        iconColor: '#10B981',
        onPress: () => Linking.openURL('mailto:hello.spicalabs@gmail.com?subject=Agora Support Request'),
    },
    {
        label: 'Instagram',
        description: '@hello.spicalabs',
        icon: 'logo-instagram',
        iconColor: '#E1306C',
        onPress: () => Linking.openURL('https://www.instagram.com/hello.spicalabs?igsh=MW15ejRkeWhqMDI4eg=='),
    },
];

const SupportScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />
            <AppHeader title="Support" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.hero}>
                    {/* <View style={styles.badge}>
                        <Text style={styles.badgeText}>WE'RE HERE TO HELP</Text>
                    </View> */}
                    <Text style={styles.heroTitle}>Get in touch{'\n'}with Spica Labs</Text>
                    <Text style={styles.heroSubtitle}>
                        Have an issue or a suggestion? Reach out via our official channels below.
                    </Text>
                </View>

                <SettingsOptionList
                    title="Official Channels"
                    options={contactOptions}
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
        padding: 16,
        paddingBottom: 40,
    },
    hero: {
        marginBottom: 20,
        marginTop: 4,
    },
    badge: {
        backgroundColor: `${COLORS.primary}12`,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: `${COLORS.primary}20`,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.primary,
        letterSpacing: 0.8,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        lineHeight: 30,
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },
});

export default SupportScreen;