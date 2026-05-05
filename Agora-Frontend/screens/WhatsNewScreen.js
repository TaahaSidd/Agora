import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator, Alert, Dimensions, Modal, Platform, RefreshControl,
    ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '../utils/colors';
import AppHeader from '../components/AppHeader';
import {supabase} from '../utils/supabase';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const StatusBadge = ({status}) => {
    const isLive = status?.toLowerCase() === 'live';
    return (
        <View style={[styles.badge, {backgroundColor: isLive ? `${COLORS.success}12` : `${COLORS.warning}12`}]}>
            <Text style={[styles.badgeText, {color: isLive ? COLORS.success : COLORS.warning}]}>
                {isLive ? 'Live' : 'Coming Soon'}
            </Text>
        </View>
    );
};

const UpdateCard = ({item, onPress}) => {
    const isLive = item.status?.toLowerCase() === 'live';
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress(item)}
            style={[styles.card, !isLive && styles.cardUpcoming]}
        >
            <View style={styles.cardHeader}>
                <StatusBadge status={item.status}/>
                <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.cardFooter}>
                <Text style={styles.viewDetails}>View details</Text>
                <Ionicons name="chevron-forward" size={13} color={COLORS.gray300}/>
            </View>
        </TouchableOpacity>
    );
};

const UpdatesScreen = ({navigation}) => {
    const insets = useSafeAreaInsets();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState(null);

    const fetchUpdates = async () => {
        try {
            const {data, error} = await supabase
                .from('whats_new')
                .select('*')
                .eq('is_published', true)
                .order('created_at', {ascending: false});
            if (error) throw error;
            setUpdates(data || []);
        } catch (error) {
            console.error('Fetch error:', error.message);
            Alert.alert('Connection Error', 'Check your internet and try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {fetchUpdates();}, []);
    const onRefresh = () => {setRefreshing(true); fetchUpdates();};

    const latestUpdate = updates.find(u => u.status?.toLowerCase() === 'live');

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <AppHeader title="What's New" onBack={() => navigation.goBack()}/>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>
                }
            >
                {/* Latest banner */}
                {latestUpdate && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.banner}
                        onPress={() => setSelectedUpdate(latestUpdate)}
                    >
                        <View style={styles.bannerLeft}>
                            <Text style={styles.bannerLabel}>Latest Release</Text>
                            <Text style={styles.bannerTitle}>Version {latestUpdate.version} is live</Text>
                        </View>
                        <View style={styles.bannerIcon}>
                            <Ionicons name="rocket-outline" size={18} color={COLORS.white}/>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Roadmap</Text>
                    <Text style={styles.heroSubtitle}>Latest features and what's brewing at Spica Labs.</Text>
                </View>

                {/* Cards — newest first */}
                {updates.length > 0 ? (
                    updates.map(item => (
                        <UpdateCard key={item.id} item={item} onPress={setSelectedUpdate}/>
                    ))
                ) : (
                    <View style={styles.empty}>
                        <View style={styles.emptyIconWrapper}>
                            <Ionicons name="construct-outline" size={28} color={COLORS.gray400}/>
                        </View>
                        <Text style={styles.emptyText}>No updates posted yet.</Text>
                    </View>
                )}

                <Text style={styles.footer}>More exciting things are on the way 🚀</Text>
            </ScrollView>

            {/* Detail sheet */}
            <Modal
                visible={!!selectedUpdate}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedUpdate(null)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={() => setSelectedUpdate(null)}
                >
                    <View style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 24)}]}>
                        {/* Handle */}
                        <View style={styles.handle}/>

                        {/* Header */}
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetVersion}>v{selectedUpdate?.version}</Text>
                            <TouchableOpacity
                                onPress={() => setSelectedUpdate(null)}
                                style={styles.closeBtn}
                                activeOpacity={0.6}
                            >
                                <Ionicons name="close" size={16} color={COLORS.gray400}/>
                            </TouchableOpacity>
                        </View>

                        {/* Scrollable content */}
                        <ScrollView
                            style={styles.detailScroll}
                            showsVerticalScrollIndicator={false}
                            // Stops touch from dismissing when scrolling inside
                            onStartShouldSetResponder={() => true}
                        >
                            <StatusBadge status={selectedUpdate?.status}/>
                            <Text style={styles.detailTitle}>{selectedUpdate?.title}</Text>
                            <Text style={styles.detailDate}>{selectedUpdate?.date}</Text>
                            <Text style={styles.detailDesc}>{selectedUpdate?.description}</Text>
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light.bg,
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },

    // Banner
    banner: {
        backgroundColor: '#111827',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        ...Platform.select({
            ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 10},
            android: {elevation: 4},
        }),
    },
    bannerLeft: {gap: 3},
    bannerLabel: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
    },
    bannerTitle: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
    bannerIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Hero
    hero: {marginBottom: 16},
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
    },

    // Cards
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.gray100,
    },
    cardUpcoming: {
        borderStyle: 'dashed',
        backgroundColor: COLORS.gray50,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    dateText: {fontSize: 11, color: COLORS.gray400},
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.text,
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    cardDesc: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.gray100,
    },
    viewDetails: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },

    // Empty
    empty: {alignItems: 'center', paddingTop: 60, gap: 10},
    emptyIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {fontSize: 13, color: COLORS.gray400},
    footer: {textAlign: 'center', color: COLORS.gray400, marginTop: 24, fontSize: 13},

    // Detail sheet
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: COLORS.gray200,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    sheetVersion: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.3,
    },
    closeBtn: {
        width: 30,
        height: 30,
        borderRadius: 9,
        backgroundColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    detailScroll: {
        paddingHorizontal: 16,
        paddingTop: 16,
        maxHeight: SCREEN_HEIGHT * 0.5,
    },
    detailTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.3,
        marginTop: 10,
        marginBottom: 4,
    },
    detailDate: {
        fontSize: 11,
        color: COLORS.gray400,
        marginBottom: 14,
    },
    detailDesc: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 20,
        paddingBottom: 24,
    },
});

export default UpdatesScreen;