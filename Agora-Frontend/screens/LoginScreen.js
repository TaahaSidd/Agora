// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     KeyboardAvoidingView,
//     Platform,
//     StatusBar,
// } from 'react-native';
// import { COLORS } from '../utils/colors';
// import { apiPost } from '../services/api';
// import * as SecureStore from 'expo-secure-store';
// import * as Notifications from "expo-notifications";
// import { saveExpoPushToken } from "../services/notificationTokenService";

// import InputField from '../components/InputField';
// import ToastMessage from '../components/ToastMessage';
// import Button from '../components/Button';

// export default function LoginScreen({ navigation }) {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
//     const [errors, setErrors] = useState({});

//     const showToast = ({ type, title, message }) => {
//         setToast({ visible: true, type, title, message });
//     };

//     const validateFields = () => {
//         const validationErrors = {};
//         if (!email.trim()) validationErrors.email = 'Email is required';
//         else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Email format is invalid';

//         if (!password) validationErrors.password = 'Password is required';

//         setErrors(validationErrors);
//         return Object.keys(validationErrors).length === 0;
//     };

//     const storeTokens = async (jwt, refreshToken) => {
//         await SecureStore.setItemAsync('accessToken', jwt);
//         await SecureStore.setItemAsync('refreshToken', refreshToken);

//         const checkAccess = await SecureStore.getItemAsync('accessToken');
//         const checkRefresh = await SecureStore.getItemAsync('refreshToken');

//     };

//     // const onLogin = async () => {
//     //     if (!validateFields()) return;

//     //     setLoading(true);
//     //     try {
//     //         const data = await apiPost('/auth/login', { email, password });
//     //         await storeTokens(data.jwt, data.refreshToken);
//     //         navigation.navigate('MainLayout');
//     //     } catch (error) {
//     //         showToast({
//     //             type: 'error',
//     //             title: 'Login Failed',
//     //             message: error.response?.data?.message || error.message || 'Something went wrong.',
//     //         });
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     const onLogin = async () => {
//         if (!validateFields()) return;

//         setLoading(true);
//         try {
//             const data = await apiPost('/auth/login', { email, password });
//             console.log('Login response:', data);

//             // Store tokens
//             await storeTokens(data.jwt, data.refreshToken);

//             // 1) Get expo push token
//             const { status } = await Notifications.getPermissionsAsync();
//             let finalStatus = status;

//             if (status !== "granted") {
//                 const { status: askStatus } = await Notifications.requestPermissionsAsync();
//                 finalStatus = askStatus;
//             }

//             if (finalStatus === "granted") {
//                 const expoToken = (await Notifications.getExpoPushTokenAsync()).data;

//                 // 2) Save token to backend
//                 await saveExpoPushToken(data.user.id, expoToken);
//             }

//             // 3) Navigate
//             navigation.navigate('MainLayout');

//         } catch (error) {
//             showToast({
//                 type: 'error',
//                 title: 'Login Failed',
//                 message: error.response?.data?.message || error.message || 'Something went wrong.',
//             });
//         } finally {
//             setLoading(false);
//         }
//     };


//     const onGoogleLogin = () => {
//         showToast({
//             type: 'info',
//             title: 'Continue with Google',
//             message: 'Google login feature is not implemented yet.',
//         });
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg} />

//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 style={styles.keyboardView}
//             >
//                 <View style={styles.inner}>
//                     <Text style={styles.mainHeader}>Login</Text>

//                     <Text style={styles.subHeader}>Welcome Back to Agora</Text>

//                     <InputField
//                         label="Email"
//                         value={email}
//                         onChangeText={setEmail}
//                         error={errors.email}
//                         leftIcon="email-outline"
//                     />

//                     <View style={styles.passwordContainer}>
//                         <InputField
//                             label="Password"
//                             value={password}
//                             onChangeText={setPassword}
//                             secureTextEntry
//                             error={errors.password}
//                             leftIcon="lock-outline"
//                         />

//                         <TouchableOpacity
//                             style={styles.forgotTextContainer}
//                             onPress={() => navigation.navigate('ForgotPassword')}
//                         >
//                             <Text style={styles.forgotText}>Forgot Password?</Text>
//                         </TouchableOpacity>
//                     </View>

//                     <Button
//                         title="Login In"
//                         onPress={onLogin}
//                         loading={loading}
//                         disabled={loading}
//                         fullWidth
//                         size="large"
//                     />

//                     <Text style={styles.separatorText}>or sign with</Text>

//                     <Button
//                         title="Continue with Google"
//                         onPress={onGoogleLogin}
//                         variant="outline"
//                         fullWidth
//                         icon="logo-google"
//                         size="large"
//                     />

//                     <View style={styles.signupContainer}>
//                         <Text style={styles.signupText}>Don't have an account? </Text>
//                         <TouchableOpacity onPress={() => navigation.navigate('SignUpFlow')}>
//                             <Text style={styles.signupLink}>Create an account</Text>
//                         </TouchableOpacity>
//                     </View>

//                     <TouchableOpacity
//                         style={styles.guestButton}
//                         onPress={() => navigation.replace('MainLayout', { guest: true })}
//                     >
//                         <Text style={styles.guestText}>
//                             Continue as Guest
//                         </Text>
//                     </TouchableOpacity>
//                 </View>

//                 {toast.visible && (
//                     <ToastMessage
//                         type={toast.type}
//                         title={toast.title}
//                         message={toast.message}
//                         onHide={() => setToast({ ...toast, visible: false })}
//                     />
//                 )}
//             </KeyboardAvoidingView>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: COLORS.dark.bg,
//     },
//     keyboardView: {
//         flex: 1,
//     },
//     inner: {
//         flex: 1,
//         padding: 20,
//         justifyContent: 'center',
//     },
//     mainHeader: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: COLORS.dark.text,
//         marginBottom: 2,
//         alignSelf: 'flex-start',
//     },
//     subHeader: {
//         fontSize: 20,
//         color: COLORS.dark.textSecondary,
//         marginBottom: 30,
//         alignSelf: 'flex-start',
//     },
//     passwordContainer: {
//         marginBottom: 8,
//     },
//     forgotTextContainer: {
//         alignSelf: 'flex-end',
//     },
//     forgotText: {
//         color: COLORS.primary,
//         fontWeight: '600',
//         marginBottom: 12,
//     },
//     separatorText: {
//         color: COLORS.dark.textSecondary,
//         textAlign: 'center',
//         marginVertical: 10,
//         fontSize: 16,
//     },
//     signupContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginTop: 25,
//     },
//     signupText: {
//         color: COLORS.dark.textSecondary,
//         fontSize: 16,
//     },
//     signupLink: {
//         color: COLORS.primary,
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     guestButton: {
//         marginTop: 20,
//         alignSelf: 'center',
//     },
//     guestText: {
//         color: COLORS.primary,
//         fontWeight: '700',
//         fontSize: 16,
//     },
// });




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
import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from "expo-notifications";
import { saveExpoPushToken } from "../services/notificationTokenService";

import InputField from '../components/InputField';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
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
    };

    const onLogin = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const data = await apiPost('/auth/login', { email, password });

            // Store tokens
            await storeTokens(data.jwt, data.refreshToken);

            // 1) Get expo push token
            const { status } = await Notifications.getPermissionsAsync();
            let finalStatus = status;

            if (status !== "granted") {
                const { status: askStatus } = await Notifications.requestPermissionsAsync();
                finalStatus = askStatus;
            }

            if (finalStatus === "granted") {
                const expoToken = (await Notifications.getExpoPushTokenAsync()).data;

                // 2) Save token to backend
                await saveExpoPushToken(data.id, expoToken); // <-- use data.id directly
            }

            // 3) Navigate
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

    const onGoogleLogin = () => {
        showToast({
            type: 'info',
            title: 'Continue with Google',
            message: 'Google login feature is not implemented yet.',
        });
    };

    const onAppleLogin = () => {
        showToast({
            type: 'info',
            title: 'Sign in with Apple',
            message: 'Apple login feature is not implemented yet.',
        });
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
                        <Text style={styles.mainHeader}>Log In</Text>
                        <Text style={styles.subHeader}>
                            Welcome back! Please log in to your account
                        </Text>
                    </View>

                    {/* Input Fields */}
                    <View style={styles.inputSection}>
                        <InputField
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            error={errors.email}
                            leftIcon="email-outline"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        <InputField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            error={errors.password}
                            leftIcon="lock-outline"
                        />

                        <TouchableOpacity
                            style={styles.forgotTextContainer}
                            onPress={() => navigation.navigate('ForgotPassword')}
                        >
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Login Button */}
                    <Button
                        title="Login"
                        onPress={onLogin}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        size="large"
                        style={{ marginBottom: 12 }}
                    />

                    {/* Guest Button */}
                    <Button
                        title="Continue as Guest"
                        onPress={() => navigation.replace('MainLayout', { guest: true })}
                        variant="outline"
                        fullWidth
                        size="large"
                    />

                    {/* Separator */}
                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                        <Text style={styles.separatorText}>Or continue with</Text>
                        <View style={styles.separatorLine} />
                    </View>

                    {/* Social Login Buttons */}
                    <View style={styles.socialButtonsContainer}>
                        <Button
                            title="Sign in with Google"
                            onPress={onGoogleLogin}
                            variant="outline"
                            fullWidth
                            icon="logo-google"
                            size="large"
                        />

                        <Button
                            title="Sign in with Apple"
                            onPress={onAppleLogin}
                            variant="outline"
                            fullWidth
                            icon="logo-apple"
                            size="large"
                        />
                    </View>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpFlow')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
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
    forgotTextContainer: {
        alignSelf: 'flex-start',
        marginTop: -8,
        marginBottom: 8,
    },
    forgotText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.dark.border,
    },
    separatorText: {
        color: COLORS.dark.textTertiary,
        fontSize: 14,
        marginHorizontal: 12,
    },
    socialButtonsContainer: {
        gap: 12,
        marginBottom: 12,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: COLORS.dark.textSecondary,
        fontSize: 15,
    },
    signupLink: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: 'bold',
    },
});