import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import * as SecureStore from 'expo-secure-store';
import {useUserStore} from '../stores/userStore';

import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';

import {COLORS} from '../utils/colors';
import {loginWithOtp, signupWithOtp} from "../services/api";
import auth from "@react-native-firebase/auth";

export default function OTPVerificationScreen({route, navigation}) {
    const {phoneNumber, collegeId, collegeName, expoPushToken, confirmation} = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const {fetchUser} = useUserStore();

    const inputRefs = useRef([]);

    // Timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    const handleOtpChange = (index, value) => {
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (index, key) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            showToast({
                type: 'error',
                title: 'Invalid OTP',
                message: 'Please enter 6-digit code',
            });
            return;
        }

        setLoading(true);
        try {
            console.log('🔐 Verifying OTP...');

            const userCredential = await confirmation.confirm(otpCode);

            const firebaseToken = await userCredential.user.getIdToken();

            const payload = {
                firebaseToken,
                collegeId,
                expoPushToken
            };

            let response;

            if (collegeId) {
                response = await signupWithOtp(firebaseToken, collegeId, expoPushToken);
            } else {
                response = await loginWithOtp(firebaseToken, expoPushToken);
            }

            console.log('✅ Backend response:', response);

            await Promise.all([
                SecureStore.deleteItemAsync('accessToken'),
                SecureStore.deleteItemAsync('refreshToken'),
                SecureStore.deleteItemAsync('currentUser'),
                SecureStore.deleteItemAsync('userId')
            ]);

            await Promise.all([
                SecureStore.setItemAsync('accessToken', response.jwt),
                SecureStore.setItemAsync('refreshToken', response.refreshToken),
                SecureStore.setItemAsync('userId', response.id.toString())
            ]);

            const userStore = useUserStore.getState();
            await userStore.fetchUser();

            const finalCollegeName = userStore.currentUser?.college?.name || response.collegeName || collegeName;

            if (response.verificationStatus === 'VERIFIED') {
                showToast({
                    type: 'success',
                    title: 'Welcome Back!',
                    message: 'Login successful',
                });
                navigation.replace('MainLayout');
            } else {
                // User is PENDING, must complete profile
                showToast({
                    type: 'success',
                    title: 'Phone Verified!',
                    message: 'Please complete your profile details',
                });
                navigation.replace('CompleteProfileScreen', {
                    collegeName: finalCollegeName
                });
            }

        } catch (error) {
            console.error('❌ Verification error:', error);
            let errorMessage = 'Verification failed. Please try again.';

            if (error.code === 'auth/invalid-verification-code') {
                errorMessage = 'Invalid OTP code. Please try again.';
            } else if (error.code === 'auth/code-expired') {
                errorMessage = 'OTP expired. Please request a new code.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showToast({
                type: 'error',
                title: 'Verification Failed',
                message: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            setLoading(true);
            console.log('🔄 Resending OTP to:', phoneNumber);

            const newConfirmation = await auth().signInWithPhoneNumber(phoneNumber);

            navigation.setParams({ confirmation: newConfirmation });

            setResendTimer(60);
            showToast({
                type: 'success',
                title: 'OTP Sent',
                message: 'A new 6-digit code has been sent.',
            });
        } catch (error) {
            console.error('❌ Resend error:', error);
            showToast({
                type: 'error',
                title: 'Resend Failed',
                message: 'Too many requests. Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg}/>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    disabled={loading}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.dark.text}/>
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons name="chatbox-ellipses" size={60} color={COLORS.primary}/>
                </View>

                {/* Title */}
                <Text style={styles.title}>Verify Your Phone</Text>
                <Text style={styles.subtitle}>
                    Enter the 6-digit code sent to{'\n'}
                    <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                </Text>

                {/* OTP Input */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={ref => inputRefs.current[index] = ref}
                            style={[
                                styles.otpInput,
                                digit && styles.otpInputFilled
                            ]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(index, value)}
                            onKeyPress={({nativeEvent: {key}}) => handleKeyPress(index, key)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                            editable={!loading}
                        />
                    ))}
                </View>

                {/* Resend */}
                <View style={styles.resendContainer}>
                    {resendTimer > 0 ? (
                        <Text style={styles.timerText}>
                            Resend code in {resendTimer}s
                        </Text>
                    ) : (
                        <TouchableOpacity
                            onPress={handleResendOTP}
                            disabled={loading}
                        >
                            <Text style={styles.resendText}>Resend Code</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Verify Button */}
                <Button
                    title={loading ? "Verifying..." : "Verify & Continue"}
                    onPress={handleVerifyOTP}
                    loading={loading}
                    disabled={loading || otp.join('').length !== 6}
                    fullWidth
                    size="large"
                />
            </View>

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({...toast, visible: false})}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.primary + '20',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.dark.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 40,
    },
    phoneNumber: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 32,
        paddingHorizontal: 10,
        width: '100%',
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.dark.border,
        backgroundColor: COLORS.dark.card,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.dark.text,
    },
    otpInputFilled: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary + '10',
    },
    resendContainer: {
        marginBottom: 32,
        minHeight: 24,
    },
    timerText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
    },
    resendText: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});