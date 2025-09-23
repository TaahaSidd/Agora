import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert('Validation Error', 'Please enter email and password.');
            return;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            const data = await apiPost('/auth/login', { email, password });
            await AsyncStorage.setItem('token', data.jwt);
            navigation.replace('MainLayout');
        } catch (error) {
            Alert.alert(
                'Login Failed',
                error.response?.data?.message || error.message || 'Something went wrong.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Welcome Back</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { paddingRight: 50 }]}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity
                        style={styles.showHideButton}
                        onPress={() => setShowPassword((prev) => !prev)}
                    >
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={24}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(
                            'Forgot Password',
                            'This will trigger your reset password flow.'
                        )
                    }
                >
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={onLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('SignUpFlow')}>
                        <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.darkBlue, justifyContent: 'center' },
    inner: { padding: 20 },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 30,
        alignSelf: 'center',
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        paddingHorizontal: 18,
        paddingVertical: 14,
        marginBottom: 15,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    passwordContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    showHideButton: {
        position: 'absolute',
        right: 18,
        top: 10,
        zIndex: 1,
        padding: 5,
    },
    forgotText: {
        color: COLORS.primary,
        textAlign: 'right',
        marginBottom: 25,
        fontWeight: '600',
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: COLORS.primary + '99',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    signupText: {
        color: COLORS.white,
        fontSize: 16,
        opacity: 0.5,
    },
    signupLink: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
