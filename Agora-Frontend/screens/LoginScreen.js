import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import * as SecureStore from 'expo-secure-store';
import { useUserStore } from '../stores/userStore';

import {sendOtpForLogin, api} from '../services/api';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';
import InputField from '../components/InputField';

import {COLORS} from '../utils/colors';

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const [errors, setErrors] = useState({});
    const [expoPushToken, setExpoPushToken] = useState(null);

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    const requestNotificationPermission = async () => {
        try {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            if (existingStatus !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);
        } catch (error) {
            console.error('❌ Push token error:', error);
        }
    };

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await GoogleSignin.signOut();
            await GoogleSignin.hasPlayServices();
            const signInResult = await GoogleSignin.signIn();
            const idToken = signInResult.data.idToken;

            const response = await api.post('/auth/google-signin', {
                idToken: idToken,
                expoPushToken: expoPushToken
            });

            const data = response.data;

            if (data.jwt) {
                await SecureStore.setItemAsync('accessToken', data.jwt);
                await SecureStore.setItemAsync('refreshToken', data.refreshToken);

                const minimalUser = {
                    id: data.id,
                    email: data.userEmail,
                    userEmail: data.userEmail,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User',
                    verificationStatus: data.verificationStatus,
                    avatar: data.profileImage || 'https://i.pravatar.cc/100',
                    profileImage: data.profileImage || 'https://i.pravatar.cc/100',
                    collegeId: data.collegeId,
                    mobileNumber: data.mobileNumber,
                    role: data.role,
                };

                await SecureStore.setItemAsync('currentUser', JSON.stringify(minimalUser));
                useUserStore.setState({
                    currentUser: minimalUser,
                    loading: false,
                    isGuest: false
                });

                showToast({
                    type: 'success',
                    title: 'Welcome!',
                    message: 'Signed in successfully'
                });

                setTimeout(() => {
                    if (data.verificationStatus === 'PENDING') {
                        navigation.replace('CompleteProfileScreen');
                    } else {
                        navigation.replace('MainLayout', { guest: false });
                    }
                }, 1000);
            }
        } catch (error) {
            if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
                showToast({
                    type: 'error',
                    title: 'Login Failed',
                    message: error.response?.data?.message || 'Google login failed.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        const validationErrors = {};
        if (!email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = 'Invalid email address';
        }
        if (!password) {
            validationErrors.password = 'Password is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            // Assuming 'login' is imported or defined elsewhere in your logic
            // Using a placeholder login function based on your logic flow
            const response = await api.post('/auth/login', {
                email: email.trim(),
                password: password,
                expoPushToken: expoPushToken
            });
            const data = response.data;

            if (data.jwt) {
                await SecureStore.setItemAsync('accessToken', data.jwt);
                await SecureStore.setItemAsync('refreshToken', data.refreshToken);

                const minimalUser = {
                    id: data.id,
                    email: data.userEmail,
                    userEmail: data.userEmail,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'User',
                    verificationStatus: data.verificationStatus,
                    avatar: data.profileImage || 'https://i.pravatar.cc/100',
                    profileImage: data.profileImage || 'https://i.pravatar.cc/100',
                    collegeId: data.collegeId,
                    mobileNumber: data.mobileNumber,
                    role: data.role,
                };

                await SecureStore.setItemAsync('currentUser', JSON.stringify(minimalUser));
                useUserStore.setState({
                    currentUser: minimalUser,
                    loading: false,
                    isGuest: false
                });

                showToast({
                    type: 'success',
                    title: 'Welcome Back!',
                    message: 'Logged in successfully',
                });

                setTimeout(() => {
                    if (data.verificationStatus === 'PENDING') {
                        navigation.replace('CompleteProfileScreen');
                    } else {
                        navigation.replace('MainLayout', { guest: false });
                    }
                }, 1500);
            }
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Login Failed',
                message: error.response?.data?.message || 'Invalid email or password.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.light.bg}/>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                    <View style={styles.header}>
                        <Text style={styles.mainHeader}>Log In</Text>
                        <Text style={styles.subHeader}>Welcome back! Enter your email to continue</Text>
                    </View>

                    {/* Google Button - Light style with border */}
                    <Button
                        title="Continue with Google"
                        variant="secondary"
                        icon="logo-google"
                        onPress={handleGoogleLogin}
                        style={styles.googleButton}
                        textStyle={{color: '#000'}}
                        fullWidth
                        size="large"
                    />

                    {/* Separator Section */}
                    <View style={styles.separatorContainer}>
                        <View style={styles.line}/>
                        <Text style={styles.separatorText}>OR</Text>
                        <View style={styles.line}/>
                    </View>

                    {/* Email/OTP Section */}
                    <View style={styles.inputSection}>
                        <InputField
                            label="Email Address"
                            placeholder="e.g. rahul.sharma@gmail.com"
                            value={email}
                            onChangeText={(text) => { setEmail(text); setErrors({}); }}
                            leftIcon="email-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />

                        <InputField
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                            leftIcon="lock-outline"
                            secureTextEntry={true}
                            error={errors.password}
                        />
                    </View>

                    <Button
                        title={loading ? "Logging in..." : "Login"}
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        size="large"
                    />

                    <Button
                        title="Continue as Guest"
                        onPress={() => navigation.replace('MainLayout', {guest: true})}
                        variant="ghost"
                        fullWidth
                        size="large"
                    />

                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({...toast, visible: false})}
                    />
                )}
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.light.bg },
    keyboardView: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
    header: { marginBottom: 40, alignItems: 'center' },
    mainHeader: { fontSize: 32, fontWeight: 'bold', color: COLORS.light.text, marginBottom: 8 },
    subHeader: { fontSize: 15, color: COLORS.light.textSecondary, textAlign: 'center' },
    googleButton: {
        backgroundColor: '#FFFFFF',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.light.border
    },
    inputSection: { marginBottom: 20 },
    separatorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    line: { flex: 1, height: 1, backgroundColor: COLORS.light.border },
    separatorText: { color: COLORS.light.textTertiary, marginHorizontal: 16, fontSize: 12, fontWeight: 'bold' },
    signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    signupText: { color: COLORS.light.textSecondary, fontSize: 15 },
    signupLink: { color: COLORS.primary, fontSize: 15, fontWeight: 'bold' },
});