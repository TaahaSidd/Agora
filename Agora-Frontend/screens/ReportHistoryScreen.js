import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../utils/colors';
import AppHeader from '../components/AppHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiGet } from '../services/api';

// ─── Helpers ───────────────────────────────────────────────────────────────────

const getStatusInfo = (status) => {
    switch (status) {
        case 'PENDING': return { label: 'Under Review', color: '#F59E0B', icon: 'time' };
        case 'REVIEWING': return { label: 'Being Reviewed', color: '#3B82F6', icon: 'eye' };
        case 'RESOLVED': return { label: 'Resolved', color: '#10B981', icon: 'checkmark-circle' };
        case 'DISMISSED': return { label: 'Dismissed', color: COLORS.gray400, icon: 'close-circle' };
        default: return { label: 'Unknown', color: COLORS.gray400, icon: 'help-circle' };
    }
};

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const LEGEND = [
    { label: 'Under Review', color: '#F59E0B' },
    { label: 'Being Reviewed', color: '#3B82F6' },
    { label: 'Resolved', color: '#10B981' },
    { label: 'Dismissed', color: COLORS.gray400 },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

const ReportRow = ({ item, isLast }) => {
    const { label, color, icon } = getStatusInfo(item.reportStatus);
    const isListing = item.reportType === 'LISTING';

    return (
        <View style={[styles.row, !isLast && styles.rowBorder]}>
            <View style={[styles.statusIconWrapper, { backgroundColor: `${color}12` }]}>
                <Ionicons name={icon} size={18} color={color} />
            </View>

            <View style={styles.rowContent}>
                <View style={styles.rowTop}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                        {isListing ? item.reportedListingTitle : `User: ${item.reportedUserName}`}
                    </Text>
                    <View style={[styles.statusPill, { backgroundColor: `${color}12` }]}>
                        <Text style={[styles.statusPillText, { color }]}>{label}</Text>
                    </View>
                </View>
                <Text style={styles.rowReason} numberOfLines={1}>{item.reportReason}</Text>
                <Text style={styles.rowDate}>{formatDate(item.reportedAt)}</Text>
            </View>
        </View>
    );
};

// ─── Main Screen ───────────────────────────────────────────────────────────────

const ReportHistoryScreen = ({ navigation }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await apiGet('/report/my-reports');
            setReports(response || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchReports();
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <AppHeader title="Report History" onBack={() => navigation.goBack()} />
                <View style={styles.centered}>
                    <LoadingSpinner />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <AppHeader title="Report History" onBack={() => navigation.goBack()} />

            <FlatList
                data={reports}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <ReportRow
                        item={item}
                        isLast={index === reports.length - 1}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
                ListHeaderComponent={
                    <>
                        {/* Hero */}
                        <View style={styles.hero}>
                            <Text style={styles.heroTitle}>Report History</Text>
                            <Text style={styles.heroSubtitle}>
                                Track the status of reports you've submitted to our moderation team.
                            </Text>
                        </View>

                        {/* Legend */}
                        <View style={styles.legendCard}>
                            <Text style={styles.legendTitle}>Status Guide</Text>
                            <View style={styles.legendGrid}>
                                {LEGEND.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendText}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {reports.length > 0 && (
                            <Text style={styles.sectionTitle}>Your Reports</Text>
                        )}
                    </>
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <View style={styles.emptyIconWrapper}>
                            <Ionicons name="document-text-outline" size={28} color={COLORS.gray400} />
                        </View>
                        <Text style={styles.emptyTitle}>No Reports Yet</Text>
                        <Text style={styles.emptyText}>Your submitted reports will appear here.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },

    // Hero
    hero: {
        marginTop: 8,
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

    // Legend card
    legendCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 14,
        marginBottom: 20,
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
    legendTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    legendText: {
        fontSize: 12,
        color: COLORS.gray400,
        fontWeight: '500',
    },

    // Section title
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
        marginLeft: 4,
    },

    // Report rows — flat list style
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
        backgroundColor: COLORS.light.bg,
    },
    rowBorder: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    statusIconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    rowContent: {
        flex: 1,
    },
    rowTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 3,
        gap: 8,
    },
    rowTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
        flex: 1,
    },
    statusPill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
    },
    statusPillText: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    rowReason: {
        fontSize: 12,
        color: COLORS.gray400,
        marginBottom: 2,
    },
    rowDate: {
        fontSize: 11,
        color: COLORS.gray300,
    },

    // Empty
    emptyIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.3,
        marginBottom: 6,
    },
    emptyText: {
        fontSize: 13,
        color: COLORS.gray400,
        textAlign: 'center',
    },
});

export default ReportHistoryScreen;