import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { THEME } from '../utils/theme';
import { COLORS } from "../utils/colors";
import { useUserStore } from "../stores/userStore";
import { completeProfile, searchColleges } from '../services/api';

import ToastMessage from "../components/ToastMessage";
import InputField from '../components/InputField';
import Button from '../components/Button';
import PhoneInputField from "../components/PhoneInputField";

const CompleteProfileScreen = ({ navigation }) => {
    const { currentUser } = useUserStore();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: 'success', title: '', message: '' });

    const [selectedCollege, setSelectedCollege] = useState(null);
    const [collegeQuery, setCollegeQuery] = useState('');
    const [collegeResults, setCollegeResults] = useState([]);
    const [loadingColleges, setLoadingColleges] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFirstName(currentUser.firstName || '');
            setLastName(currentUser.lastName || '');
            setPhoneNumber(currentUser.mobileNumber || '');
        }
    }, [currentUser]);

    useEffect(() => {
        if (collegeQuery.trim().length < 2 || selectedCollege) {
            setCollegeResults([]);
            return;
        }
        const debounce = setTimeout(async () => {
            setLoadingColleges(true);
            try {
                const data = await searchColleges(collegeQuery.trim());
                setCollegeResults(data);
            } catch (error) {
                setToast({ visible: true, type: 'error', title: 'Error', message: 'Failed to search colleges' });
            } finally {
                setLoadingColleges(false);
            }
        }, 150);

        return () => clearTimeout(debounce);
    }, [collegeQuery]);

    const handleCollegeSelect = (college) => {
        setSelectedCollege(college);
        setCollegeQuery(college.collegeName);
    };

    const isFormValid =
        firstName.trim().length >= 2 &&
        lastName.trim().length >= 1 &&
        phoneNumber.trim().length >= 10 &&
        selectedCollege !== null;

    const handleContinue = async () => {
        if (!isFormValid) return;

        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('accessToken');

            const profileData = {
                userEmail: currentUser.userEmail,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(),
                college: selectedCollege.collegeName,
                expoPushToken: null
            };

            const result = await completeProfile(token, profileData);

            if (result) {
                if (result.jwt) await SecureStore.setItemAsync('accessToken', result.jwt);
                if (result.refreshToken) await SecureStore.setItemAsync('refreshToken', result.refreshToken);

                const updatedUser = {
                    ...currentUser,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    name: `${result.firstName} ${result.lastName}`,
                    mobileNumber: result.mobileNumber,
                    collegeId: result.collegeId,
                    verificationStatus: result.verificationStatus,
                };

                await SecureStore.setItemAsync('currentUser', JSON.stringify(updatedUser));
                useUserStore.setState({ currentUser: updatedUser, isGuest: false });

                setToast({
                    visible: true,
                    type: 'success',
                    title: 'Welcome!',
                    message: 'Your profile is complete',
                });

                setTimeout(() => {
                    navigation.replace('MainLayout');
                }, 1500);
            }
        } catch (error) {
            setToast({
                visible: true,
                type: 'error',
                title: 'Setup Failed',
                message: error.response?.data?.message || error.message || 'Something went wrong.',
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
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name="account-check-outline"
                                size={THEME.iconSize['4xl']}
                                color={COLORS.primary}
                            />
                        </View>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Join your campus community. Just a few more details to get started.
                        </Text>
                    </View>

                    {currentUser?.userEmail && (
                        <View style={styles.verifiedBadge}>
                            <MaterialCommunityIcons name="email-check" size={18} color="#22C55E" />
                            <Text style={styles.verifiedText}>{currentUser.userEmail}</Text>
                        </View>
                    )}

                    <View style={styles.form}>
                        <View style={styles.nameRow}>
                            <View style={{ flex: 1 }}>
                                <InputField
                                    label="First Name *"
                                    placeholder="e.g. Rahul"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    leftIcon="account-outline"
                                />
                            </View>
                            <View style={{ width: 12 }} />
                            <View style={{ flex: 1 }}>
                                <InputField
                                    label="Last Name *"
                                    placeholder="e.g. Sharma"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    leftIcon="account-outline"
                                />
                            </View>
                        </View>

                        <View style={styles.dropdownWrapper}>
                            <InputField
                                label="College *"
                                placeholder="Type to search your college..."
                                value={selectedCollege ? selectedCollege.collegeName : collegeQuery || undefined}
                                onChangeText={(text) => {
                                    setCollegeQuery(text);
                                    if (selectedCollege) setSelectedCollege(null);
                                }}
                                leftIcon="school-outline"
                                editable={!selectedCollege}
                                rightIcon={selectedCollege ? "close-circle" : undefined}
                                onRightIconPress={() => {
                                    setSelectedCollege(null);
                                    setCollegeQuery('');
                                }}
                            />
                            <Text style={{ fontSize: 11, color: COLORS.light.textTertiary, marginTop: -10, marginBottom: 16, marginLeft: 4 }}>
                                Start typing at least 2 letters to search your college
                            </Text>

                            {collegeQuery.length > 0 && collegeResults.length > 0 && !selectedCollege && (
                                <View style={styles.dropdown}>
                                    <View style={styles.dropdownHeader}>
                                        <Text style={styles.dropdownHeaderText}>
                                            {collegeResults.length} {collegeResults.length === 1 ? 'college' : 'colleges'} found
                                        </Text>
                                    </View>
                                    <ScrollView
                                        style={{ maxHeight: 220 }}
                                        nestedScrollEnabled={true}
                                        showsVerticalScrollIndicator={true}
                                    >
                                        {collegeResults.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[
                                                    styles.dropdownItem,
                                                    index === collegeResults.length - 1 && styles.dropdownItemLast
                                                ]}
                                                onPress={() => handleCollegeSelect(item)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.dropdownIconContainer}>
                                                    <Ionicons name="school" size={18} color={COLORS.primary} />
                                                </View>
                                                <Text style={styles.dropdownText} numberOfLines={2}>
                                                    {item.collegeName}
                                                </Text>
                                                <Ionicons name="chevron-forward" size={16}
                                                    color={COLORS.light.textTertiary} />
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>

                        <PhoneInputField
                            label="Mobile Number *"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="98765 43210"
                            error={phoneNumber.length > 0 && phoneNumber.length < 10 ? "Enter 10 digits" : null}
                        />
                    </View>

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
                                color={COLORS.gray600}
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
                            onHide={() => setToast({ ...toast, visible: false })}
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
        backgroundColor: COLORS.light.bg,
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
        marginBottom: THEME.spacing.lg,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    title: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.light.text,
        textAlign: 'center',
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.fontSize.base,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        paddingHorizontal: THEME.spacing.md,
        lineHeight: THEME.lineHeight.normal * THEME.fontSize.base,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0FDF4', // Light green bg
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: THEME.spacing.xl,
        borderWidth: 1,
        borderColor: '#DCFCE7',
        gap: 8,
    },
    verifiedText: {
        fontSize: THEME.fontSize.sm,
        color: '#166534', // Dark green text
        fontWeight: THEME.fontWeight.medium,
    },
    form: {},
    nameRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
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
        color: COLORS.gray600,
        textAlign: 'center',
    },
    dropdownWrapper: {
        position: 'relative',
        zIndex: 999,
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        maxHeight: 280,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        zIndex: 999,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
        elevation: 10,
    },
    dropdownHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownHeaderText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.light.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    dropdownItemLast: {
        borderBottomWidth: 0,
    },
    dropdownIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${COLORS.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.light.text,
        fontWeight: '500',
        lineHeight: 20,
    },
});

export default CompleteProfileScreen;