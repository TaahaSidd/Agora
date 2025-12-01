import React, { useContext, useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
    StatusBar,
} from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { apiGet } from '../services/api';

import { COLORS } from '../utils/colors';

import Button from '../components/Button';
import InputField from '../components/InputField';

export default function SignUpStep2({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [mobileError, setMobileError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [checking, setChecking] = useState(false);

    const checkMobileExists = async (number) => {
        if (!number) return false;
        if (number.length < 10) {
            setMobileError('Mobile number must be 10 digits');
            return false;
        }

        try {
            setChecking(true);
            const data = await apiGet('/auth/check', { mobileNumber: number });
            setMobileError(data.exists ? 'This mobile number is already registered.' : '');
            setChecking(false);
            return !data.exists;
        } catch (err) {
            console.log('Mobile check error:', err);
            setChecking(false);
            return false;
        }
    };

    const checkEmailExists = async (email) => {
        if (!email) return false;
        if (!email || !/\S+@\S+\.\S+/.test(email)) return false;

        try {
            setChecking(true);
            const data = await apiGet('/auth/check', { email });
            setEmailError(data.exists ? 'This email is already registered.' : '');
            setChecking(false);
            return !data.exists;
        } catch (err) {
            console.log('Email check error:', err);
            setChecking(false);
            return false;
        }
    };

    const onNext = async () => {
        if (!form.userEmail?.trim() || !form.mobileNumber?.trim()) {
            alert('Please fill all fields.');
            return;
        }

        const emailValid = await checkEmailExists(form.userEmail);
        const mobileValid = await checkMobileExists(form.mobileNumber);

        if (!emailValid || !mobileValid) {
            alert('Credentials already exists.');
            return;
        }

        navigation.navigate('SignUpStep3');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg} />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.inner}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.mainHeader}>Contact Details</Text>
                        <Text style={styles.subHeader}>How can we reach you?</Text>
                    </View>

                    {/* Form */}
                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        value={form.userEmail}
                        onChangeText={text => {
                            updateForm('userEmail', text);
                            if (/\S+@\S+\.\S+/.test(text)) checkEmailExists(text);
                        }}
                        onBlur={() => checkEmailExists(form.userEmail)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={emailError}
                        leftIcon="email-outline"
                    />

                    <InputField
                        label="Mobile Number"
                        placeholder="Enter your mobile number"
                        value={form.mobileNumber}
                        onChangeText={text => {
                            const cleaned = text.replace(/\D/g, '').slice(0, 10);
                            updateForm('mobileNumber', cleaned);
                            if (cleaned.length === 10) {
                                checkMobileExists(String(cleaned));
                            } else {
                                setMobileError('');
                            }
                        }}
                        keyboardType="phone-pad"
                        error={mobileError}
                        leftIcon="phone-outline"
                    />

                    {/* Step Indicator */}
                    <View style={styles.stepIndicator}>
                        <View style={styles.stepDot} />
                        <View style={[styles.stepDot, styles.stepDotActive]} />
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonsRow}>
                        <Button
                            title="Back"
                            onPress={() => navigation.goBack()}
                            variant="secondary"
                            style={styles.backButton}
                            size="large"
                        />
                        <Button
                            title="Next"
                            onPress={onNext}
                            variant="primary"
                            style={styles.nextButton}
                            size="large"
                            loading={checking}
                            disabled={checking}
                        />
                    </View>
                </View>
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
    nextButton: {
        flex: 1,
    },
});