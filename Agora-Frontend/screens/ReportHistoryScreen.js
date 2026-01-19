import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';
import AppHeader from '../components/AppHeader';
import {apiGet} from '../services/api';

const ReportHistoryScreen = ({navigation}) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await apiGet('/report/my-reports');
            console.log("RESPONSE ->", response);
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

    const getStatusInfo = (status) => {
        switch (status) {
            case 'PENDING':
                return {
                    label: 'Under Review',
                    color: '#F59E0B',
                    icon: 'time',
                    gradient: ['#F59E0B', '#D97706']
                };
            case 'REVIEWING':
                return {
                    label: 'Being Reviewed',
                    color: '#3B82F6',
                    icon: 'eye',
                    gradient: ['#3B82F6', '#2563EB']
                };
            case 'RESOLVED':
                return {
                    label: 'Resolved',
                    color: '#10B981',
                    icon: 'checkmark-circle',
                    gradient: ['#10B981', '#059669']
                };
            case 'DISMISSED':
                return {
                    label: 'Dismissed',
                    color: '#6B7280',
                    icon: 'close-circle',
                    gradient: ['#6B7280', '#4B5563']
                };
            default:
                return {
                    label: 'Unknown',
                    color: '#6B7280',
                    icon: 'help-circle',
                    gradient: ['#6B7280', '#4B5563']
                };
        }
    };

    const getReportTypeLabel = (type) => {
        switch (type) {
            case 'LISTING':
                return 'Listing Report';
            case 'USER':
                return 'User Report';
            default:
                return 'Other Report';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const renderReportCard = ({item}) => {
        const statusInfo = getStatusInfo(item.reportStatus); // Updated key
        const isListing = item.reportType === 'LISTING';

        return (
            <TouchableOpacity
                style={styles.reportCard}
                activeOpacity={0.8}
            >
                <View style={styles.statusBadgeContainer}>
                    <LinearGradient
                        colors={statusInfo.gradient}
                        style={styles.statusBadge}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                    >
                        <Ionicons name={statusInfo.icon} size={12} color="#fff"/>
                        <Text style={styles.statusText}>{statusInfo.label}</Text>
                    </LinearGradient>
                </View>

                <View style={styles.reportInfo}>
                    <Text style={styles.reportType}>
                        {isListing ? item.reportedListingTitle : `User: ${item.reportedUserName}`}
                    </Text>

                    <Text style={styles.reportReason} numberOfLines={1}>
                        Reason: {item.reportReason}
                    </Text>

                    <Text style={styles.reportDate}>{formatDate(item.reportedAt)}</Text>
                </View>

            </TouchableOpacity>
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="document-text-outline" size={80} color={COLORS.dark.textTertiary}/>
            </View>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptySubtitle}>
                Your submitted reports will appear here
            </Text>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <AppHeader title="Report History" onBack={() => navigation.goBack()}/>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary}/>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <AppHeader title="Report History" onBack={() => navigation.goBack()}/>

            {/* Status Legend */}
            <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Report Status Guide</Text>
                <View style={styles.legendGrid}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, {backgroundColor: '#F59E0B'}]}/>
                        <Text style={styles.legendText}>Under Review</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, {backgroundColor: '#3B82F6'}]}/>
                        <Text style={styles.legendText}>Being Reviewed</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, {backgroundColor: '#10B981'}]}/>
                        <Text style={styles.legendText}>Resolved</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendDot, {backgroundColor: '#6B7280'}]}/>
                        <Text style={styles.legendText}>Dismissed</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={reports}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderReportCard}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
        marginTop: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    legendContainer: {
        backgroundColor: COLORS.dark.card,
        marginHorizontal: THEME.spacing.md,
        marginTop: THEME.spacing.md,
        padding: THEME.spacing.md,
        borderRadius: THEME.borderRadius.lg,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    legendTitle: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.sm,
    },
    legendGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },
    listContent: {
        padding: THEME.spacing.md,
        paddingBottom: 100,
    },
    reportCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.sm,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadgeContainer: {
        marginRight: THEME.spacing.md,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    reportInfo: {
        flex: 1,
    },
    reportType: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.semibold,
        marginBottom: 2,
    },
    reportReason: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.text,
        fontWeight: THEME.fontWeight.semibold,
        marginBottom: 4,
    },
    reportDate: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyIconContainer: {
        marginBottom: THEME.spacing.lg,
        opacity: 0.4,
    },
    emptyTitle: {
        fontSize: THEME.fontSize.xl,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.sm,
    },
    emptySubtitle: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
    },
});

export default ReportHistoryScreen;