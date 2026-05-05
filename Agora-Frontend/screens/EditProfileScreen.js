import React, {useEffect, useMemo, useState} from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
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
import ToastMessage from '../components/ToastMessage';

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
    const [localProfileImage, setLocalProfileImage] = useState(user?.avatar || user?.profileImage || null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [showLockedFieldModal, setShowLockedFieldModal] = useState(false);
    const [lockedFieldName, setLockedFieldName] = useState('');
    const [navigationAction, setNavigationAction] = useState(null);

    const originalData = useMemo(() => ({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        mobileNumber: user?.mobileNumber || '',
        profileImage: user?.avatar || user?.profileImage || null,
    }), [user]);

    const showToast = ({type, title, message}) => setToast({visible: true, type, title, message});

    const handleLockedFieldPress = (fieldName) => {
        setLockedFieldName(fieldName);
        setShowLockedFieldModal(true);
    };

    const handlePhoneChange = (text) => {
        const cleaned = text.replace(/[^0-9]/g, '').slice(0, 10);
        setForm({...form, mobileNumber: cleaned});
        if (cleaned.length > 0 && cleaned.length < 10) {
            setPhoneError('Enter all 10 digits');
        } else if (cleaned.length === 10 && !/^[6-9]\d{9}$/.test(cleaned)) {
            setPhoneError('Enter a valid Indian mobile number');
        } else {
            setPhoneError('');
        }
    };

    const handlePickImage = async () => {
        if (uploadingImage) return;
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            showToast({type: 'error', title: 'Permission Required', message: 'Please allow access to your photo library'});
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
                showToast({type: 'success', title: 'Image Ready', message: 'Click "Save Changes" to update'});
            } catch {
                showToast({type: 'error', title: 'Upload Failed', message: 'Failed to upload image'});
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

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!hasChanges) return;
            e.preventDefault();
            setNavigationAction(e.data.action);
            setShowUnsavedModal(true);
        });
        return unsubscribe;
    }, [navigation, hasChanges]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const profileData = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                mobileNumber: form.mobileNumber.trim(),
            };
            if (uploadedImageUrl) profileData.profileImage = uploadedImageUrl;

            if (user?.verificationStatus === 'PENDING') {
                await completeProfile(null, profileData);
            } else {
                await apiPut(`/profile/update/${user.id}`, profileData);
            }

            setUploadedImageUrl(null);
            updateUser(profileData);
            if (profileData.profileImage) updateAvatar(profileData.profileImage);
            await fetchUser();
            setSuccessModalVisible(true);
        } catch (error) {
            showToast({type: 'error', title: 'Save Failed', message: error.response?.data?.message || 'Failed to save'});
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
                {/* Avatar */}
                <View style={styles.profileSection}>
                    <TouchableOpacity
                        style={styles.avatarWrapper}
                        activeOpacity={0.7}
                        onPress={handlePickImage}
                        disabled={uploadingImage}
                    >
                        <Image
                            source={localProfileImage ? {uri: localProfileImage} : require('../assets/no-image.jpg')}
                            style={styles.avatar}
                            cachePolicy="disk"
                        />
                        <View style={uploadingImage ? styles.uploadingOverlay : styles.cameraOverlay}>
                            {uploadingImage
                                ? <ActivityIndicator size="small" color={COLORS.white}/>
                                : <Ionicons name="camera" size={16} color={COLORS.white}/>
                            }
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarHint}>
                        {uploadingImage ? 'Uploading...' : 'Tap to change photo'}
                    </Text>
                </View>

                {/* Unsaved banner */}
                {hasChanges && (
                    <View style={styles.unsavedBanner}>
                        <Ionicons name="alert-circle" size={15} color={COLORS.warning}/>
                        <Text style={styles.unsavedText}>You have unsaved changes</Text>
                    </View>
                )}

                {/* Personal Info */}
                <FormCard
                    iconName="person"
                    iconColor={COLORS.primary}
                    title="Personal Information"
                >
                    <View style={styles.nameRow}>
                        <View style={styles.halfField}>
                            <FieldLabel>First Name</FieldLabel>
                            <TextInput
                                style={styles.input}
                                value={form.firstName}
                                onChangeText={(text) => setForm({...form, firstName: text})}
                                placeholder="First name"
                                placeholderTextColor={COLORS.gray300}
                            />
                        </View>
                        <View style={styles.halfField}>
                            <FieldLabel>Last Name</FieldLabel>
                            <TextInput
                                style={styles.input}
                                value={form.lastName}
                                onChangeText={(text) => setForm({...form, lastName: text})}
                                placeholder="Last name"
                                placeholderTextColor={COLORS.gray300}
                            />
                        </View>
                    </View>

                    <FieldLabel>Email Address</FieldLabel>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => handleLockedFieldPress('Email Address')}
                        style={[styles.input, styles.lockedInput]}
                    >
                        <Ionicons name="mail-outline" size={16} color={COLORS.gray300}/>
                        <Text style={styles.lockedValue} numberOfLines={1}>{form.userEmail}</Text>
                        <Ionicons name="lock-closed" size={13} color={COLORS.gray300}/>
                    </TouchableOpacity>

                    <View style={styles.fieldGap}/>
                    <FieldLabel>Phone Number</FieldLabel>
                    <View style={[styles.input, phoneError && styles.inputError]}>
                        <Text style={styles.countryCode}>+91</Text>
                        <TextInput
                            style={styles.phoneInput}
                            value={form.mobileNumber}
                            onChangeText={handlePhoneChange}
                            placeholder="00000 00000"
                            placeholderTextColor={COLORS.gray300}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>
                    {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
                </FormCard>

                {/* College Info */}
                <FormCard
                    iconName="school"
                    iconColor={COLORS.warning}
                    title="College Information"
                >
                    <FieldLabel>College</FieldLabel>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => handleLockedFieldPress('College Name')}
                        style={[styles.input, styles.lockedInput]}
                    >
                        <Ionicons name="school-outline" size={16} color={COLORS.gray300}/>
                        <Text style={styles.lockedValue} numberOfLines={1}>{form.collegeName}</Text>
                        <Ionicons name="lock-closed" size={13} color={COLORS.gray300}/>
                    </TouchableOpacity>
                    <Text style={styles.helperText}>Verified college status cannot be changed.</Text>
                </FormCard>

                {/* Save */}
                <View style={styles.saveContainer}>
                    <Button
                        title="Save Changes"
                        onPress={handleSave}
                        disabled={!hasChanges || !isFormValid}
                        loading={loading}
                        variant="primary"
                    />
                    {!hasChanges && !loading && (
                        <Text style={styles.noChangesText}>No changes detected</Text>
                    )}
                </View>
            </ScrollView>

            {/* Locked field modal */}
            <Modal visible={showLockedFieldModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalIconWrapper}>
                            <Ionicons name="lock-closed" size={22} color={COLORS.info}/>
                        </View>
                        <Text style={styles.modalTitle}>Field Locked</Text>
                        <Text style={styles.modalMessage}>
                            Your {lockedFieldName} is verified and cannot be edited. Contact support for updates.
                        </Text>
                        <TouchableOpacity
                            style={styles.modalBtn}
                            activeOpacity={0.7}
                            onPress={() => setShowLockedFieldModal(false)}
                        >
                            <Text style={styles.modalBtnText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ModalComponent
                visible={showUnsavedModal}
                type="warning"
                title="Discard Changes?"
                message="You have unsaved changes. Are you sure you want to leave?"
                primaryButtonText="Discard"
                onPrimaryPress={() => {
                    setShowUnsavedModal(false);
                    if (navigationAction) navigation.dispatch(navigationAction);
                }}
                onSecondaryPress={() => setShowUnsavedModal(false)}
            />

            <ModalComponent
                visible={successModalVisible}
                type="success"
                title="Profile Updated!"
                message="Changes saved successfully."
                onPrimaryPress={() => {
                    setSuccessModalVisible(false);
                    navigation.goBack();
                }}
            />

            {toast.visible && (
                <ToastMessage
                    {...toast}
                    onHide={() => setToast({...toast, visible: false})}
                />
            )}
        </SafeAreaView>
    );
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const FormCard = ({iconName, iconColor, title, children}) => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            <View style={[styles.iconWrapper, {backgroundColor: `${iconColor}12`}]}>
                <Ionicons name={iconName} size={18} color={iconColor}/>
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        {children}
    </View>
);

const FieldLabel = ({children}) => (
    <Text style={styles.fieldLabel}>{children}</Text>
);

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    scrollContainer: {
        paddingBottom: 40,
    },

    // Avatar section
    profileSection: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    avatarWrapper: {
        width: 84,
        height: 84,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: {elevation: 2},
        }),
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 26,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarHint: {
        fontSize: 12,
        color: COLORS.gray400,
        marginTop: 10,
        fontWeight: '400',
    },

    // Unsaved banner
    unsavedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${COLORS.warning}10`,
        marginHorizontal: 16,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: `${COLORS.warning}20`,
    },
    unsavedText: {
        fontSize: 12,
        color: COLORS.warning,
        fontWeight: '500',
    },

    // Cards
    card: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {elevation: 1},
        }),
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    iconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.2,
    },

    // Fields
    nameRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 14,
    },
    halfField: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 12,
        color: COLORS.gray400,
        fontWeight: '500',
        marginBottom: 6,
    },
    fieldGap: {
        height: 12,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray50,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 46,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        fontSize: 14,
        color: COLORS.light.text,
        fontWeight: '500',
    },
    lockedInput: {
        gap: 8,
        backgroundColor: COLORS.gray100,
    },
    lockedValue: {
        flex: 1,
        fontSize: 13,
        color: COLORS.gray400,
        fontWeight: '400',
    },
    inputError: {
        borderColor: COLORS.error,
    },
    countryCode: {
        fontSize: 14,
        color: COLORS.light.text,
        fontWeight: '500',
        marginRight: 6,
    },
    phoneInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.light.text,
        fontWeight: '500',
    },
    errorText: {
        fontSize: 11,
        color: COLORS.error,
        marginTop: 5,
        fontWeight: '400',
    },
    helperText: {
        fontSize: 11,
        color: COLORS.gray400,
        marginTop: 8,
    },

    // Save button
    saveContainer: {
        marginHorizontal: 16,
        marginTop: 8,
    },
    noChangesText: {
        textAlign: 'center',
        fontSize: 12,
        color: COLORS.gray400,
        marginTop: 10,
    },

    // Locked field modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    modalCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 8},
                shadowOpacity: 0.12,
                shadowRadius: 24,
            },
            android: {elevation: 8},
        }),
    },
    modalIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: `${COLORS.info}12`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.light.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    modalMessage: {
        fontSize: 13,
        color: COLORS.gray400,
        textAlign: 'center',
        lineHeight: 19,
        marginBottom: 20,
    },
    modalBtn: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalBtnText: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: '600',
    },
});

export default EditProfileScreen;