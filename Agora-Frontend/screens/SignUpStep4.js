import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function SignUpStep4({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
            navigation.replace('MainLayout');
        } catch (error) {
            Alert.alert('Signup Failed', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#EFF6FF', '#DBEAFE', '#BFDBFE']}
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.inner}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.mainHeader}>Secure Account</Text>
                        <Text style={styles.subHeader}>Create a strong password</Text>
                    </View>

                    {/* Form */}
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
                            style={styles.backButton}
                            disabled={loading}
                            size="large"
                        />
                        <Button
                            title="Create Account"
                            onPress={onSubmit}
                            variant="primary"
                            style={styles.submitButton}
                            disabled={loading}
                            loading={loading}
                            size="large"
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: COLORS.white,
        backgroundColor: 'transparent',
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
        color: COLORS.black,
        marginBottom: 2,
    },
    subHeader: {
        fontSize: 20,
        color: COLORS.gray,
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
        backgroundColor: '#edf5ffff',
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
    // submitButton: {
    //     flex: 1,
    // },
});