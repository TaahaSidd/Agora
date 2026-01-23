import React, {useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {Image} from 'expo-image';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

import {apiPut, completeProfile} from '../services/api';
import {uploadProfilePicture} from '../utils/upload';
import {useUserStore} from '../stores/userStore';

import ModalComponent from '../components/Modal';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';
import ToastMessage from "../components/ToastMessage";

const EditProfileScreen = ({navigation, route}) => {
    const {currentUser, fetchUser, updateUser, updateAvatar} = useUserStore();

    const user = currentUser || route.params?.user;

    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        userEmail: user?.userEmail || user?.email || '',
        mobileNumber: user?.mobileNumber || '',
        collegeName: user?.collegeName || '',
    });

    const [phoneError, setPhoneError] = useState('');

    const originalData = useMemo(() => ({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        mobileNumber: user?.mobileNumber || '',
        profileImage: user?.avatar || user?.profileImage || null,
    }), [user]);

    const [localProfileImage, setLocalProfileImage] = useState(
        user?.avatar || user?.profileImage || null
    );
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});

    // Unsaved changes state
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [showLockedFieldModal, setShowLockedFieldModal] = useState(false);
    const [lockedFieldName, setLockedFieldName] = useState('');
    const [navigationAction, setNavigationAction] = useState(null);

    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };

    const handleLockedFieldPress = (fieldName) => {
        setLockedFieldName(fieldName);
        setShowLockedFieldModal(true);
    };

    const handlePhoneChange = (text) => {
        // Only allow numbers and limit to 10 digits
        const cleaned = text.replace(/[^0-9]/g, '');
        const limited = cleaned.slice(0, 10);
        setForm({...form, mobileNumber: limited});

        // Indian mobile validation: Starts with 6-9 and must be 10 digits
        if (limited.length > 0 && limited.length < 10) {
            setPhoneError('Enter all 10 digits');
        } else if (limited.length === 10 && !/^[6-9]\d{9}$/.test(limited)) {
            setPhoneError('Enter a valid Indian mobile number');
        } else {
            setPhoneError('');
        }
    };

    const handlePickImage = async () => {
        if (uploadingImage) {
            showToast({
                type: 'info',
                title: 'Please wait',
                message: 'Image upload in progress...',
            });
            return;
        }

        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showToast({
                type: 'error',
                title: 'Permission Required',
                message: 'Please allow access to your photo library',
            });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setLocalProfileImage(uri);

            try {
                setUploadingImage(true);
                const {url} = await uploadProfilePicture(uri);
                setUploadedImageUrl(url);
                setLocalProfileImage(url);

                showToast({
                    type: 'success',
                    title: 'Image Ready',
                    message: 'Click "Save Changes" to update your profile',
                });

            } catch (error) {
                showToast({
                    type: 'error',
                    title: 'Upload Failed',
                    message: 'Failed to upload image. Please try again',
                });
                setLocalProfileImage(originalData.profileImage);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const hasChanges =
        form.firstName.trim() !== originalData.firstName ||
        form.lastName.trim() !== originalData.lastName ||
        form.mobileNumber.trim() !== originalData.mobileNumber ||
        uploadedImageUrl !== null;

    const isFormValid =
        form.firstName.trim() !== '' &&
        form.lastName.trim() !== '' &&
        (form.mobileNumber === '' || (form.mobileNumber.length === 10 && phoneError === ''));

    // Handle back navigation with unsaved changes warning
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!hasChanges) {
                return;
            }

            e.preventDefault();
            setNavigationAction(e.data.action);
            setShowUnsavedModal(true);
        });

        return unsubscribe;
    }, [navigation, hasChanges]);

    const handleDiscardChanges = () => {
        setShowUnsavedModal(false);
        if (navigationAction) {
            navigation.dispatch(navigationAction);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const profileData = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                mobileNumber: form.mobileNumber.trim(),
            };

            if (uploadedImageUrl) {
                profileData.profileImage = uploadedImageUrl;
            }

            const isPendingUser = user?.verificationStatus === 'PENDING';

            if (isPendingUser) {
                await completeProfile(null, profileData);
            } else {
                await apiPut(`/profile/update/${user.id}`, profileData);
            }

            updateUser(profileData);

            if (uploadedImageUrl) {
                updateAvatar(uploadedImageUrl);
            }

            await fetchUser();
            setSuccessModalVisible(true);

        } catch (error) {
            showToast({
                type: 'error',
                title: 'Save Failed',
                message: error.response?.data?.message || 'Failed to save changes',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content"/>

            <AppHeader title="Edit Profile" onBack={() => navigation.goBack()}/>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Picture Section */}
                <View style={styles.profileSection}>
                    <TouchableOpacity
                        style={styles.profileImageContainer}
                        activeOpacity={THEME.opacity.hover}
                        onPress={handlePickImage}
                        disabled={uploadingImage}
                    >
                        <Image
                            source={
                                localProfileImage
                                    ? {uri: localProfileImage}
                                    : require('../assets/no-image.jpg')
                            }
                            style={styles.profilePic}
                            cachePolicy="disk"
                        />
                        {uploadingImage ? (
                            <View style={styles.uploadingOverlay}>
                                <ActivityIndicator size="small" color={COLORS.white}/>
                            </View>
                        ) : (
                            <View style={styles.cameraOverlay}>
                                <Ionicons name="camera" size={22} color={COLORS.white}/>
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text style={styles.profileHint}>
                        {uploadingImage ? 'Uploading...' : 'Tap to change photo'}
                    </Text>
                </View>

                {/* Unsaved changes indicator */}
                {hasChanges && (
                    <View style={styles.unsavedBanner}>
                        <Ionicons name="alert-circle" size={18} color={COLORS.warning}/>
                        <Text style={styles.unsavedText}>You have unsaved changes</Text>
                    </View>
                )}

                {/* Personal Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="person" size={20} color={COLORS.primary}/>
                        </View>
                        <Text style={styles.cardTitle}>Personal Information</Text>
                    </View>

                    {/* Name Row */}
                    <View style={styles.nameRow}>
                        <View style={[styles.inputWrapper, styles.inputWrapperHalf]}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={form.firstName}
                                    onChangeText={(text) => setForm({...form, firstName: text})}
                                    placeholder="First name"
                                    placeholderTextColor={COLORS.light.textTertiary}
                                />
                            </View>
                        </View>

                        <View style={[styles.inputWrapper, styles.inputWrapperHalf]}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={form.lastName}
                                    onChangeText={(text) => setForm({...form, lastName: text})}
                                    placeholder="Last name"
                                    placeholderTextColor={COLORS.light.textTertiary}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Email Input - LOCKED */}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleLockedFieldPress('Email Address')}
                        style={styles.inputWrapper}
                    >
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.lockedBadge}>
                                <Ionicons name="lock-closed" size={12} color={COLORS.gray600}/>
                                <Text style={styles.lockedText}>Locked</Text>
                            </View>
                        </View>
                        <View style={[styles.inputContainer, styles.inputDisabled]}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.light.textTertiary}/>
                            <Text style={styles.lockedFieldValue}>{form.userEmail}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Phone Input - INDIAN VALIDATION */}
                    <View style={[styles.inputWrapper, styles.inputWrapperLast]}>
                        <Text style={styles.label}>Phone Number (Indian)</Text>
                        <View style={[styles.inputContainer, phoneError ? styles.inputErrorBorder : null]}>
                            <Text style={styles.countryCode}>+91</Text>
                            <TextInput
                                style={styles.input}
                                value={form.mobileNumber}
                                onChangeText={handlePhoneChange}
                                placeholder="00000 00000"
                                placeholderTextColor={COLORS.light.textTertiary}
                                keyboardType="phone-pad"
                                maxLength={10}
                            />
                        </View>
                        {phoneError ? (
                            <Text style={styles.errorText}>{phoneError}</Text>
                        ) : (
                            <Text style={styles.helperText}>Used for buyer/seller communication.</Text>
                        )}
                    </View>
                </View>

                {/* Academic Information Card - LOCKED */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, {backgroundColor: COLORS.warning + '15'}]}>
                            <Ionicons name="school" size={20} color={COLORS.warning}/>
                        </View>
                        <Text style={styles.cardTitle}>College Information</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleLockedFieldPress('College Name')}
                        style={styles.inputWrapperLast}
                    >
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>College</Text>
                            <View style={styles.lockedBadge}>
                                <Ionicons name="lock-closed" size={12} color={COLORS.gray600}/>
                                <Text style={styles.lockedText}>Locked</Text>
                            </View>
                        </View>
                        <View style={[styles.inputContainer, styles.inputDisabled]}>
                            <Ionicons name="school-outline" size={18} color={COLORS.light.textTertiary}/>
                            <Text style={styles.lockedFieldValue} numberOfLines={1}>{form.collegeName}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Save Changes"
                        onPress={handleSave}
                        variant="primary"
                        size="large"
                        disabled={!hasChanges || !isFormValid}
                        loading={loading}
                    />
                </View>

                {!hasChanges && !loading && (
                    <Text style={styles.noChangesText}>No changes detected</Text>
                )}
            </ScrollView>

            {/* Unsaved Changes Modal - Using ModalComponent */}
            <ModalComponent
                visible={showUnsavedModal}
                type="warning"
                title="Discard Changes?"
                message="You have unsaved changes. Are you sure you want to discard them and leave?"
                primaryButtonText="Discard"
                secondaryButtonText="Keep Editing"
                onPrimaryPress={handleDiscardChanges}
                onSecondaryPress={() => setShowUnsavedModal(false)}
            />

            {/* Locked Field Modal - Custom Design */}
            <Modal
                visible={showLockedFieldModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLockedFieldModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={[styles.modalIconContainer, {backgroundColor: COLORS.info + '15'}]}>
                            <Ionicons name="lock-closed" size={48} color={COLORS.info}/>
                        </View>
                        <Text style={styles.modalTitle}>Field Locked</Text>
                        <Text style={styles.modalMessage}>
                            Your {lockedFieldName} is verified and linked to your account security. It cannot be changed manually. Please contact support if you need to update this information.
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonPrimary]}
                                onPress={() => setShowLockedFieldModal(false)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.modalButtonTextPrimary}>Got it</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Success Modal */}
            <ModalComponent
                visible={successModalVisible}
                type="success"
                title="Profile Updated!"
                message="Your changes have been saved successfully."
                primaryButtonText="Done"
                onPrimaryPress={() => {
                    setSuccessModalVisible(false);
                    navigation.goBack();
                }}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast({...toast, visible: false})}
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
    scrollContainer: {
        paddingBottom: THEME.spacing['3xl'],
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: THEME.spacing['2xl'],
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: COLORS.light.card,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    profilePic: {
        width: '100%',
        height: '100%',
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    uploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileHint: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        marginTop: 12,
        fontWeight: '500',
    },
    unsavedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warningBg,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 10,
        borderWidth: 1,
        borderColor: COLORS.warning + '30',
    },
    unsavedText: {
        fontSize: 14,
        color: COLORS.warningDark,
        fontWeight: '600',
    },
    card: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.light.text,
    },
    nameRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    inputWrapper: {
        marginBottom: 16,
    },
    inputWrapperHalf: {
        flex: 1,
    },
    inputWrapperLast: {
        marginBottom: 0,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 13,
        color: COLORS.light.textSecondary,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },
    inputErrorBorder: {
        borderColor: COLORS.error,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.light.text,
        fontWeight: '500',
    },
    countryCode: {
        fontSize: 14,
        color: COLORS.light.textTertiary,
        marginRight: 8,
        fontWeight: '600',
    },
    lockedFieldValue: {
        flex: 1,
        fontSize: 14,
        color: COLORS.light.textTertiary,
        fontWeight: '500',
        marginLeft: 8,
    },
    lockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    lockedText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.light.textTertiary,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.error,
        marginTop: 4,
        fontWeight: '500',
    },
    helperText: {
        fontSize: 11,
        color: COLORS.light.textTertiary,
        marginTop: 4,
    },
    buttonContainer: {
        marginHorizontal: 16,
    },
    noChangesText: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.light.textTertiary,
        marginTop: 12,
    },

    // Locked Field Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
    },
    modalIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.info + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.light.text,
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    modalButtons: {
        width: '100%',
    },
    modalButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalButtonPrimary: {
        backgroundColor: COLORS.primary,
    },
    modalButtonTextPrimary: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '700',
    },
});

export default EditProfileScreen;