import React, {useState, useMemo} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {Image} from 'expo-image';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

import {apiPut} from '../services/api';
import {uploadProfilePicture} from '../utils/upload';
import {useUserStore} from '../stores/userStore';

import SuccessModal from '../components/Modal';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';

const EditProfileScreen = ({navigation, route}) => {
    const {currentUser, fetchUser, updateUser, updateAvatar} = useUserStore();

    const user = currentUser || route.params?.user;

    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        userEmail: user?.userEmail || user?.email || '',
        mobileNumber: user?.mobileNumber || '',
        idCardNo: user?.idCardNo || '',
        collegeName: user?.collegeName || '',
    });

    const originalData = useMemo(() => ({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        userEmail: user?.userEmail || user?.email || '',
        mobileNumber: user?.mobileNumber || '',
        idCardNo: user?.idCardNo || '',
        profileImage: user?.avatar || user?.profileImage || null,
    }), [user]);

    const [localProfileImage, setLocalProfileImage] = useState(
        user?.avatar || user?.profileImage || null
    );
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleChange = (key, value) => {
        setForm({...form, [key]: value});
    };

    const handlePickImage = async () => {
        if (uploadingImage) {
            Alert.alert('Please wait', 'Image upload in progress...');
            return;
        }

        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow access to your photo library.');
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

                console.log('📤 Uploading to Cloudinary...');
                const {url} = await uploadProfilePicture(uri);
                console.log('✅ Uploaded:', url);

                setUploadedImageUrl(url);
                setLocalProfileImage(url);

                Alert.alert('Image Ready', 'Click "Save Changes" to update your profile');

            } catch (error) {
                console.error('❌ Upload error:', error);
                Alert.alert('Error', 'Failed to upload image');
                setLocalProfileImage(originalData.profileImage);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const hasChanges =
        form.firstName.trim() !== originalData.firstName ||
        form.lastName.trim() !== originalData.lastName ||
        form.userEmail.trim() !== originalData.userEmail ||
        form.mobileNumber.trim() !== originalData.mobileNumber ||
        form.idCardNo.trim() !== originalData.idCardNo ||
        uploadedImageUrl !== null;

    const isFormValid =
        form.firstName.trim() !== '' &&
        form.lastName.trim() !== '' &&
        form.userEmail.trim() !== '';

    const isButtonDisabled = !hasChanges || !isFormValid;

    const handleSave = async () => {
        if (!hasChanges) {
            Alert.alert('No Changes', 'No changes detected');
            return;
        }

        if (!isFormValid) {
            Alert.alert('Invalid Form', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                userEmail: form.userEmail.trim(),
                mobileNumber: form.mobileNumber.trim(),
                idCardNo: form.idCardNo.trim(),
            };

            if (uploadedImageUrl) {
                payload.profileImage = uploadedImageUrl;
            }

            console.log('💾 Saving all changes:', payload);

            await apiPut(`/profile/update/${user.id}`, payload);

            console.log('✅ All changes saved to backend');

            console.log('🔄 Updating Zustand store...');

            updateUser({
                firstName: payload.firstName,
                lastName: payload.lastName,
                userEmail: payload.userEmail,
                email: payload.userEmail,
                mobileNumber: payload.mobileNumber,
                idCardNo: payload.idCardNo,
            });

            if (uploadedImageUrl) {
                updateAvatar(uploadedImageUrl);
            }

            console.log('✅ Zustand store updated');

            await fetchUser();

            setModalVisible(true);
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Something went wrong while updating your profile.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary}/>
                <Text style={styles.loadingText}>Updating profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content"/>

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

                {/* Unsaved Changes Banner */}
                {hasChanges && !uploadingImage && (
                    <View style={styles.changesBanner}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.warning}/>
                        <Text style={styles.changesBannerText}>You have unsaved changes</Text>
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

                    {/* Name Row (First & Last) */}
                    <View style={styles.nameRow}>
                        <View style={[styles.inputWrapper, styles.inputWrapperHalf]}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={18} color={COLORS.dark.textTertiary}/>
                                <TextInput
                                    style={styles.input}
                                    value={form.firstName}
                                    onChangeText={(text) => handleChange('firstName', text)}
                                    placeholder="First name"
                                    placeholderTextColor={COLORS.dark.textTertiary}
                                />
                            </View>
                        </View>

                        <View style={[styles.inputWrapper, styles.inputWrapperHalf]}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={18} color={COLORS.dark.textTertiary}/>
                                <TextInput
                                    style={styles.input}
                                    value={form.lastName}
                                    onChangeText={(text) => handleChange('lastName', text)}
                                    placeholder="Last name"
                                    placeholderTextColor={COLORS.dark.textTertiary}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <TextInput
                                style={styles.input}
                                value={form.userEmail}
                                onChangeText={(text) => handleChange('userEmail', text)}
                                placeholder="email@example.com"
                                placeholderTextColor={COLORS.dark.textTertiary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Phone Input */}
                    <View style={[styles.inputWrapper, styles.inputWrapperLast]}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <TextInput
                                style={styles.input}
                                value={form.mobileNumber}
                                onChangeText={(text) => handleChange('mobileNumber', text)}
                                placeholder="+91 00000 00000"
                                placeholderTextColor={COLORS.dark.textTertiary}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Academic Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconCircle, {backgroundColor: COLORS.warning + '15'}]}>
                            <Ionicons name="school" size={20} color={COLORS.warning}/>
                        </View>
                        <Text style={styles.cardTitle}>Academic Information</Text>
                    </View>

                    {/* Student ID Input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.label}>Student ID</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <TextInput
                                style={styles.input}
                                value={form.idCardNo}
                                onChangeText={(text) => handleChange('idCardNo', text)}
                                placeholder="Enter your student ID"
                                placeholderTextColor={COLORS.dark.textTertiary}
                            />
                        </View>
                    </View>

                    {/* College Input (Disabled) */}
                    <View style={[styles.inputWrapper, styles.inputWrapperLast]}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>College</Text>
                            <View style={styles.lockedBadge}>
                                <Ionicons name="lock-closed" size={12} color={COLORS.gray500}/>
                                <Text style={styles.lockedText}>Locked</Text>
                            </View>
                        </View>
                        <View style={[styles.inputContainer, styles.inputDisabled]}>
                            <Ionicons name="school-outline" size={18} color={COLORS.dark.textTertiary}/>
                            <TextInput
                                style={styles.input}
                                value={form.collegeName}
                                editable={false}
                                placeholder="College"
                                placeholderTextColor={COLORS.dark.textTertiary}
                            />
                        </View>
                        <Text style={styles.helperText}>
                            College cannot be changed after registration
                        </Text>
                    </View>
                </View>

                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={20} color={COLORS.primary}/>
                    <Text style={styles.infoBannerText}>
                        Make sure your information is accurate for verification purposes
                    </Text>
                </View>

                {/* Save Button */}
                <View style={{ marginHorizontal: THEME.spacing.md }}>
                    <Button
                        title="Save Changes"
                        onPress={handleSave}
                        variant="primary"
                        fullWidth
                        icon={hasChanges ? 'checkmark-circle' : 'alert-circle-outline'}
                        size="large"
                        disabled={isButtonDisabled}
                    />
                </View>

                {/* Helper text below button */}
                {!hasChanges && (
                    <Text style={styles.noChangesText}>Make changes to update your profile</Text>
                )}
            </ScrollView>

            {/* Success Modal */}
            <SuccessModal
                visible={modalVisible}
                title="Profile Updated!"
                message="Your profile has been updated successfully."
                onClose={() => {
                    setModalVisible(false);
                    navigation.goBack();
                }}
                iconSize={50}
                iconColor={COLORS.success}
                iconBgColor={COLORS.successBg}
                buttonText="Done"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    scrollContainer: {
        paddingBottom: THEME.spacing['3xl'],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
    },
    loadingText: {
        marginTop: THEME.spacing.md,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },

    // Profile Section
    profileSection: {
        alignItems: 'center',
        paddingVertical: THEME.spacing['2xl'],
        paddingHorizontal: THEME.spacing.md,
    },
    profileImageContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: COLORS.dark.card,
        borderWidth: 3,
        borderColor: COLORS.dark.border,
    },
    profilePic: {
        width: '100%',
        height: '100%',
    },
    cameraOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: THEME.spacing[2],
    },
    uploadingOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: THEME.spacing[2],
    },
    profileHint: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
        marginTop: THEME.spacing.md,
    },

    // Changes Banner
    changesBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warning + '15',
        marginHorizontal: THEME.spacing.md,
        padding: THEME.spacing.sm + 2,
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing.md,
        gap: THEME.spacing[2],
        borderWidth: 1,
        borderColor: COLORS.warning + '30',
    },
    changesBannerText: {
        flex: 1,
        fontSize: THEME.fontSize.sm,
        color: COLORS.warning,
        fontWeight: THEME.fontWeight.semibold,
    },

    // Card Styles (Matching UserProfileScreen)
    card: {
        backgroundColor: COLORS.dark.card,
        marginHorizontal: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
        gap: THEME.spacing[3],
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
    },

    // Input Styles
    nameRow: {
        flexDirection: 'row',
        gap: THEME.spacing[3],
        marginBottom: THEME.spacing[3],
        paddingBottom: THEME.spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    inputWrapper: {
        marginBottom: THEME.spacing[3],
        paddingBottom: THEME.spacing[3],
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    inputWrapperHalf: {
        flex: 1,
        marginBottom: 0,
        paddingBottom: 0,
        borderBottomWidth: 0,
    },
    inputWrapperLast: {
        borderBottomWidth: 0,
        marginBottom: 0,
        paddingBottom: 0,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing[2],
    },
    label: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
        marginBottom: THEME.spacing[2],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
        borderRadius: THEME.borderRadius.md,
        paddingHorizontal: THEME.spacing.sm + 2,
        gap: THEME.spacing[2],
        minHeight: 44,
    },
    inputDisabled: {
        opacity: 0.6,
    },
    input: {
        flex: 1,
        paddingVertical: THEME.spacing.sm,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.text,
        fontWeight: THEME.fontWeight.semibold,
    },
    lockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
        paddingHorizontal: THEME.spacing[2],
        paddingVertical: THEME.spacing[1],
        borderRadius: THEME.borderRadius.sm,
        gap: THEME.spacing[1],
    },
    lockedText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textTertiary,
    },
    helperText: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        marginTop: THEME.spacing[2],
        fontWeight: THEME.fontWeight.medium,
    },

    // Info Banner
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary + '10',
        marginHorizontal: THEME.spacing.md,
        padding: THEME.spacing.sm + 2,
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing.md,
        gap: THEME.spacing[2],
        borderWidth: 1,
        borderColor: COLORS.primary + '20',
        alignItems: 'flex-start',
    },
    infoBannerText: {
        flex: 1,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        lineHeight: THEME.fontSize.sm * 1.4,
        fontWeight: THEME.fontWeight.medium,
    },

    // No Changes Text
    noChangesText: {
        textAlign: 'center',
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        marginTop: THEME.spacing[2],
        marginHorizontal: THEME.spacing.md,
        fontWeight: THEME.fontWeight.medium,
    },
});

export default EditProfileScreen;