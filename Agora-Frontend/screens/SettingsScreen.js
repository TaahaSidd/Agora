import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as Location from 'expo-location';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';

import { apiPost } from '../services/api';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useProfileImage } from '../hooks/useProfileImage';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import { Animated } from 'react-native';

import { SettingsScreenSkeleton } from '../components/skeletons/SkeletonItem';
import ModalComponent from '../components/Modal';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import QuickActions from '../components/QuickActions';
import SettingsOptionList from '../components/SettingsOptionList';
import ProfileSection from '../components/ProfileSection';

const SettingsScreen = ({ navigation, scrollY }) => {
    const { user, loading, isGuest } = useCurrentUser();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const { profileImage } = useProfileImage();
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const [userLocation, setUserLocation] = useState('Fetching...');

    const showToast = ({ type, title, message }) => {
        setToast({ visible: true, type, title, message });
    };

    const handleLogout = async () => {
        setLogoutModalVisible(false);
        try {
            const refreshToken = await SecureStore.getItemAsync('refreshToken');

            if (refreshToken) {
                await apiPost('/auth/logout', { refreshToken });
            }

            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            navigation.replace('Login');
        } catch (err) {
            console.error('Logout failed:', err);
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            navigation.replace('Login');
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
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
                    const { city, region, country } = geo[0];
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

    if (loading || !user) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content" />
                <SettingsScreenSkeleton />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content" />
            <Animated.ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true })}
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
                            ? { name: 'Guest User', email: 'guest@studex.app' }
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
                            navigation.replace('Login');
                        } else {
                            navigation.navigate('UserProfileScreen');
                        }
                    }}
                    onPress={isGuest ? null : () => navigation.navigate('UserProfileScreen')}
                />

                {/* Quick Actions */}
                <QuickActions
                    title="Quick Actions"
                    actions={[
                        {
                            icon: 'list',
                            iconColor: COLORS.info,
                            bgColor: COLORS.infoBg,
                            label: 'My Listings',
                            onPress: () => {
                                if (isGuest) {
                                    showToast({
                                        type: 'info',
                                        title: 'Sign in required',
                                        message: 'Please log in to view your listings.',
                                    });
                                    return;
                                }
                                navigation.navigate('MyListingsScreen');
                            },
                        },
                        {
                            icon: 'heart',
                            iconColor: COLORS.error,
                            bgColor: COLORS.errorBg,
                            label: 'Favorites',
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
                            icon: 'person-add',
                            iconColor: COLORS.accent,
                            bgColor: COLORS.successBg,
                            label: 'Referral',
                            onPress: () => {
                                if (isGuest) {
                                    showToast({
                                        type: 'info',
                                        title: 'Sign in required',
                                        message: 'Please log in to access referral.',
                                    });
                                    return;
                                }
                                navigation.navigate('ReferralScreen');
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
                            bgColor: COLORS.secondaryLight + '20',
                            iconColor: COLORS.secondary,
                            value: 'English',
                            onPress: () => { },
                        },
                        {
                            icon: 'location',
                            iconType: 'ion',
                            label: 'Location',
                            bgColor: COLORS.successBg,
                            iconColor: COLORS.success,
                            value: userLocation,
                            onPress: () => { },
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
                            bgColor: COLORS.warningBg,
                            iconColor: COLORS.warningDark,
                            onPress: () => navigation.navigate('FAQScreen'),
                        },
                        {
                            icon: 'headset',
                            iconType: 'ion',
                            label: 'Support',
                            bgColor: COLORS.infoBg,
                            iconColor: COLORS.infoDark,
                            onPress: () => navigation.navigate('SupportScreen'),
                        },
                        {
                            icon: 'shield-checkmark',
                            iconType: 'ion',
                            label: 'Privacy Policy',
                            bgColor: COLORS.category.books + '20',
                            iconColor: COLORS.category.books,
                            onPress: () => navigation.navigate('PrivacyPolicyScreen'),
                        },
                        {
                            icon: 'information-circle',
                            iconType: 'ion',
                            label: 'About',
                            bgColor: COLORS.gray700,
                            iconColor: COLORS.gray300,
                            onPress: () => navigation.navigate('AboutScreen'),
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

            {
                toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({ ...toast, visible: false })}
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