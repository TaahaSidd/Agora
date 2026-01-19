import React, {useEffect, useState} from 'react';
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
    View
} from 'react-native';

import {apiDelete, apiPost} from '../services/api';
import {useProfileImage} from '../hooks/useProfileImage';
import {useUserStore} from "../stores/userStore";

import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

import {SettingsScreenSkeleton} from '../components/skeletons/SkeletonItem';
import ModalComponent from '../components/Modal';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import QuickActions from '../components/QuickActions';
import SettingsOptionList from '../components/SettingsOptionList';
import ProfileSection from '../components/ProfileSection';
import Icon from "react-native-vector-icons/Ionicons";

const SettingsScreen = ({navigation, scrollY}) => {
    const {currentUser: user, loading, isGuest, fetchUser, clearAuthData} = useUserStore();
    //console.log("CUrrent user - > ", user);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const {profileImage} = useProfileImage();
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const [collegeModalVisible, setCollegeModalVisible] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    const showSkeleton = loading || !user;

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        setLogoutModalVisible(false);
        try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');

            if (refreshToken) {
                await apiPost('/auth/logout', {refreshToken});
            }

            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('currentUser');
            navigation.replace('Login');
        } catch (err) {
            console.error('Logout failed:', err);
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('currentUser');
            navigation.replace('Login');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);

            await apiDelete('/profile/me');

            showToast({
                type: 'success',
                title: 'Account Deleted',
                message: 'Your data has been successfully removed.'
            });

            setTimeout(async () => {
                await clearAuthData();
                navigation.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                });

            }, 2000);

        } catch (error) {
            setIsDeleting(false);
            showToast({
                type: 'error',
                title: 'Error',
                message: 'Failed to delete account. Try again later.'
            });
        }
    };

    const CampusInfoModal = () => (
        <Modal
            animationType="fade"
            transparent={true}
            visible={collegeModalVisible}
            onRequestClose={() => setCollegeModalVisible(false)}
        >
            <View style={styles.modalOverlay}>
                <Animated.View style={styles.campusCard}>
                    {/* Top Decoration */}
                    <View style={styles.iconCircle}>
                        <Icon name="school" size={40} color="#fff"/>
                    </View>

                    <Text style={styles.campusTitle}>Welcome to the Club</Text>

                    <Text style={styles.campusName}>
                        {user?.collegeName || "Our Favorite Campus"}
                    </Text>

                    <Text style={styles.campusMessage}>
                        Hey {user?.firstName || 'Legend'}! You’re officially part of the Agora community.
                        Whether you're buying textbooks or selling gear, you're connecting with
                        verified students from your campus and colleges everywhere.
                        Safe, student-driven, and built for you!
                    </Text>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setCollegeModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Awesome!</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );

    if (loading || !user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>
                <SettingsScreenSkeleton/>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>

            {showSkeleton ? (
                <SettingsScreenSkeleton/>
            ) : (
                <Animated.ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                        {useNativeDriver: true})}
                    scrollEventThrottle={16}
                >
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.header}>Settings</Text>
                        <Text style={styles.subHeader}>Manage your account and preferences</Text>
                    </View>

                    {/* Profile Card */}
                    <ProfileSection
                        user={
                            isGuest
                                ? {name: 'Guest User', email: 'guest@studex.app'}
                                : user
                        }
                        profileImage={
                            isGuest
                                ? 'https://i.pravatar.cc/100?img=1'
                                : profileImage || user?.avatar
                        }
                        verified={!isGuest}
                        buttonLabel={isGuest ? 'Login to Continue' : 'View Profile'}
                        onButtonPress={() => {
                            if (isGuest) {
                                showToast({
                                    type: 'info',
                                    title: 'Login Required',
                                    message: 'Sign in to view your full profile'
                                });
                                navigation.replace('Login');
                            } else {
                                navigation.navigate('UserProfileScreen');
                            }
                        }}
                        onPress={isGuest ? () => {
                            showToast({
                                type: 'info',
                                title: 'Profile Locked',
                                message: 'Login to unlock your profile features'
                            });
                        } : () => navigation.navigate('UserProfileScreen')}
                    />


                    {/* Quick Actions */}
                    <QuickActions
                        title="Quick Actions"
                        actions={[
                            {
                                icon: 'heart',
                                label: 'Favorites',
                                gradient: ['#EC4899', '#DB2777'],
                                onPress: () => {
                                    if (isGuest) {
                                        showToast({
                                            type: 'info',
                                            title: 'Sign in required',
                                            message: 'Please log in to view your favorites.',
                                        });
                                        return;
                                    }
                                    navigation.navigate('FavoritesScreen');
                                },
                            },
                            {
                                icon: 'shield-checkmark',
                                label: 'Safety Center',
                                gradient: ['#6366F1', '#4F46E5'],
                                onPress: () => {
                                    navigation.navigate('SafetyCenterScreen');
                                },
                            },
                        ]}
                    />

                    <SettingsOptionList
                        title="Preferences"
                        options={[
                            {
                                icon: 'language',
                                iconType: 'ion',
                                label: 'Language',
                                gradient: ['#6366F1', '#4F46E5'],
                                value: 'English',
                                onPress: () => {
                                },
                            },
                            {
                                icon: 'school',
                                iconType: 'ion',
                                label: 'My Campus',
                                description: '',
                                gradient: ['#10B981', '#059669'],
                                value: isGuest ? 'Guest Access' : (user?.collegeName || 'Not Set'),
                                onPress: () => {
                                    if (isGuest) {
                                        showToast({
                                            type: 'info',
                                            title: 'Login Required',
                                            message: 'Sign in to join your college community!'
                                        });
                                    } else {
                                        setCollegeModalVisible(true);
                                    }
                                },
                            },
                        ]}
                    />

                    <SettingsOptionList
                        title="Privacy & Security"
                        options={[
                            {
                                icon: 'ban',
                                iconType: 'ion',
                                label: 'Blocked Users',
                                description: 'Manage users you have blocked',
                                gradient: ['#EF4444', '#B91C1C'],
                                onPress: () => navigation.navigate('BlockedUsersScreen'),
                            },
                            {
                                icon: 'flag',
                                iconType: 'ion',
                                label: 'Report History',
                                description: 'Track the status of your reports',
                                gradient: ['#F59E0B', '#D97706'],
                                onPress: () => navigation.navigate('ReportHistoryScreen'),
                            },
                        ]}
                    />

                    <SettingsOptionList
                        title="Support & About"
                        options={[
                            {
                                icon: 'help-outline',
                                iconType: 'material',
                                label: 'FAQ',
                                gradient: ['#F59E0B', '#D97706'],
                                onPress: () => navigation.navigate('FAQScreen'),
                            },
                            {
                                icon: 'headset',
                                iconType: 'ion',
                                label: 'Support',
                                gradient: ['#3B82F6', '#2563EB'],
                                onPress: () => navigation.navigate('SupportScreen'),
                            },
                            {
                                icon: 'shield-checkmark',
                                iconType: 'ion',
                                label: 'Privacy Policy',
                                gradient: ['#8B5CF6', '#7C3AED'],
                                onPress: () => navigation.navigate('PrivacyPolicyScreen'),
                            },
                            {
                                icon: 'information-circle',
                                iconType: 'ion',
                                label: 'About',
                                gradient: ['#6B7280', '#4B5563'],
                                onPress: () => navigation.navigate('AboutScreen'),
                            },
                        ]}
                    />

                    <SettingsOptionList
                        title="Account Actions"
                        options={[
                            {
                                icon: 'trash-outline',
                                iconType: 'ion',
                                label: 'Delete Account',
                                description: 'Permanently remove your data',
                                gradient: ['#FF416C', '#FF4B2B'],
                                onPress: () => {
                                    if (isGuest) {
                                        showToast({
                                            type: 'info',
                                            title: 'Guest Mode',
                                            message: 'No account found to delete.',
                                        });
                                        return;
                                    }
                                    setDeleteModalVisible(true);
                                },
                            },
                        ]}
                    />

                    {/* App Version */}
                    <View style={styles.versionContainer}>
                        <Text style={styles.versionText}>Agora v1.0.0</Text>
                    </View>

                    {/* Logout Button */}
                    {!isGuest && (
                        <Button
                            title="Logout"
                            variant="danger"
                            size="large"
                            icon="log-out-outline"
                            iconPosition='left'
                            fullWidth={true}
                            onPress={() => setLogoutModalVisible(true)}
                        />
                    )}
                </Animated.ScrollView>
            )}

            {/* Logout Modal */}
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

            <CampusInfoModal/>

            {/* Delete Account Modal */}
            <ModalComponent
                visible={deleteModalVisible}
                type="delete"
                title="Delete Account?"
                message="This action is permanent. All your listings and data will be removed forever."
                primaryButtonText="Delete Permanently"
                secondaryButtonText="Cancel"
                onPrimaryPress={() => {
                    setDeleteModalVisible(false);
                    handleDeleteAccount();
                }}
                onSecondaryPress={() => setDeleteModalVisible(false)}
            />

            {
                toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({...toast, visible: false})}
                    />
                )
            }
            {/* Deletion Loading Overlay */}
            {isDeleting && (
                <View style={styles.globalLoadingOverlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color="#FF416C"/>
                        <Text style={styles.loadingText}>Deleting your account...</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        padding: THEME.spacing.screenPadding,
        paddingBottom: THEME.spacing['3xl'],
    },
    headerSection: {
        marginBottom: THEME.spacing.sectionGap,
        marginTop: THEME.spacing.sectionGap,
    },
    header: {
        fontSize: THEME.fontSize['4xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        letterSpacing: THEME.letterSpacing.tight,
        marginBottom: THEME.spacing[1],
    },
    subHeader: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },
    versionContainer: {
        alignItems: 'center',
        marginVertical: THEME.spacing.lg,
    },
    versionText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
    },

    globalLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingCard: {
        backgroundColor: COLORS.dark.card,
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: COLORS.dark.text,
        fontSize: 14,
        fontWeight: '600',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    campusCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#10B981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: -60,
        borderWidth: 5,
        borderColor: COLORS.dark.bg,
    },
    campusTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.dark.textSecondary,
        marginBottom: 8,
        textAlign: 'center',
    },
    campusName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#10B981',
        textAlign: 'center',
        marginBottom: 16,
        width: '100%',
    },
    campusMessage: {
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.dark.textTertiary,
        textAlign: 'center',
        marginBottom: 24,
        width: '100%',
    },
    closeButton: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: THEME.borderRadius.full,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default SettingsScreen;