import React, { useContext, useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpStep4({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Password strength calculator
    const passwordStrength = useMemo(() => {
        if (!form.password) return { score: 0, label: '', color: '' };

        let score = 0;
        const password = form.password;

        // Length check
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(password)) score++;  // lowercase
        if (/[A-Z]/.test(password)) score++;  // uppercase
        if (/[0-9]/.test(password)) score++;  // numbers
        if (/[^a-zA-Z0-9]/.test(password)) score++; // special chars

        // Determine strength
        if (score <= 2) {
            return { score: 25, label: 'Weak', color: COLORS.error };
        } else if (score <= 4) {
            return { score: 50, label: 'Fair', color: COLORS.warning };
        } else if (score <= 6) {
            return { score: 75, label: 'Good', color: COLORS.info };
        } else {
            return { score: 100, label: 'Strong', color: COLORS.success };
        }
    }, [form.password]);

    const validateFields = () => {
        const validationErrors = {};

        if (!form.password) {
            validationErrors.password = 'Password is required';
        } else if (form.password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        }

        if (!form.confirmPassword) {
            validationErrors.confirmPassword = 'Please confirm your password';
        } else if (form.password !== form.confirmPassword) {
            validationErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const onSubmit = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const body = {
                userName: form.userName,
                firstName: form.firstName,
                lastName: form.lastName,
                mobileNumber: form.mobileNumber,
                userEmail: form.userEmail,
                idCardNo: form.idCardNo,
                collegeId: form.collegeId,
                password: form.password,
            };

            const data = await apiPost('/auth/register', body);
            console.log('Signup payload:', body);
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('MainLayout');
        } catch (error) {
            Alert.alert('Signup Failed', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg} />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.inner}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.mainHeader}>Secure Account</Text>
                        <Text style={styles.subHeader}>Create a strong password</Text>
                    </View>

                    {/* Form */}
                    <View>
                        <InputField
                            label="Password"
                            placeholder="Enter password (min. 6 characters)"
                            value={form.password}
                            onChangeText={text => {
                                updateForm('password', text);
                                setErrors({ ...errors, password: null });
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            error={errors.password}
                            leftIcon="lock-outline"
                        />

                        {/* Password Strength Bar */}
                        {form.password && (
                            <View style={styles.strengthBarContainer}>
                                <View style={styles.strengthBar}>
                                    <View
                                        style={[
                                            styles.strengthFill,
                                            {
                                                width: `${passwordStrength.score}%`,
                                                backgroundColor: passwordStrength.color
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                                    {passwordStrength.label}
                                </Text>
                            </View>
                        )}

                        {/* Password Requirements Info Box */}
                        <View style={styles.infoBox}>
                            <View style={styles.infoHeader}>
                                <Ionicons name="shield-checkmark" size={18} color={COLORS.info} />
                                <Text style={styles.infoTitle}>Password must contain:</Text>
                            </View>
                            <Text style={styles.infoText}>
                                At least 8 characters, including uppercase, lowercase, number and special character
                            </Text>
                        </View>
                    </View>

                    <InputField
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChangeText={text => {
                            updateForm('confirmPassword', text);
                            setErrors({ ...errors, confirmPassword: null });
                        }}
                        secureTextEntry
                        autoCapitalize="none"
                        error={errors.confirmPassword}
                        leftIcon="lock-outline"
                    />

                    {/* Password Match Indicator */}
                    {form.password && form.confirmPassword && (
                        <View style={styles.matchContainer}>
                            {form.password === form.confirmPassword ? (
                                <View style={styles.matchSuccess}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    <Text style={styles.matchSuccessText}>Passwords match</Text>
                                </View>
                            ) : (
                                <View style={styles.matchError}>
                                    <Ionicons name="close-circle" size={16} color={COLORS.error} />
                                    <Text style={styles.matchErrorText}>Passwords do not match</Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Step Indicator */}
                    <View style={styles.stepIndicator}>
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                        <View style={[styles.stepDot, styles.stepDotActive]} />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonsRow}>
                        <Button
                            title="Back"
                            onPress={() => navigation.goBack()}
                            variant="secondary"
                            //style={styles.backButton}
                            disabled={loading}
                            size="large"
                        />
                        <Button
                            title="Create Account"
                            onPress={onSubmit}
                            variant="primary"
                            //style={styles.submitButton}
                            disabled={loading}
                            loading={loading}
                            size="large"
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

// No helper component needed anymore

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    keyboardView: {
        flex: 1,
    },
    inner: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    headerSection: {
        marginBottom: 30,
    },
    mainHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.dark.text,
        marginBottom: 2,
    },
    subHeader: {
        fontSize: 20,
        color: COLORS.dark.textSecondary,
        marginBottom: 10,
    },
    strengthBarContainer: {
        marginTop: -8,
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    strengthBar: {
        height: 4,
        backgroundColor: COLORS.dark.border,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 6,
    },
    strengthFill: {
        height: '100%',
        borderRadius: 2,
    },
    strengthLabel: {
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'right',
    },
    infoBox: {
        marginTop: -4,
        marginBottom: 20,
        backgroundColor: `${COLORS.info}15`,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: `${COLORS.info}30`,
    },
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.info,
    },
    infoText: {
        fontSize: 12,
        color: COLORS.dark.textSecondary,
        lineHeight: 18,
    },
    matchContainer: {
        marginTop: -8,
        marginBottom: 20,
        paddingHorizontal: 4,
    },
    matchSuccess: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${COLORS.success}15`,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: `${COLORS.success}30`,
    },
    matchSuccessText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.success,
    },
    matchError: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${COLORS.error}15`,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: `${COLORS.error}30`,
    },
    matchErrorText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.error,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 20,
    },
    stepDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.dark.border,
    },
    stepDotActive: {
        backgroundColor: COLORS.primary,
        width: 30,
        borderRadius: 5,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    backButton: {
        flex: 1,
    },
    submitButton: {
        flex: 1,
    },
});