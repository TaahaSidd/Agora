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
import auth from '@react-native-firebase/auth';

import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';

import {COLORS} from '../utils/colors';
import PhoneInputField from "../components/PhoneInputField";

export default function LoginScreen({navigation}) {
    const [phoneNumber, setPhoneNumber] = useState('');
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
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('❌ Notification permission denied');
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);
            console.log('✅ Expo Push Token obtained:', token);

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        } catch (error) {
            console.error('❌ Error getting push token:', error);
        }
    };

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    const validateFields = () => {
        const validationErrors = {};

        if (!phoneNumber.trim()) {
            validationErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9][0-9]{9}$/.test(phoneNumber.replace(/[\s-]/g, ''))) {
            validationErrors.phoneNumber = 'Enter valid 10-digit Indian mobile number';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const fullPhoneNumber = '+91' + phoneNumber;
            console.log('📤 Sending OTP to:', fullPhoneNumber);

            const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

            console.log('✅ OTP sent successfully');

            showToast({
                type: 'success',
                title: 'OTP Sent',
                message: 'Verification code sent to your phone',
            });

            setTimeout(() => {
                navigation.navigate('OTPVerificationScreen', {
                    phoneNumber: fullPhoneNumber,
                    collegeId: null,
                    expoPushToken: expoPushToken,
                    confirmation: confirmation,
                });
            }, 1500);

        } catch (error) {
            console.error('❌ Send OTP error:', error);

            let errorMessage = 'Failed to send OTP. Please try again.';

            if (error.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number format';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later';
            }

            showToast({
                type: 'error',
                title: 'Failed',
                message: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg}/>

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
                        <PhoneInputField
                            label="Phone Number *"
                            value={phoneNumber}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                if (errors.phoneNumber) {
                                    setErrors({...errors, phoneNumber: null});
                                }
                            }}
                            error={errors.phoneNumber}
                            placeholder="98765 43210"
                        />
                        {/*<TouchableOpacity*/}
                        {/*    style={styles.forgotTextContainer}*/}
                        {/*    onPress={() => navigation.navigate('ForgotPassword')}*/}
                        {/*>*/}
                        {/*    <Text style={styles.forgotText}>Forgot Password?</Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>

                    {/* Login Button */}
                    <Button
                        title="Login"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        size="large"
                        style={{marginBottom: 12}}
                    />

                    {/* Guest Button */}
                    <Button
                        title="Continue as Guest"
                        onPress={() => navigation.replace('MainLayout', {guest: true})}
                        variant="outline"
                        fullWidth
                        size="large"
                    />

                    {/* Separator */}
                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine}/>
                        <Text style={styles.separatorText}>Or</Text>
                        <View style={styles.separatorLine}/>
                    </View>

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