import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { apiPost } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useCountdown } from '../hooks/useCountdown';

import Button from '../components/Button';
import InputField from '../components/InputField';


import ForgotPasswordIllustration from '../assets/svg/forgotPassword.svg';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const { time: timer, reset: resetTimer } = useCountdown(0);

    const handleSendOTP = async () => {
        if (!email.trim()) {
            setError('Please enter your registered email.');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await apiPost('/auth/forgot-password', { email });
            setSuccess('OTP sent successfully to your email!');
            resetTimer(300);

            // Navigate after a short delay to show success message
            setTimeout(() => {
                navigation.navigate('OTPScreen', { email });
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content" />

            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >

                        {/* Illustration Container */}
                        <View style={styles.illustrationContainer}>
                            <ForgotPasswordIllustration
                                width={200}
                                height={200}
                            />
                        </View>

                        {/* Title Section */}
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>Forgot Password?</Text>
                            <Text style={styles.subtitle}>
                                Don't worry! Enter your registered email address and we'll send you a verification code to reset your password.
                            </Text>
                        </View>

                        {/* Alert Messages */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color={COLORS.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {success ? (
                            <View style={styles.successContainer}>
                                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                                <Text style={styles.successText}>{success}</Text>
                            </View>
                        ) : null}

                        {/* Input Card */}
                        <View style={styles.inputCard}>
                            <InputField
                                label="Email Address"
                                placeholder="Enter your registered email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setError('');
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                editable={!loading}
                                leftIcon="email-outline"
                            />
                        </View>

                        {/* Send OTP Button */}
                        <Button
                            title={loading ? 'Sending...' : timer > 0 ? `Resend OTP (${formatTime(timer)})` : 'Send OTP'}
                            onPress={handleSendOTP}
                            variant="primary"
                            disabled={loading || timer > 0}
                            fullWidth
                            size="large"
                        />

                        {/* Timer Info */}
                        {timer > 0 && (
                            <View style={styles.timerContainer}>
                                <Ionicons name="time-outline" size={16} color={COLORS.warning} />
                                <Text style={styles.timerText}>
                                    Resend available in <Text style={styles.timerBold}>{formatTime(timer)}</Text>
                                </Text>
                            </View>
                        )}

                        {/* Help Section */}
                        <View style={styles.helpSection}>
                            <View style={styles.helpCard}>
                                <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
                                <View style={styles.helpTextContainer}>
                                    <Text style={styles.helpTitle}>Need Help?</Text>
                                    <Text style={styles.helpText}>
                                        If you don't receive the email, check your spam folder or contact support.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Back to Login */}
                        <TouchableOpacity
                            style={styles.backToLogin}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back-circle-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.backToLoginText}>Back to Login</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: 12,
        marginTop: 60,
        backgroundColor: COLORS.transparentWhite10,
        borderRadius: THEME.borderRadius.full,
    },
    titleSection: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.errorBgDark,
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.error,
    },
    errorText: {
        color: COLORS.errorLight,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
        lineHeight: 18,
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.successBgDark,
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.success,
    },
    successText: {
        color: COLORS.successLight,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
        lineHeight: 18,
    },
    inputCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.warningBgDark,
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
        marginBottom: 24,
    },
    timerText: {
        fontSize: 14,
        color: COLORS.warningLight,
        marginLeft: 8,
        fontWeight: '500',
    },
    timerBold: {
        fontWeight: '800',
        color: COLORS.warning,
    },
    helpSection: {
        marginBottom: 12,
        marginTop: 12,
    },
    helpCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    helpTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    helpTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 4,
    },
    helpText: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        lineHeight: 18,
        fontWeight: '500',
    },
    backToLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    backToLoginText: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: '700',
        marginLeft: 8,
    },
});