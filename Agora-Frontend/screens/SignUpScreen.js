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
import {GoogleSignin, statusCodes} from '@react-native-google-signin/google-signin';
import * as SecureStore from "expo-secure-store";

import {api, signup} from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import {COLORS} from "../utils/colors";
import {useUserStore} from "../stores/userStore";

export default function SignUpScreen({navigation}) {
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

    const handleGoogleSignUp = async () => {
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
                    message: data.verificationStatus === 'PENDING'
                        ? 'Please complete your profile'
                        : 'Signed in successfully'
                });

                setTimeout(() => {
                    if (data.verificationStatus === 'PENDING') {
                        navigation.replace('CompleteProfileScreen');
                    } else {
                        navigation.replace('MainLayout');
                    }
                }, 1000);
            }
        } catch (error) {
            if (error.code !== statusCodes.SIGN_IN_CANCELLED) {
                showToast({
                    type: 'error',
                    title: 'Login Failed',
                    message: error.response?.data?.message || 'Google Sign-In failed.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const validateFields = () => {
        const validationErrors = {};
        if (!email.trim()) validationErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Invalid email address';
        if (!password) validationErrors.password = 'Password is required';
        else if (password.length < 6) validationErrors.password = 'Min 6 characters required';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleEmailSignUp = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const data = await signup({
                email: email.trim(),
                password: password,
                expoPushToken: expoPushToken
            });

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
                    avatar: 'https://i.pravatar.cc/100',
                    profileImage: 'https://i.pravatar.cc/100',
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
                    title: 'Account Created',
                    message: 'Welcome! Please complete your profile details.',
                });

                setTimeout(() => {
                    navigation.replace('CompleteProfileScreen');
                }, 1500);
            }
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Sign Up Failed',
                message: error.response?.data?.message || 'Something went wrong.'
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
                        <Text style={styles.mainHeader}>Sign Up</Text>
                        <Text style={styles.subHeader}>Join your campus marketplace</Text>
                    </View>

                    {/* Google Button */}
                    <Button
                        title="Continue with Google"
                        variant="secondary"
                        icon="logo-google"
                        onPress={handleGoogleSignUp}
                        style={styles.googleButtonOverride}
                        textStyle={{color: '#000'}}
                        fullWidth
                        size="large"
                    />

                    <View style={styles.separatorContainer}>
                        <View style={styles.line}/>
                        <Text style={styles.separatorText}>OR</Text>
                        <View style={styles.line}/>
                    </View>

                    <View style={styles.inputSection}>
                        <InputField
                            label="Email Address"
                            placeholder="name@college.edu"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setErrors({...errors, email: null});
                            }}
                            leftIcon="email-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />
                        <InputField
                            label="Create Password"
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setErrors({...errors, password: null});
                            }}
                            leftIcon="lock-outline"
                            secureTextEntry
                            error={errors.password}
                        />
                    </View>

                    <Button
                        title={loading ? "Creating Account..." : "Create Account"}
                        onPress={handleEmailSignUp}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        size="large"
                    />

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Log In</Text>
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
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg
    },
    keyboardView: {
        flex: 1
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 80,
        paddingBottom: 40
    },
    header: {
        marginBottom: 40,
        alignItems: 'center'
    },
    mainHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.light.text,
        marginBottom: 8
    },
    subHeader: {
        fontSize: 15,
        color: COLORS.light.textSecondary
    },
    googleButtonOverride: {
        backgroundColor: '#FFFFFF',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.light.border
    },
    separatorText: {
        color: COLORS.light.textTertiary,
        marginHorizontal: 16,
        fontSize: 12,
        fontWeight: 'bold'
    },
    inputSection: {
        marginBottom: 32
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32
    },
    loginText: {
        color: COLORS.light.textSecondary,
        fontSize: 15
    },
    loginLink: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 15
    },
});