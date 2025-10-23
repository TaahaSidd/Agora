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
import { COLORS } from '../utils/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { apiPost } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useCountdown } from '../hooks/useCountdown';

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
            resetTimer(300); // Fixed: should be resetTimer, not setTimer

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
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="arrow-back" size={24} color="#111827" />
                        </TouchableOpacity>
                    </View>

                    {/* Icon Container */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="lock-closed" size={48} color={COLORS.primary} />
                        </View>
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
                            <Ionicons name="alert-circle" size={20} color="#DC2626" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {success ? (
                        <View style={styles.successContainer}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
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
                                setError(''); // Clear error on input
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!loading}
                        />
                    </View>

                    {/* Send OTP Button */}
                    <Button
                        title={loading ? 'Sending...' : timer > 0 ? `Resend OTP (${formatTime(timer)})` : 'Send OTP'}
                        onPress={handleSendOTP}
                        variant="primary"
                        style={styles.button}
                        disabled={loading || timer > 0}
                    />

                    {/* Timer Info */}
                    {timer > 0 && (
                        <View style={styles.timerContainer}>
                            <Ionicons name="time-outline" size={16} color="#6B7280" />
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    header: {
        paddingTop: 20,
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    titleSection: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#DC2626',
    },
    errorText: {
        color: '#991B1B',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
        lineHeight: 18,
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        borderRadius: 12,
        padding: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#10B981',
    },
    successText: {
        color: '#065F46',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 10,
        flex: 1,
        lineHeight: 18,
    },
    inputCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    button: {
        marginBottom: 16,
        borderRadius: 14,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 12,
        marginBottom: 24,
    },
    timerText: {
        fontSize: 14,
        color: '#78350F',
        marginLeft: 8,
        fontWeight: '500',
    },
    timerBold: {
        fontWeight: '800',
        color: '#92400E',
    },
    helpSection: {
        marginBottom: 24,
    },
    helpCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    helpTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    helpTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    helpText: {
        fontSize: 13,
        color: '#6B7280',
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