// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, FlatList, useColorScheme } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { apiDelete } from '../services/api';
// import * as SecureStore from 'expo-secure-store';

// import AppHeader from '../components/AppHeader';
// import MyListingRowCard from '../components/MyListingRowCard';
// import Button from '../components/Button';
// import ModalComponent from '../components/Modal';
// import ToastMessage from '../components/ToastMessage';
// import Tooltip from '../components/Tooltip'; //fix the tooltip popping up issue
// import LoadingSpinner from '../components/LoadingSpinner';
// import SearchInput from '../components/SearchInput';

// import { COLORS } from '../utils/colors';
// import { THEME } from '../utils/theme';
// import { getThemedColors } from '../utils/colors';

// import { useMyListings } from '../hooks/useMyListings';


// const MyListingsScreen = ({ navigation }) => {
//     const isDarkMode = useColorScheme() === 'dark';
//     const theme = getThemedColors(isDarkMode);
//     const { listings, loading, setListings, setLoading } = useMyListings();
//     const [tooltipVisible, setTooltipVisible] = useState(true);
//     const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);
//     const [editConfirmModalVisible, setEditConfirmModalVisible] = useState(false);
//     const [itemToEdit, setItemToEdit] = useState(null);
//     const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });
//     // const [searchQuery, setSearchQuery] = useState('');

//     useEffect(() => {
//         const checkTooltip = async () => {
//             const seen = await SecureStore.getItemAsync('listingTooltipSeen');
//             if (!seen) setTooltipVisible(true);
//         };
//         checkTooltip();
//     }, []);

//     const handleCloseTooltip = async () => {
//         setTooltipVisible(false);
//         await SecureStore.setItemAsync('listingTooltipSeen', 'true');
//     };

//     const handleEdit = (item) => {
//         setItemToEdit(item);
//         setEditConfirmModalVisible(true);
//     };

//     const handleDelete = (item) => {
//         setItemToDelete(item);
//         setDeleteModalVisible(true);
//     };

//     const confirmEditNavigation = () => {
//         if (!itemToEdit) return;

//         navigation.navigate('EditListingScreen', {
//             listing: {
//                 id: itemToEdit.id,
//                 title: itemToEdit.title,
//                 price: itemToEdit.price,
//                 status: itemToEdit.status,
//                 description: itemToEdit.description || '',
//                 imageUrl: itemToEdit.imageUrl || [],
//                 category: itemToEdit.category || '',
//                 itemCondition: itemToEdit.itemCondition || '',
//                 condition: itemToEdit.condition || '',
//             },
//         });

//         setEditConfirmModalVisible(false);
//         setItemToEdit(null);
//     };

//     const confirmDelete = async () => {
//         if (!itemToDelete) return;

//         try {
//             setLoading(true);
//             setDeleteModalVisible(false);

//             await apiDelete(`/listing/delete/${itemToDelete.id}`);
//             setListings(prev => prev.filter(l => l.id !== itemToDelete.id));

//             setToast({ visible: true, type: 'success', title: 'Deleted!', message: 'Listing deleted successfully' });
//         } catch (error) {
//             console.error('Delete error:', error.response?.data || error.message);
//             setToast({ visible: true, type: 'error', title: 'Failed!', message: 'Failed to delete listing. Please try again.' });
//         } finally {
//             setLoading(false);
//             setItemToDelete(null);
//         }
//     };

//     const renderEmptyState = () => (
//         <View style={styles.emptyContainer}>
//             <Ionicons name="list-outline" size={60} color="#D1D5DB" />
//             <Text style={styles.emptyTitle}>No Listings Yet</Text>
//             <Text style={styles.emptyText}>Start selling by adding your first item!</Text>
//             <Button
//                 title="Create Listing"
//                 onPress={() => navigation.navigate('AddListingScreen')}
//                 variant="primary"
//                 size="medium"
//                 icon="add-circle"
//                 iconPosition="left"
//                 fullWidth={false}
//                 loading={false}
//                 disabled={false}
//             />
//         </View>
//     );

//     const renderHeader = () => {
//         const statusCounts = listings.reduce((acc, item) => {
//             const status = item.itemStatus || 'UNKNOWN';
//             acc[status] = (acc[status] || 0) + 1;
//             return acc;
//         }, {});

//         return (
//             <View>
//                 {/* Stats Row */}
//                 <View style={styles.headerInfo}>
//                     <View style={styles.statsRow}>
//                         <View style={styles.statBox}>
//                             <Text style={styles.statNumber}>{listings.length}</Text>
//                             <Text style={styles.statLabel}>Total Listings</Text>
//                         </View>
//                         <View style={styles.statBox}>
//                             <Text style={styles.statNumber}>{statusCounts['AVAILABLE'] || 0}</Text>
//                             <Text style={styles.statLabel}>Available</Text>
//                         </View>
//                         <View style={styles.statBox}>
//                             <Text style={styles.statNumber}>{statusCounts['SOLD'] || 0}</Text>
//                             <Text style={styles.statLabel}>Sold</Text>
//                         </View>
//                     </View>
//                 </View>

//                 {/* Search Bar */}
//                 {/* <View style={styles.searchContainer}>
//                     <SearchInput
//                         value={searchQuery}
//                         onChangeText={setSearchQuery}
//                         placeholder="Search listings..."
//                         onClear={() => setSearchQuery('')}
//                     />
//                 </View> */}
//             </View>
//         );
//     };

//     if (loading) {
//         return (
//             <SafeAreaView style={styles.safeArea}>
//                 <AppHeader title="My Listings" onBack={() => navigation.goBack()} />
//                 <View style={styles.loadingContainer}>
//                     <LoadingSpinner size="large" variant="dots" color={COLORS.primary} />
//                     <Text style={styles.loadingText}>Loading your listings...</Text>
//                 </View>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <AppHeader title="My Listings" onBack={() => navigation.goBack()} />

//             {listings.length === 0 ? (
//                 renderEmptyState()
//             ) : (
//                 <FlatList
//                     data={listings}
//                     keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
//                     ListHeaderComponent={renderHeader}
//                     contentContainerStyle={styles.listContainer}
//                     renderItem={({ item, index }) => (
//                         <View style={{ position: 'relative' }}>
//                             <MyListingRowCard
//                                 item={item}
//                                 onEdit={() => handleEdit(item)}
//                                 onDelete={() => handleDelete(item)}
//                             />

//                             {tooltipVisible && index === 0 && (
//                                 <Tooltip
//                                     message="Swipe the card left to edit or delete this listing"
//                                     position="top"
//                                     visible={tooltipVisible}
//                                     onClose={handleCloseTooltip}
//                                     icon="hand-left-outline"
//                                 />
//                             )}
//                         </View>
//                     )}
//                     showsVerticalScrollIndicator={false}
//                 />
//             )}

//             <ModalComponent
//                 visible={editConfirmModalVisible}
//                 type="confirm"
//                 title="Edit Listing?"
//                 message={`Are you sure you want to edit "${itemToEdit?.title}"?`}
//                 primaryButtonText="Yes, Edit"
//                 secondaryButtonText="Cancel"
//                 onPrimaryPress={confirmEditNavigation}
//                 onSecondaryPress={() => { setEditConfirmModalVisible(false); setItemToEdit(null); }}
//             />

//             <ModalComponent
//                 visible={deleteModalVisible}
//                 type="delete"
//                 title="Delete Listing?"
//                 message={`Are you sure you want to delete "${itemToDelete?.title}"?`}
//                 primaryButtonText="Yes, Delete"
//                 secondaryButtonText="Cancel"
//                 onPrimaryPress={confirmDelete}
//                 onSecondaryPress={() => { setDeleteModalVisible(false); setItemToDelete(null); }}
//             />

//             {/* Toast */}
//             {toast.visible && (
//                 <ToastMessage
//                     type={toast.type}
//                     title={toast.title}
//                     message={toast.message}
//                     onHide={() => setToast(prev => ({ ...prev, visible: false }))}
//                     duration={3000}
//                     position="top"
//                 />
//             )}

//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F9FAFB',
//     },
//     loadingText: {
//         marginTop: 12,
//         fontSize: 15,
//         color: '#6B7280',
//         fontWeight: '500',
//     },
//     headerInfo: {
//         marginBottom: 20,
//     },
//     searchContainer: {
//         paddingHorizontal: 20,
//         marginBottom: 10,
//     },
//     statsRow: {
//         flexDirection: 'row',
//         backgroundColor: '#fff',
//         borderRadius: 20,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//         elevation: 2,
//     },
//     statBox: {
//         flex: 1,
//         alignItems: 'center',
//     },
//     statNumber: {
//         fontSize: 28,
//         fontWeight: '800',
//         color: COLORS.primary,
//         marginBottom: 4,
//     },
//     statLabel: {
//         fontSize: 13,
//         color: '#6B7280',
//         fontWeight: '600',
//     },
//     listContainer: {
//         paddingHorizontal: 20,
//         paddingTop: 20,
//         paddingBottom: 40,
//     },
//     emptyContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 40,
//         paddingTop: 100,
//     },
//     emptyIconCircle: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         backgroundColor: '#F3F4F6',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 24,
//     },
//     emptyTitle: {
//         fontSize: 24,
//         fontWeight: '800',
//         color: '#111827',
//         marginBottom: 8,
//         letterSpacing: -0.3,
//     },
//     emptyText: {
//         fontSize: 15,
//         color: '#6B7280',
//         textAlign: 'center',
//         lineHeight: 22,
//         marginBottom: 32,
//     }
// });

// export default MyListingsScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiDelete } from '../services/api';
import * as SecureStore from 'expo-secure-store';

import AppHeader from '../components/AppHeader';
import MyListingRowCard from '../components/MyListingRowCard';
import Button from '../components/Button';
import ModalComponent from '../components/Modal';
import ToastMessage from '../components/ToastMessage';
import Tooltip from '../components/Tooltip';
import LoadingSpinner from '../components/LoadingSpinner';

import { COLORS } from '../utils/colors';
import { useMyListings } from '../hooks/useMyListings';

const MyListingsScreen = ({ navigation }) => {
    const theme = COLORS.dark; // Dark-only

    const { listings, loading, setListings, setLoading } = useMyListings();
    const [tooltipVisible, setTooltipVisible] = useState(true);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editConfirmModalVisible, setEditConfirmModalVisible] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });

    useEffect(() => {
        const checkTooltip = async () => {
            const seen = await SecureStore.getItemAsync('listingTooltipSeen');
            if (!seen) setTooltipVisible(true);
        };
        checkTooltip();
    }, []);

    const handleCloseTooltip = async () => {
        setTooltipVisible(false);
        await SecureStore.setItemAsync('listingTooltipSeen', 'true');
    };

    const handleEdit = (item) => {
        setItemToEdit(item);
        setEditConfirmModalVisible(true);
    };

    const handleDelete = (item) => {
        setItemToDelete(item);
        setDeleteModalVisible(true);
    };

    const confirmEditNavigation = () => {
        if (!itemToEdit) return;
        navigation.navigate('EditListingScreen', { listing: itemToEdit });
        setEditConfirmModalVisible(false);
        setItemToEdit(null);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            setLoading(true);
            setDeleteModalVisible(false);
            await apiDelete(`/listing/delete/${itemToDelete.id}`);
            setListings(prev => prev.filter(l => l.id !== itemToDelete.id));
            setToast({ visible: true, type: 'success', title: 'Deleted!', message: 'Listing deleted successfully' });
        } catch (error) {
            console.error('Delete error:', error.response?.data || error.message);
            setToast({ visible: true, type: 'error', title: 'Failed!', message: 'Failed to delete listing. Please try again.' });
        } finally {
            setLoading(false);
            setItemToDelete(null);
        }
    };

    const renderEmptyState = () => (
        <View style={dynamicStyles.emptyContainer}>
            <Ionicons name="list-outline" size={60} color={theme.textSecondary} />
            <Text style={[dynamicStyles.emptyTitle, { color: theme.text }]}>No Listings Yet</Text>
            <Text style={[dynamicStyles.emptyText, { color: theme.textSecondary }]}>Start selling by adding your first item!</Text>
            <Button
                title="Create Listing"
                onPress={() => navigation.navigate('AddListingScreen')}
                variant="primary"
                size="medium"
                icon="add-circle"
                iconPosition="left"
                fullWidth={false}
                loading={false}
                disabled={false}
            />
        </View>
    );

    const renderHeader = () => {
        const statusCounts = listings.reduce((acc, item) => {
            const status = item.itemStatus || 'UNKNOWN';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        return (
            <View style={dynamicStyles.headerInfo}>
                <View style={[dynamicStyles.statsRow, { backgroundColor: theme.card }]}>
                    {['Total Listings', 'Available', 'Sold'].map((label, idx) => {
                        const value = label === 'Total Listings' ? listings.length : statusCounts[label.toUpperCase()] || 0;
                        return (
                            <View style={dynamicStyles.statBox} key={idx}>
                                {/* <Text style={[dynamicStyles.statNumber, { color: theme.primary }]}>{value}</Text> */}
                                <Text style={[dynamicStyles.statNumber, { color: '#008CFE' }]}>{value}</Text>
                                <Text style={[dynamicStyles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView>
                <AppHeader title="My Listings" onBack={() => navigation.goBack()} />
                <View style={[dynamicStyles.loadingContainer, { backgroundColor: theme.bg }]}>
                    <LoadingSpinner size="large" variant="dots" color={theme.primary} />
                    <Text style={[dynamicStyles.loadingText, { color: theme.textSecondary }]}>Loading your listings...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[dynamicStyles.safeArea, { backgroundColor: theme.bg }]}>
            <AppHeader title="My Listings" onBack={() => navigation.goBack()} />

            {listings.length === 0 ? renderEmptyState() : (
                <FlatList
                    data={listings}
                    keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={dynamicStyles.listContainer}
                    renderItem={({ item, index }) => (
                        <View style={{ position: 'relative' }}>
                            <MyListingRowCard
                                item={item}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => handleDelete(item)}
                                theme={theme}
                            />

                            {tooltipVisible && index === 0 && (
                                <Tooltip
                                    message="Swipe the card left to edit or delete this listing"
                                    position="top"
                                    visible={tooltipVisible}
                                    onClose={handleCloseTooltip}
                                    icon="hand-left-outline"
                                />
                            )}
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <ModalComponent
                visible={editConfirmModalVisible}
                type="confirm"
                title="Edit Listing?"
                message={`Are you sure you want to edit "${itemToEdit?.title}"?`}
                primaryButtonText="Yes, Edit"
                secondaryButtonText="Cancel"
                onPrimaryPress={confirmEditNavigation}
                onSecondaryPress={() => { setEditConfirmModalVisible(false); setItemToEdit(null); }}
            />

            <ModalComponent
                visible={deleteModalVisible}
                type="delete"
                title="Delete Listing?"
                message={`Are you sure you want to delete "${itemToDelete?.title}"?`}
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                onPrimaryPress={confirmDelete}
                onSecondaryPress={() => { setDeleteModalVisible(false); setItemToDelete(null); }}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast(prev => ({ ...prev, visible: false }))}
                    duration={3000}
                    position="top"
                />
            )}
        </SafeAreaView>
    );
};

const dynamicStyles = StyleSheet.create({
    safeArea: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, fontSize: 15, fontWeight: '500' },
    headerInfo: { marginBottom: 20 },
    statsRow: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statBox: { flex: 1, alignItems: 'center' },
    statNumber: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
    statLabel: { fontSize: 13, fontWeight: '600' },
    listContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
    emptyContainer: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingTop: 100 },
    emptyTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8, letterSpacing: -0.3 },
    emptyText: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});

export default MyListingsScreen;