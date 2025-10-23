import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiPost } from '../services/api';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { COLORS } from '../utils/colors';

const OTPVerificationScreen = () => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timer, setTimer] = useState(600);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    const navigation = useNavigation();
    const route = useRoute();
    const email = route.params?.email || '';

    const inputRefs = useRef([]);

    const isPasswordStrong = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongRegex.test(password);
    };

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        } else {
            setIsResendDisabled(false);
        }
    }, [timer]);

    const handleOtpChange = (value, index) => {
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setSuccess('');
        try {
            await apiPost('/auth/forgot-password', { email });
            setSuccess('OTP resent to your email.');
            setTimer(600);
            setIsResendDisabled(true);
        } catch (err) {
            setError(err.message || 'Failed to resend OTP.');
        }
    };

    const handleResetPassword = async () => {
        setError('');
        setSuccess('');

        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 6) {
            setError('Please enter all 6 digits of the OTP.');
            return;
        }

        if (!isPasswordStrong(newPassword)) {
            setError(
                'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            await apiPost('/auth/reset-password', { email, otp: enteredOtp, newPassword });
            setSuccess('Password reset successfully!');
            setTimeout(() => navigation.navigate('LoginScreen'), 1500);
        } catch (err) {
            setError(err.message || 'Password reset failed. Try again.');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Verify OTP & Reset Password</Text>
                    <Text style={styles.subtitle}>Enter the 6-digit OTP sent to {email}</Text>
                </View>

                {/* Timer */}
                <Text style={styles.timerText}>OTP valid for: {formatTime(timer)}</Text>

                {/* Error / Success Messages */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                {success ? <Text style={styles.successText}>{success}</Text> : null}

                {/* OTP Boxes */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={[
                                styles.otpBox,
                                digit ? styles.otpFilled : {},
                            ]}
                            keyboardType="numeric"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={({ nativeEvent }) => {
                                if (
                                    nativeEvent.key === 'Backspace' &&
                                    otp[index] === '' &&
                                    index > 0
                                ) {
                                    inputRefs.current[index - 1].focus();
                                }
                            }}
                        />
                    ))}
                </View>

                {/* Password Fields */}
                <InputField
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                />
                <InputField
                    placeholder="Confirm New Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                />
                <Text style={styles.hintText}>
                    Use at least 8 characters, including upper & lowercase letters, numbers, and
                    symbols.
                </Text>

                {/* Buttons */}
                <Button title="Reset Password" onPress={handleResetPassword} style={styles.button} />
                <Button
                    title={isResendDisabled ? `Resend OTP (${formatTime(timer)})` : 'Resend OTP'}
                    onPress={handleResendOTP}
                    disabled={isResendDisabled}
                    variant="secondary"
                    style={styles.resendButton}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 5,
        padding: 5,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.textPrimary || '#000',
        textAlign: 'center',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 6,
    },
    timerText: {
        textAlign: 'center',
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 10,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    otpBox: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 18,
        color: '#000',
        backgroundColor: '#fafafa',
    },
    otpFilled: {
        borderColor: COLORS.primary,
        backgroundColor: '#e6f2ff',
    },
    input: {
        marginVertical: 8,
    },
    hintText: {
        fontSize: 12,
        color: '#777',
        marginBottom: 10,
        textAlign: 'left',
    },
    button: {
        marginTop: 10,
    },
    resendButton: {
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    successText: {
        color: 'green',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default OTPVerificationScreen;
