import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';

import {THEME} from '../utils/theme';
import {COLORS} from "../utils/colors";
import {useUserStore} from "../stores/userStore";
import {completeProfile} from '../services/api';

import ToastMessage from "../components/ToastMessage";
import InputField from '../components/InputField';
import Button from '../components/Button';

const CompleteProfileScreen = ({navigation, route}) => {
    const {collegeName} = route.params || {collegeName: "your college"};
    //console.log("COLLEGE _ NAME = ", collegeName);

    //const {currentUser} = useUserStore();
    //console.log("Current user in CompleteProfile screen:", currentUser);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});


    const isFormValid = firstName.trim().length >= 2
        && lastName.trim().length >= 1 &&
        email.trim().length >= 5;

    const handleContinue = async () => {
        if (!isFormValid) return;

        setLoading(true);
        try {
            const jwt = await SecureStore.getItemAsync('accessToken');
            const {currentUser} = useUserStore.getState();

            const profileData = {
                firebaseToken: null,
                phoneNumber: currentUser.mobileNumber,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                userEmail: email.trim(),
                college: currentUser.collegeName,
                expoPushToken: null
            };

            console.log('📤 Sending:', profileData);
            const result = await completeProfile(jwt, profileData);

            if (result) {
                await SecureStore.setItemAsync('accessToken', result.jwt);
                await useUserStore.getState().fetchUser();
                navigation.replace('MainLayout');
            }
        } catch (error) {
            console.error("Profile Error:", error);
            setToast({
                visible: true,
                type: 'error',
                title: 'Setup Failed',
                message: error.message || 'Something went wrong. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name="account-group-outline"
                                size={THEME.iconSize['4xl']}
                                color={COLORS.primary}
                            />
                        </View>

                        <Text style={styles.title}>Represent your campus</Text>

                        <Text style={styles.subtitle}>
                            You’re joining as a student from{' '}
                            <Text style={{color: COLORS.primary, fontWeight: '700'}}>
                                {collegeName}
                            </Text>
                            . Using your real name helps build a trusted community across all campuses.
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.form}>
                        <InputField
                            label="First Name"
                            placeholder="e.g. Rahul"
                            value={firstName}
                            onChangeText={setFirstName}
                            leftIcon="account-outline"
                            autoFocus={true} // UX Pro-tip: Open keyboard immediately
                        />

                        <InputField
                            label="Last Name"
                            placeholder="e.g. Sharma"
                            value={lastName}
                            onChangeText={setLastName}
                            leftIcon="account-outline"
                        />
                    </View>

                    <InputField
                        label="Email Address"
                        placeholder="e.g. rahul.sharma@gmail.com"
                        value={email}
                        onChangeText={setEmail}
                        leftIcon="email-outline"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {/* Action Section */}
                    <View style={styles.footer}>
                        <Button
                            title="Finish Setup"
                            onPress={handleContinue}
                            variant="primary"
                            size="large"
                            icon="arrow-forward"
                            iconPosition="right"
                            loading={loading}
                            disabled={!isFormValid || loading}
                            fullWidth={true}
                        />


                        <View style={styles.securityNoteContainer}>
                            <MaterialCommunityIcons
                                name="shield-check-outline"
                                size={14}
                                color={COLORS.gray500}
                            />
                            <Text style={styles.securityNote}>
                                Your real name helps verified students trust you.
                            </Text>
                        </View>
                    </View>

                    {toast.visible && (
                        <ToastMessage
                            type={toast.type}
                            title={toast.title}
                            message={toast.message}
                            onHide={() => setToast({...toast, visible: false})}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: THEME.spacing.screenPadding,
        paddingTop: THEME.spacing['4xl'],
        paddingBottom: THEME.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: THEME.spacing['4xl'],
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    title: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        paddingHorizontal: THEME.spacing.md,
        lineHeight: THEME.lineHeight.normal * THEME.fontSize.base,
    },
    form: {
        marginTop: THEME.spacing.md,
    },
    footer: {
        marginTop: THEME.spacing['4xl'],
        gap: THEME.spacing.md,
    },
    securityNoteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: THEME.spacing.sm,
        gap: 6,
    },
    securityNote: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.gray500,
        textAlign: 'center',
    }
});

export default CompleteProfileScreen;