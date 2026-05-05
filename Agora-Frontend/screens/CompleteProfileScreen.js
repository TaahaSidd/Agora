import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { COLORS } from '../utils/colors';
import { useUserStore } from '../stores/userStore';
import { completeProfile, searchColleges } from '../services/api';

import ToastMessage from '../components/ToastMessage';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PhoneInputField from '../components/PhoneInputField';

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
            } catch {
                setToast({ visible: true, type: 'error', title: 'Error', message: 'Failed to search colleges.' });
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
            const result = await completeProfile(token, {
                userEmail: currentUser.userEmail,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                phoneNumber: phoneNumber.trim(),
                college: selectedCollege.collegeName,
                expoPushToken: null,
            });

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

                setToast({ visible: true, type: 'success', title: 'Welcome!', message: 'Your profile is complete.' });
                setTimeout(() => navigation.replace('MainLayout'), 1500);
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
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Hero */}
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Complete Your Profile</Text>
                        <Text style={styles.heroSubtitle}>
                            Join your campus community — just a few more details to get started.
                        </Text>
                    </View>

                    {/* Verified email badge */}
                    {currentUser?.userEmail && (
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={15} color={COLORS.success} />
                            <Text style={styles.verifiedText}>{currentUser.userEmail}</Text>
                        </View>
                    )}

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.nameRow}>
                            <View style={{ flex: 1 }}>
                                <InputField
                                    label="First Name *"
                                    placeholder="e.g. Rahul"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    leftIcon="person-outline"
                                />
                            </View>
                            <View style={{ width: 10 }} />
                            <View style={{ flex: 1 }}>
                                <InputField
                                    label="Last Name *"
                                    placeholder="e.g. Sharma"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    leftIcon="person-outline"
                                />
                            </View>
                        </View>

                        {/* College search */}
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
                                rightIcon={selectedCollege ? 'close-circle' : undefined}
                                onRightIconPress={() => {
                                    setSelectedCollege(null);
                                    setCollegeQuery('');
                                }}
                            />
                            <Text style={styles.helperText}>
                                Type at least 2 letters to search
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
                                        nestedScrollEnabled
                                        showsVerticalScrollIndicator={false}
                                    >
                                        {collegeResults.map((item, index) => (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={[
                                                    styles.dropdownItem,
                                                    index === collegeResults.length - 1 && styles.dropdownItemLast,
                                                ]}
                                                onPress={() => handleCollegeSelect(item)}
                                                activeOpacity={0.6}
                                            >
                                                <View style={styles.dropdownIconWrapper}>
                                                    <Ionicons name="school-outline" size={16} color={COLORS.primary} />
                                                </View>
                                                <Text style={styles.dropdownItemText} numberOfLines={2}>
                                                    {item.collegeName}
                                                </Text>
                                                <Ionicons name="chevron-forward" size={14} color={COLORS.gray300} />
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
                            error={phoneNumber.length > 0 && phoneNumber.length < 10 ? 'Enter 10 digits' : null}
                        />
                    </View>

                    {/* Footer */}
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
                            fullWidth
                        />
                        <View style={styles.securityNote}>
                            <Ionicons name="shield-checkmark-outline" size={13} color={COLORS.gray400} />
                            <Text style={styles.securityNoteText}>
                                Your real name helps verified students trust you.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({ ...toast, visible: false })}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    container: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },

    // Hero
    hero: {
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 19,
    },

    // Verified badge
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: `${COLORS.success}10`,
        borderWidth: 1,
        borderColor: `${COLORS.success}25`,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        marginBottom: 24,
    },
    verifiedText: {
        fontSize: 13,
        color: COLORS.success,
        fontWeight: '500',
        flex: 1,
    },

    // Form
    form: {
        gap: 4,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    helperText: {
        fontSize: 11,
        color: COLORS.gray400,
        marginTop: -8,
        marginBottom: 12,
        marginLeft: 2,
    },

    // College dropdown
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
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        overflow: 'hidden',
        zIndex: 999,
        elevation: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
        }),
    },
    dropdownHeader: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        backgroundColor: COLORS.gray50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    dropdownHeaderText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
        gap: 10,
    },
    dropdownItemLast: {
        borderBottomWidth: 0,
    },
    dropdownIconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 9,
        backgroundColor: `${COLORS.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.light.text,
        fontWeight: '500',
        lineHeight: 18,
    },

    // Footer
    footer: {
        marginTop: 32,
        gap: 14,
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    securityNoteText: {
        fontSize: 11,
        color: COLORS.gray400,
    },
});

export default CompleteProfileScreen;