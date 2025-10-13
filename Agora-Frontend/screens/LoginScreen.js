import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InputField from '../components/InputField';
import ToastMessage from '../components/ToastMessage';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const [errors, setErrors] = useState({});

    const showToast = ({ type, title, message }) => {
        setToast({ visible: true, type, title, message });
    };

    const validateFields = () => {
        const validationErrors = {};
        if (!email.trim()) validationErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Email format is invalid';

        if (!password) validationErrors.password = 'Password is required';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const storeTokens = async (jwt, refreshToken) => {
        await SecureStore.setItemAsync('accessToken', jwt);
        await SecureStore.setItemAsync('refreshToken', refreshToken);

        const checkAccess = await SecureStore.getItemAsync('accessToken');
        const checkRefresh = await SecureStore.getItemAsync('refreshToken');
        console.log('✅ Tokens stored successfully:', {
            accessToken: checkAccess,
            refreshToken: checkRefresh,
        });
    };

    const onLogin = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const data = await apiPost('/auth/login', { email, password });
            await storeTokens(data.jwt, data.refreshToken);
            navigation.navigate('MainLayout');
        } catch (error) {
            showToast({
                type: 'error',
                title: 'Login Failed',
                message: error.response?.data?.message || error.message || 'Something went wrong.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <Svg
                height="400"
                width={width}
                viewBox={`0 0 ${width} 400`}
                style={styles.wavyBackground}
            >
                <Path
                    d={`M0 250 C ${width * 0.25} 350, ${width * 0.75} 150, ${width} 250 L ${width} 0 L0 0 Z`}
                    fill={COLORS.primary}
                />
            </Svg>

            <View style={styles.inner}>
                <Text style={styles.title}>Welcome Back</Text>

                <InputField
                    label="Email"
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setErrors((prev) => ({ ...prev, email: null }));
                    }}
                    keyboardType="email-address"
                    error={errors.email}
                />

                <InputField
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    secureTextEntry={!showPassword}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                            <MaterialCommunityIcons
                                name={showPassword ? 'eye' : 'eye-off'}
                                size={22}
                                color={COLORS.primary}
                            />
                        </TouchableOpacity>
                    }
                    error={errors.password}
                />

                <TouchableOpacity
                    onPress={() =>
                        showToast({
                            type: 'info',
                            title: 'Forgot Password',
                            message: 'This will trigger your reset password flow.',
                        })
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

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    wavyBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    inner: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 30,
        alignSelf: 'center',
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
        color: COLORS.black,
        fontSize: 16,
        opacity: 0.7,
    },
    signupLink: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});