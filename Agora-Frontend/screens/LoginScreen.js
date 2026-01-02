import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { apiPost } from '../services/api';
import { saveExpoPushToken } from '../services/notificationTokenService';
import { useUserStore } from '../stores/userStore';
import { jwtDecode } from 'jwt-decode';

import InputField from '../components/InputField';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';

import { COLORS } from '../utils/colors';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const [errors, setErrors] = useState({});
    const { fetchUser } = useUserStore();

    const showToast = ({ type, title, message }) => {
        setToast({ visible: true, type, title, message });
    };

    const validateFields = () => {
        const validationErrors = {};
        if (!email.trim()) validationErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Email format is invalid';

        if (!password) validationErrors.password = 'Password is required';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const storeTokens = async (jwt, refreshToken) => {
        await SecureStore.setItemAsync('accessToken', jwt);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
    };

    const registerPushTokenForUser = async (userId) => {
        console.log('📱 registerPushTokenForUser called with userId:', userId);

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('❌ Notification permission denied');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('🔔 Expo push token:', token);
        console.log('👤 Saving for userId:', userId);

        await saveExpoPushToken(userId, token);

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

    const onLogin = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const data = await apiPost('/auth/login', { email, password });
            console.log("LOGIN RESPONSE:", data);
            console.log("USER ID:", data.id);

            const decoded = jwtDecode(data.jwt);
            console.log('🔍 JWT payload:', decoded);

            await storeTokens(data.jwt, data.refreshToken);

            if (data.id) {
                console.log('🔔 Registering push token for user:', data.id);
                await registerPushTokenForUser(data.id);
            } else {
                console.error('❌ No user ID found in response');
            }

            await fetchUser();
            const { currentUser } = useUserStore.getState();
            console.log('❤️ Current User:', currentUser);

            navigation.replace('MainLayout');

        } catch (error) {
            showToast({
                type: 'error',
                title: 'Login Failed',
                message: error.response?.data?.message || error.message || 'Something went wrong.',
            });
        } finally {
            setLoading(false);
        }
    };

    // const onGoogleLogin = () => {
    //     showToast({
    //         type: 'info',
    //         title: 'Continue with Google',
    //         message: 'Google login feature is not implemented yet.',
    //     });
    // };
    //
    // const onAppleLogin = () => {
    //     showToast({
    //         type: 'info',
    //         title: 'Sign in with Apple',
    //         message: 'Apple login feature is not implemented yet.',
    //     });
    // };


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.mainHeader}>Log In</Text>
                        <Text style={styles.subHeader}>
                            Welcome back! Please log in to your account
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <View style={styles.inputSection}>
                        <InputField
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            error={errors.email}
                            leftIcon="email-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <InputField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={errors.password}
                            leftIcon="lock-outline"
                        />

                        <TouchableOpacity
                            style={styles.forgotTextContainer}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <Button
                        title="Login"
                        onPress={onLogin}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        size="large"
                        style={{ marginBottom: 12 }}
                    />

                    {/* Guest Button */}
                    <Button
                        title="Continue as Guest"
                        onPress={() => navigation.replace('MainLayout', { guest: true })}
                        variant="outline"
                        fullWidth
                        size="large"
                    />

                    {/* Separator */}
                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>Or</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* Social Login Buttons */}
                    {/*<View style={styles.socialButtonsContainer}>*/}
                    {/*    <Button*/}
                    {/*        title="Sign in with Google"*/}
                    {/*        onPress={onGoogleLogin}*/}
                    {/*        variant="outline"*/}
                    {/*        fullWidth*/}
                    {/*        icon="logo-google"*/}
                    {/*        size="large"*/}
                    {/*    />*/}

                    {/*    <Button*/}
                    {/*        title="Sign in with Apple"*/}
                    {/*        onPress={onAppleLogin}*/}
                    {/*        variant="outline"*/}
                    {/*        fullWidth*/}
                    {/*        icon="logo-apple"*/}
                    {/*        size="large"*/}
                    {/*    />*/}
                    {/*</View>*/}

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({ ...toast, visible: false })}
                    />
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    mainHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.dark.text,
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
    },
    inputSection: {
        marginBottom: 24,
    },
    forgotTextContainer: {
        alignSelf: 'flex-start',
        marginTop: -8,
        marginBottom: 8,
    },
    forgotText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.dark.border,
    },
    separatorText: {
        color: COLORS.dark.textTertiary,
        fontSize: 14,
        marginHorizontal: 12,
    },
    socialButtonsContainer: {
        gap: 12,
        marginBottom: 12,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: COLORS.dark.textSecondary,
        fontSize: 15,
    },
    signupLink: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
});