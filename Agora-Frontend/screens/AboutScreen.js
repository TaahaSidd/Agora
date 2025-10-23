import React from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, StatusBar, Image, TouchableOpacity, Linking } from 'react-native';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../utils/colors';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="About" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/Logo-app.jpg')}
                            style={styles.logo}
                        />
                    </View>
                    <Text style={styles.title}>Agora</Text>
                    <Text style={styles.subtitle}>Your student marketplace app for buying, selling, and connecting.</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Version</Text>
                        <Text style={styles.sectionText}>v1.0.0</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:support@agora.com')}>
                            <Text style={[styles.sectionText, styles.link]}>support@agora.com</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://agora.com')}>
                            <Text style={[styles.sectionText, styles.link]}>www.agora.com</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Made with ❤️ by Agora Team</Text>
                    </View>
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 16,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    section: {
        marginTop: 16,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    sectionText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 4,
    },
    link: {
        color: COLORS.primary,
        textDecorationLine: 'underline',
        marginBottom: 4,
    },
});
