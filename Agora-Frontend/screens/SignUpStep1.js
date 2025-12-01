import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function SignUpStep1({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const validationErrors = {};
        if (!form.firstName.trim()) validationErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) validationErrors.lastName = 'Last name is required';
        if (!form.userName.trim()) validationErrors.userName = 'Username is required';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const onNext = () => {
        if (!validateFields()) return;
        navigation.navigate('SignUpStep2');
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
                        <Text style={styles.mainHeader}>Create Account</Text>
                        <Text style={styles.subHeader}>Let's get started with your details</Text>
                    </View>

                    {/* Form */}
                    <InputField
                        label="First Name"
                        placeholder="Enter your first name"
                        value={form.firstName}
                        onChangeText={(text) => {
                            updateForm('firstName', text);
                            setErrors({ ...errors, firstName: null });
                        }}
                        error={errors.firstName}
                        leftIcon="account-outline"
                        autoCapitalize="words"
                    />

                    <InputField
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={form.lastName}
                        onChangeText={(text) => {
                            updateForm('lastName', text);
                            setErrors({ ...errors, lastName: null });
                        }}
                        error={errors.lastName}
                        leftIcon="account-outline"
                        autoCapitalize="words"
                    />

                    <InputField
                        label="Username"
                        placeholder="Auto-generated username"
                        value={form.userName}
                        editable={false}
                        leftIcon="account-outline"
                    />

                    {/* Step Indicator */}
                    <View style={styles.stepIndicator}>
                        <View style={[styles.stepDot, styles.stepDotActive]} />
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                    </View>

                    <Button
                        title="Next"
                        onPress={onNext}
                        variant="primary"
                        fullWidth
                        size="large"
                    />

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    loginText: {
        color: COLORS.dark.textSecondary,
        fontSize: 16,
    },
    loginLink: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});