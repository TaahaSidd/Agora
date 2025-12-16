import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ScrollView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';

import { apiPost } from '../services/api';
import { saveExpoPushToken } from '../services/notificationTokenService';
import { useUserStore } from '../stores/userStore';

import ImageUploadField from '../components/ImageUploadField';
import PhoneInputField from '../components/PhoneInputField';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';

import { COLORS } from '../utils/colors';

export default function SignUpScreen({ navigation }) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [idCardImage, setIdCardImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const [errors, setErrors] = useState({});
    const { fetchUser } = useUserStore();

    const showToast = ({ type, title, message }) => {
        setToast({ visible: true, type, title, message });
    };

    const validateFields = () => {
        const validationErrors = {};

        // Phone validation for India
        if (!phoneNumber.trim()) {
            validationErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9][0-9]{9}$/.test(phoneNumber.replace(/[\s-]/g, ''))) {
            validationErrors.phoneNumber = 'Enter valid 10-digit Indian mobile number';
        }

        // ID Card validation
        if (!idCardImage) {
            validationErrors.idCard = 'ID card is required for verification';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const storeTokens = async (jwt, refreshToken) => {
        await SecureStore.setItemAsync('accessToken', jwt);
        await SecureStore.setItemAsync('refreshToken', refreshToken);
    };

    const registerPushTokenForUser = async (userId) => {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('❌ Notification permission denied');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        await saveExpoPushToken(userId, token);

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    };

    const onSignUp = async () => {
        if (!validateFields()) {
            return;
        }

        setLoading(true);
        try {
            // Create FormData for signup
            const formData = new FormData();
            formData.append('phoneNumber', '+91' + phoneNumber); // Add +91 prefix
            formData.append('idCard', {
                uri: idCardImage,
                type: 'image/jpeg',
                name: `id_card_${Date.now()}.jpg`,
            });

            const data = await apiPost('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('✅ SIGNUP RESPONSE:', data);

            await storeTokens(data.jwt, data.refreshToken);

            if (data.id) {
                await registerPushTokenForUser(data.id);
            }

            await fetchUser();

            showToast({
                type: 'success',
                title: 'Account Created',
                message: 'Welcome to Agora!',
            });

            setTimeout(() => {
                navigation.replace('MainLayout');
            }, 1500);

        } catch (error) {
            showToast({
                type: 'error',
                title: 'Sign Up Failed',
                message: error.response?.data?.message || error.message || 'Something went wrong.',
            });
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
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.mainHeader}>Sign Up</Text>
                        <Text style={styles.subHeader}>
                            Create your account to get started
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <View style={styles.inputSection}>
                        <PhoneInputField
                            label="Phone Number"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            error={errors.phoneNumber}
                            placeholder="98765 43210"
                        />

                        <ImageUploadField
                            label="Student ID / ID Card"
                            value={idCardImage}
                            onImageSelect={(uri) => {
                                setIdCardImage(uri);
                                setErrors({ ...errors, idCard: null });
                            }}
                            error={errors.idCard}
                            placeholder="Upload your ID card"
                            maxSizeInMB={5}
                            aspectRatio={[16, 9]}
                        />
                    </View>

                    {/* Sign Up Button */}
                    <Button
                        title="Sign Up"
                        onPress={onSignUp}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        size="large"
                    />

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({ ...toast, visible: false })}
                    />
                )}
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    mainHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.dark.text,
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
    },
    inputSection: {
        marginBottom: 24,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    loginText: {
        color: COLORS.dark.textSecondary,
        fontSize: 15,
    },
    loginLink: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
});