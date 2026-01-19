import React, {useEffect, useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import auth from '@react-native-firebase/auth';
import * as Notifications from 'expo-notifications';

import {getColleges} from '../services/api';
import PhoneInputField from '../components/PhoneInputField';
import InputField from '../components/InputField';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';

import {COLORS} from '../utils/colors';

export default function SignUpScreen({navigation}) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [colleges, setColleges] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const [errors, setErrors] = useState({});
    const [expoPushToken, setExpoPushToken] = useState(null);

    useEffect(() => {
        fetchColleges();
        requestNotificationPermission();
    }, []);

    const requestNotificationPermission = async () => {
        try {
            const {status: existingStatus} = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.log('❌ Notification permission denied');
                return;
            }

            // const token = (await Notifications.getExpoPushTokenAsync({
            //     projectId: "ab8254ef-e49b-437f-be6a-ff0a040dd210"
            // })).data;
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);
            console.log('✅ Expo Push Token obtained:', token);

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
        } catch (error) {
            console.error('❌ Error getting push token:', error);
        }
    };

    const fetchColleges = async () => {
        try {
            const data = await getColleges();
            setColleges(data);
        } catch (error) {
            console.error('Failed to fetch colleges:', error);
        }
    };

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    const filteredColleges = query.trim()
        ? colleges.filter(college =>
            college.collegeName.toLowerCase().includes(query.toLowerCase())
        )
        : [];

    const handleCollegeSelect = (college) => {
        setSelectedCollege(college);
        setQuery(college.collegeName);
        setErrors({...errors, college: null});
    };

    const validateFields = () => {
        const validationErrors = {};

        if (!phoneNumber.trim()) {
            validationErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[6-9][0-9]{9}$/.test(phoneNumber.replace(/[\s-]/g, ''))) {
            validationErrors.phoneNumber = 'Enter valid 10-digit Indian mobile number';
        }

        if (!selectedCollege) {
            validationErrors.college = 'Please select your college';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSendOTP = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const fullPhoneNumber = '+91' + phoneNumber;
            console.log('📤 Sending OTP to:', fullPhoneNumber);

            const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

            console.log('✅ OTP sent successfully');

            showToast({
                type: 'success',
                title: 'OTP Sent',
                message: 'Verification code sent to your phone',
            });

            setTimeout(() => {
                navigation.navigate('OTPVerificationScreen', {
                    phoneNumber: fullPhoneNumber,
                    collegeId: selectedCollege.id,
                    collegeName: selectedCollege.collegeName,
                    expoPushToken: expoPushToken,
                    confirmation: confirmation,
                });
            }, 1500);

        } catch (error) {
            console.error('❌ Send OTP error:', error);

            let errorMessage = 'Failed to send OTP. Please try again.';

            if (error.code === 'auth/invalid-phone-number') {
                errorMessage = 'Invalid phone number format';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later';
            }

            showToast({
                type: 'error',
                title: 'Failed',
                message: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.dark.bg}/>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.mainHeader}>Sign Up</Text>
                        <Text style={styles.subHeader}>
                            Create your account to get started
                        </Text>
                    </View>

                    <View style={styles.inputSection}>
                        <PhoneInputField
                            label="Phone Number *"
                            value={phoneNumber}
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                if (errors.phoneNumber) {
                                    setErrors({...errors, phoneNumber: null});
                                }
                            }}
                            error={errors.phoneNumber}
                            placeholder="98765 43210"
                        />

                        <View style={styles.dropdownWrapper}>
                            <InputField
                                label="College *"
                                placeholder="Search your college"
                                value={query}
                                onChangeText={text => {
                                    setQuery(text);
                                    if (text !== selectedCollege?.collegeName) {
                                        setSelectedCollege(null);
                                    }
                                }}
                                leftIcon="school-outline"
                                error={errors.college}
                            />

                            {filteredColleges.length > 0 && !selectedCollege && (
                                <View style={styles.dropdown}>
                                    <View style={styles.dropdownHeader}>
                                        <Text style={styles.dropdownHeaderText}>
                                            {filteredColleges.length} {filteredColleges.length === 1 ? 'college' : 'colleges'} found
                                        </Text>
                                    </View>
                                    <ScrollView
                                        style={{maxHeight: 220}}
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={true}
                                    >
                                        {filteredColleges.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[
                                                    styles.dropdownItem,
                                                    index === filteredColleges.length - 1 && styles.dropdownItemLast
                                                ]}
                                                onPress={() => handleCollegeSelect(item)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.dropdownIconContainer}>
                                                    <Ionicons name="school" size={18} color={COLORS.primary}/>
                                                </View>
                                                <Text style={styles.dropdownText} numberOfLines={2}>
                                                    {item.collegeName}
                                                </Text>
                                                <Ionicons name="chevron-forward" size={16}
                                                          color={COLORS.dark.textTertiary}/>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                    </View>

                    <Button
                        title={loading ? "Sending OTP..." : "Send OTP"}
                        onPress={handleSendOTP}
                        loading={loading}
                        disabled={loading}
                        fullWidth
                        size="large"
                    />

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            disabled={loading}
                        >
                            <Text style={styles.loginLink}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({...toast, visible: false})}
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
    dropdownWrapper: {
        position: 'relative',
        zIndex: 999,
        marginTop: 16,
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        maxHeight: 280, // ✅ Increased from 240
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: {width: 0, height: 6},
        zIndex: 999,
        borderWidth: 2,
        borderColor: COLORS.primary,
        overflow: 'hidden',
        elevation: 10,
    },
    dropdownHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.dark.bgElevated,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    dropdownHeaderText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.dark.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
        gap: 12,
    },
    dropdownItemLast: {
        borderBottomWidth: 0,
    },
    dropdownIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${COLORS.primary}20`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.dark.text,
        fontWeight: '500',
        lineHeight: 20,
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