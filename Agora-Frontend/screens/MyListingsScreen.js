import React, {useState} from 'react';
import {Animated, Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {apiDelete} from '../services/api';

import AppHeader from '../components/AppHeader';
import Card from '../components/Cards';
import Button from '../components/Button';
import ModalComponent from '../components/Modal';
import ToastMessage from '../components/ToastMessage';
import LoadingSpinner from '../components/LoadingSpinner';

import {COLORS} from '../utils/colors';
import {useMyListings} from '../hooks/useMyListings';
import {useUserStore} from '../stores/userStore';

import NoListingSVG from '../assets/svg/NoListingSVG.svg';

const STAT_KEYS = [
    {label: 'Total',  key: null},
    {label: 'Active', key: 'AVAILABLE'},
    {label: 'Sold',   key: 'SOLD'},
];

const MyListingsScreen = ({navigation, scrollY}) => {
    const {currentUser, isGuest} = useUserStore();
    const {listings, loading, setListings} = useMyListings();

    const [deleteModal, setDeleteModal] = useState({visible: false, item: null});
    const [editModal,   setEditModal]   = useState({visible: false, item: null});
    const [toast,       setToast]       = useState({visible: false, type: 'success', title: '', message: ''});

    const confirmDelete = async () => {
        const item = deleteModal.item;
        if (!item) return;
        setDeleteModal({visible: false, item: null});
        try {
            await apiDelete(`/listing/delete/${item.id}`);
            setListings(prev => prev.filter(l => l.id !== item.id));
            setToast({visible: true, type: 'success', title: 'Deleted!', message: 'Listing removed successfully.'});
        } catch {
            setListings(prev => [...prev, item]);
            setToast({visible: true, type: 'error', title: 'Failed', message: 'Could not delete listing. Try again.'});
        }
    };

    // Locked out
    if (isGuest || !currentUser || currentUser?.verificationStatus === 'PENDING') {
        const isPending = currentUser?.verificationStatus === 'PENDING';
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title="My Listings"/>
                <View style={styles.centered}>
                    <View style={styles.emptyIconWrapper}>
                        <Ionicons
                            name={isPending ? 'shield-checkmark-outline' : 'list-outline'}
                            size={28}
                            color={COLORS.gray400}
                        />
                    </View>
                    <Text style={styles.emptyTitle}>
                        {isGuest ? 'Login Required' : 'Complete Your Profile'}
                    </Text>
                    <Text style={styles.emptyText}>
                        {isGuest
                            ? 'Please log in to view and manage your listings.'
                            : 'Complete your profile to start managing listings.'}
                    </Text>
                    <Button
                        title={isGuest ? 'Log In' : 'Complete Profile'}
                        variant="primary"
                        icon={isGuest ? 'log-in-outline' : 'person-outline'}
                        onPress={() => navigation[isGuest ? 'replace' : 'navigate'](
                            isGuest ? 'Login' : 'EditListingScreen'
                        )}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // Stats
    const statusCounts = listings.reduce((acc, item) => {
        const s = item.itemStatus || 'UNKNOWN';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const ListHeader = () => (
        <View style={styles.statsCard}>
            {STAT_KEYS.map(({label, key}, index) => {
                const value = key === null ? listings.length : (statusCounts[key] || 0);
                const isLast = index === STAT_KEYS.length - 1;
                return (
                    <React.Fragment key={label}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{value}</Text>
                            <Text style={styles.statLabel}>{label}</Text>
                        </View>
                        {!isLast && <View style={styles.statDivider}/>}
                    </React.Fragment>
                );
            })}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <AppHeader title="My Listings" onBack={() => navigation.goBack()}/>

            {loading ? (
                <View style={styles.centered}>
                    <LoadingSpinner size="large" variant="dots" color={COLORS.primary}/>
                </View>
            ) : listings.length === 0 ? (
                <View style={styles.centered}>
                    <View style={styles.emptyIconWrapper}>
                        <NoListingSVG width={100} height={80}/>
                    </View>
                    <Text style={styles.emptyTitle}>No Listings Yet</Text>
                    <Text style={styles.emptyText}>Start selling by adding your first item!</Text>
                    <Button
                        title="Create Listing"
                        onPress={() => navigation.navigate('AddListingScreen')}
                        variant="primary"
                        icon="add-circle-outline"
                        iconPosition="left"
                    />
                </View>
            ) : (
                <Animated.FlatList
                    data={listings}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                    ListHeaderComponent={<ListHeader/>}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => (
                        <Card
                            item={item}
                            onEdit={() => setEditModal({visible: true, item})}
                            onDelete={() => setDeleteModal({visible: true, item})}
                        />
                    )}
                    onScroll={scrollY ? Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                        {useNativeDriver: true}
                    ) : undefined}
                    scrollEventThrottle={16}
                />
            )}

            <ModalComponent
                visible={editModal.visible}
                type="confirm"
                title="Edit Listing?"
                message={`Edit "${editModal.item?.title}"?`}
                primaryButtonText="Yes, Edit"
                secondaryButtonText="Cancel"
                onPrimaryPress={() => {
                    navigation.navigate('EditListingScreen', {listing: editModal.item});
                    setEditModal({visible: false, item: null});
                }}
                onSecondaryPress={() => setEditModal({visible: false, item: null})}
            />

            <ModalComponent
                visible={deleteModal.visible}
                type="delete"
                title="Delete Listing?"
                message={`Delete "${deleteModal.item?.title}"? This cannot be undone.`}
                onPrimaryPress={confirmDelete}
                onSecondaryPress={() => setDeleteModal({visible: false, item: null})}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast(p => ({...p, visible: false}))}
                    duration={3000}
                    position="top"
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },

    // Stats card
    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...Platform.select({
            ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 8},
            android: {elevation: 1},
        }),
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: COLORS.gray400,
    },
    statDivider: {
        width: StyleSheet.hairlineWidth,
        height: 32,
        backgroundColor: COLORS.gray100,
    },

    // Empty & centered
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
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
        lineHeight: 19,
        marginBottom: 24,
    },
});

export default MyListingsScreen;