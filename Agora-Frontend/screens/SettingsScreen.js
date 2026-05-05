import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
    ActivityIndicator,
    Animated,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';

import { apiDelete, apiPost, api } from '../services/api';
import { useProfileImage } from '../hooks/useProfileImage';
import { useUserStore } from '../stores/userStore';
import Constants from 'expo-constants';


import { COLORS } from '../utils/colors';

import ModalComponent from '../components/Modal';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import QuickActions from '../components/QuickActions';
import SettingsOptionList from '../components/SettingsOptionList';
import ProfileSection from '../components/ProfileSection';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation, scrollY }) => {
    const { currentUser: user, loading, isGuest, fetchUser, clearAuthData } = useUserStore();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [collegeModalVisible, setCollegeModalVisible] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { profileImage } = useProfileImage();
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });

    const showToast = ({ type, title, message }) =>
        setToast({ visible: true, type, title, message });

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        setLogoutModalVisible(false);
        try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            if (refreshToken) await apiPost('/auth/logout', { refreshToken });
        } catch (err) {
            console.error('Logout API failed:', err);
        } finally {
            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('currentUser');
            useUserStore.getState().clearAuthData();
            api.defaults.headers.common['Authorization'] = '';
            navigation.replace('Login');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await apiDelete('/profile/me');
            showToast({ type: 'success', title: 'Account Deleted', message: 'Your data has been successfully removed.' });
            setTimeout(async () => {
                await clearAuthData();
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }, 2000);
        } catch {
            setIsDeleting(false);
            showToast({ type: 'error', title: 'Error', message: 'Failed to delete account. Try again later.' });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />

            <Animated.ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Header */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Settings</Text>
                    <Text style={styles.heroSubtitle}>Manage your account and preferences</Text>
                </View>

                <ProfileSection
                    user={isGuest ? { firstName: 'Guest', lastName: 'User', email: 'guest@agora' } : user}
                    profileImage={isGuest ? 'https://i.pravatar.cc/100?img=1' : profileImage || user?.avatar}
                    verified={!isGuest}
                    loading={loading && !user}
                    buttonLabel={isGuest ? 'Login to Continue' : 'View Profile'}
                    onButtonPress={() => isGuest ? navigation.replace('Login') : navigation.navigate('UserProfileScreen')}
                    onPress={isGuest
                        ? () => showToast({ type: 'info', title: 'Profile Locked', message: 'Login to unlock your profile features' })
                        : () => navigation.navigate('UserProfileScreen')
                    }
                />

                <QuickActions
                    title="Quick Actions"
                    actions={[
                        {
                            icon: 'heart',
                            label: 'Favorites',
                            iconColor: '#EC4899',
                            onPress: () => isGuest
                                ? showToast({ type: 'info', title: 'Sign in required', message: 'Please log in to view your favorites.' })
                                : navigation.navigate('FavoritesScreen'),
                        },
                        {
                            icon: 'shield-checkmark',
                            label: 'Safety Center',
                            iconColor: '#6366F1',
                            onPress: () => navigation.navigate('SafetyCenterScreen'),
                        },
                    ]}
                />

                <SettingsOptionList
                    title="Preferences"
                    options={[
                        {
                            icon: 'language',
                            label: 'Language',
                            iconColor: '#6366F1',
                            value: 'English',
                            onPress: () =>
                                showToast({
                                    type: 'info',
                                    title: 'Coming Soon',
                                    message: 'Multi-language support is coming soon.',
                                }),
                        },
                        {
                            icon: 'school',
                            label: 'My Campus',
                            iconColor: '#10B981',
                            value: loading ? 'Loading...' : (isGuest ? 'Guest Access' : (user?.collegeName || 'Not Set')),
                            onPress: () => isGuest
                                ? showToast({ type: 'info', title: 'Login Required', message: 'Sign in to join your college community!' })
                                : setCollegeModalVisible(true),
                        },
                    ]}
                />

                <SettingsOptionList
                    title="Privacy & Security"
                    options={[
                        {
                            icon: 'ban',
                            label: 'Blocked Users',
                            iconColor: COLORS.error,
                            description: 'Manage users you have blocked',
                            onPress: () => navigation.navigate('BlockedUsersScreen'),
                        },
                        {
                            icon: 'flag',
                            label: 'Report History',
                            iconColor: '#F59E0B',
                            description: 'Track the status of your reports',
                            onPress: () => navigation.navigate('ReportHistoryScreen'),
                        },
                    ]}
                />

                <SettingsOptionList
                    title="Support & About"
                    options={[
                        { icon: 'megaphone-outline', iconColor: '#10B981', label: "What's New", onPress: () => navigation.navigate('WhatsNewScreen') },
                        { icon: 'help-circle-outline', iconColor: '#F59E0B', label: 'FAQ', onPress: () => navigation.navigate('FAQScreen') },
                        { icon: 'headset', iconColor: '#3B82F6', label: 'Support', onPress: () => navigation.navigate('SupportScreen') },
                        { icon: 'shield-checkmark', iconColor: '#8B5CF6', label: 'Privacy Policy', onPress: () => navigation.navigate('PrivacyPolicyScreen') },
                        { icon: 'information-circle', iconColor: COLORS.gray400, label: 'About', onPress: () => navigation.navigate('AboutScreen') },
                    ]}
                />

                <SettingsOptionList
                    title="Account"
                    options={[
                        {
                            icon: 'trash-outline',
                            label: 'Delete Account',
                            iconColor: COLORS.error,
                            description: 'Permanently remove your data',
                            destructive: true,
                            onPress: () => { if (!isGuest) setDeleteModalVisible(true); },
                        },
                    ]}
                />

                <Text style={styles.version}>Agora v{Constants.expoConfig.version}</Text>

                {!isGuest && (
                    <Button
                        title="Logout"
                        variant="danger"
                        size="large"
                        icon="log-out-outline"
                        iconPosition="left"
                        fullWidth
                        onPress={() => setLogoutModalVisible(true)}
                    />
                )}
            </Animated.ScrollView>

            {/* Campus Modal */}
            <Modal visible={collegeModalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.campusCard}>
                        <View style={styles.campusIconWrapper}>
                            <Ionicons name="school" size={24} color={COLORS.white} />
                        </View>
                        <Text style={styles.campusTitle}>Welcome to the Club</Text>
                        <Text style={styles.campusName}>{user?.collegeName || 'Our Favorite Campus'}</Text>
                        <Text style={styles.campusMessage}>
                            Hey {user?.firstName || 'Legend'}! You're officially part of the Agora community. Verified students, safe campus trading, built for you.
                        </Text>
                        <TouchableOpacity
                            style={styles.campusBtn}
                            activeOpacity={0.7}
                            onPress={() => setCollegeModalVisible(false)}
                        >
                            <Text style={styles.campusBtnText}>Awesome!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ModalComponent
                visible={logoutModalVisible}
                type="logout"
                title="Logout?"
                message="Are you sure you want to logout from your account?"
                primaryButtonText="Logout"
                secondaryButtonText="Cancel"
                onPrimaryPress={handleLogout}
                onSecondaryPress={() => setLogoutModalVisible(false)}
            />

            <ModalComponent
                visible={deleteModalVisible}
                type="delete"
                title="Delete Account?"
                message="This action is permanent. All your listings and data will be removed forever."
                primaryButtonText="Delete Permanently"
                secondaryButtonText="Cancel"
                onPrimaryPress={() => { setDeleteModalVisible(false); handleDeleteAccount(); }}
                onSecondaryPress={() => setDeleteModalVisible(false)}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}

            {isDeleting && (
                <View style={styles.deletingOverlay}>
                    <View style={styles.deletingCard}>
                        <ActivityIndicator size="large" color={COLORS.error} />
                        <Text style={styles.deletingText}>Deleting your account...</Text>
                    </View>
                </View>
            )}
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
        paddingBottom: 48,
    },

    // Hero
    hero: {
        marginTop: 20,
        marginBottom: 20,
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
    },

    // Version
    version: {
        fontSize: 12,
        color: COLORS.gray300,
        textAlign: 'center',
        marginVertical: 16,
    },

    // Deleting overlay
    deletingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    deletingCard: {
        backgroundColor: COLORS.white,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
            },
            android: { elevation: 4 },
        }),
    },
    deletingText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
    },

    // Campus modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    campusCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.1,
                shadowRadius: 24,
            },
            android: { elevation: 8 },
        }),
    },
    campusIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    campusTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.gray400,
        marginBottom: 4,
    },
    campusName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.light.text,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.4,
    },
    campusMessage: {
        fontSize: 13,
        lineHeight: 19,
        color: COLORS.gray400,
        textAlign: 'center',
        marginBottom: 20,
    },
    campusBtn: {
        backgroundColor: '#10B981',
        paddingVertical: 13,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    campusBtnText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 15,
    },
});

export default SettingsScreen;