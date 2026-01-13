import React, {useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import {Animated, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

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

const SettingsScreen = ({navigation, scrollY}) => {
    const {currentUser: user, loading, isGuest, fetchUser} = useUserStore();

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const {profileImage} = useProfileImage();
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const [userLocation, setUserLocation] = useState('Fetching...');

    useEffect(() => {
        fetchUser();
    }, []);

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

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

    useEffect(() => {
        (async () => {
            try {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setUserLocation('Permission denied');
                    return;
                }

                const loc = await Location.getCurrentPositionAsync({});
                const geo = await Location.reverseGeocodeAsync({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                });

                if (geo.length > 0) {
                    const {city, region, country} = geo[0];
                    setUserLocation(city || region || country || 'Unknown');
                } else {
                    setUserLocation('Unavailable');
                }
            } catch (err) {
                console.log('Location fetch error:', err);
                setUserLocation('Error');
            }
        })();
    }, []);


    const handleDeleteAccount = async () => {
        try {
            await apiDelete('/profile/me');

            showToast({
                type: 'success',
                title: 'Account Deleted',
                message: 'Your data has been successfully removed.'
            });

            setTimeout(async () => {
                await clearAuthData();
                navigation.reset({index: 0, routes: [{name: 'Auth'}]});
            }, 2000);
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Error',
                message: 'Failed to delete account. Try again later.'
            });
        } finally {
            setLoading(false);
        }
    };

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
                            // Button: Toast + Login
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
                        // Card tap: Toast only
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
                            icon: 'location',
                            iconType: 'ion',
                            label: 'Location',
                            description: 'Your current city',
                            gradient: ['#10B981', '#059669'],
                            value: userLocation,
                            onPress: () => {
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

                {/*<SettingsOptionList*/}
                {/*    title="Account Actions"*/}
                {/*    options={[*/}
                {/*        {*/}
                {/*            icon: 'trash-outline',*/}
                {/*            iconType: 'ion',*/}
                {/*            label: 'Delete Account',*/}
                {/*            description: 'Permanently remove your data',*/}
                {/*            gradient: ['#FF416C', '#FF4B2B'],*/}
                {/*            onPress: () => {*/}
                {/*                if (isGuest) {*/}
                {/*                    showToast({*/}
                {/*                        type: 'info',*/}
                {/*                        title: 'Guest Mode',*/}
                {/*                        message: 'No account found to delete.',*/}
                {/*                    });*/}
                {/*                    return;*/}
                {/*                }*/}
                {/*                Alert.alert(*/}
                {/*                    "Delete Account",*/}
                {/*                    "Are you sure? This action is permanent and all your listings will be removed.",*/}
                {/*                    [*/}
                {/*                        {text: "Cancel", style: "cancel"},*/}
                {/*                        {*/}
                {/*                            text: "Delete",*/}
                {/*                            style: "destructive",*/}
                {/*                            onPress: () => handleDeleteAccount()*/}
                {/*                        }*/}
                {/*                    ]*/}
                {/*                );*/}
                {/*            },*/}
                {/*        },*/}
                {/*    ]}*/}
                {/*/>*/}

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
});

export default SettingsScreen;