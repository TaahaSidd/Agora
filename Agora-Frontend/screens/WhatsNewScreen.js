import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import AppHeader from '../components/AppHeader';
import { supabase } from '../utils/supabase';

const WhatsNewScreen = ({ navigation }) => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpdates();
    }, []);

    const fetchUpdates = async () => {
        try {
            const { data, error } = await supabase
                .from('whats_new')
                .select('id, version, title, description, date')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUpdates(data);
        } catch (error) {
            console.error('Failed to fetch updates:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title="Updates"
                onBack={() => navigation.goBack()}
            />

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {updates.map((item, index) => (
                        <View key={item.id} style={styles.updateItem}>
                            <View style={styles.metaRow}>
                                <Text style={styles.versionText}>{item.version}</Text>
                                <Text style={styles.dateText}>{item.date}</Text>
                            </View>

                            <Text style={styles.titleText}>{item.title}</Text>
                            <Text style={styles.descriptionText}>{item.description}</Text>

                            {index !== updates.length - 1 && <View style={styles.divider} />}
                        </View>
                    ))}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>More updates coming soon.</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 24,
    },
    updateItem: {
        marginBottom: 24,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    versionText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#10B981',
        letterSpacing: 1,
    },
    dateText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.light.textTertiary,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.light.text,
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: COLORS.light.textSecondary,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.light.border,
        marginTop: 24,
        opacity: 0.5,
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
        paddingBottom: 40,
    },
    footerText: {
        fontSize: 13,
        color: COLORS.light.textTertiary,
        fontStyle: 'italic',
    }
});

export default WhatsNewScreen;