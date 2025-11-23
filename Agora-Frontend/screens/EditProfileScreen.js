// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     SafeAreaView,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     ScrollView,
//     StatusBar,
//     ActivityIndicator,
// } from 'react-native';
// import { Image } from 'expo-image';
// import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { COLORS } from '../utils/colors';
// import { THEME } from '../utils/theme';

// import { apiPut } from '../services/api';

// import SuccessModal from '../components/Modal';
// import Button from '../components/Button';
// import AppHeader from '../components/AppHeader';

// const EditProfileScreen = ({ navigation, route }) => {
//     const { user, profileImage } = route.params || {};

//     const [form, setForm] = useState({
//         firstName: user?.firstName || '',
//         lastName: user?.lastName || '',
//         userEmail: user?.userEmail || '',
//         mobileNumber: user?.mobileNumber || '',
//         idCardNo: user?.idCardNo || '',
//         collegeName: user?.college?.collegeName || '',
//     });

//     // Keep original data to compare
//     const originalData = {
//         firstName: user?.firstName || '',
//         lastName: user?.lastName || '',
//         userEmail: user?.userEmail || '',
//         mobileNumber: user?.mobileNumber || '',
//         idCardNo: user?.idCardNo || '',
//         profileImage: profileImage || null,
//     };

//     const [localProfileImage, setLocalProfileImage] = useState(profileImage);
//     const [loading, setLoading] = useState(false);
//     const [modalVisible, setModalVisible] = useState(false);

//     const handleChange = (key, value) => {
//         setForm({ ...form, [key]: value });
//     };

//     const handlePickImage = async () => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             alert('Permission to access gallery is required!');
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [1, 1],
//             quality: 0.8,
//         });

//         if (!result.canceled) {
//             const uri = result.assets[0].uri;
//             setLocalProfileImage(uri);
//             // uploadProfileImage(uri); // Uncomment when you have this function
//         }
//     };

//     const hasChanges =
//         form.firstName.trim() !== originalData.firstName ||
//         form.lastName.trim() !== originalData.lastName ||
//         form.userEmail.trim() !== originalData.userEmail ||
//         form.mobileNumber.trim() !== originalData.mobileNumber ||
//         form.idCardNo.trim() !== originalData.idCardNo ||
//         localProfileImage !== originalData.profileImage;

//     // Check if required fields are filled
//     const isFormValid =
//         form.firstName.trim() !== '' &&
//         form.lastName.trim() !== '' &&
//         form.userEmail.trim() !== '';

//     // Button should be disabled if no changes OR form is invalid
//     const isButtonDisabled = !hasChanges || !isFormValid;

//     const handleSave = async () => {
//         // Double check before making API call
//         if (!hasChanges) {
//             alert('No changes detected');
//             return;
//         }

//         if (!isFormValid) {
//             alert('Please fill in all required fields');
//             return;
//         }

//         try {
//             setLoading(true);

//             const payload = {
//                 firstName: form.firstName.trim(),
//                 lastName: form.lastName.trim(),
//                 userEmail: form.userEmail.trim(),
//                 mobileNumber: form.mobileNumber.trim(),
//                 idCardNo: form.idCardNo.trim(),
//             };

//             await apiPut(`/profile/update/${user.id}`, payload);
//             setModalVisible(true);
//         } catch (error) {
//             console.error('Error updating profile:', error.response?.data || error.message);
//             alert('Something went wrong while updating your profile.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <SafeAreaView style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={COLORS.primary} />
//                 <Text style={styles.loadingText}>Updating profile...</Text>
//             </SafeAreaView>
//         );
//     }

//     return (
//         <SafeAreaView style={styles.safeArea}>
//             <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />

//             <AppHeader title="Edit Profile" onBack={() => navigation.goBack()} />

//             <ScrollView
//                 contentContainerStyle={styles.scrollContainer}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* Profile Picture Section */}
//                 <View style={styles.profileSection}>
//                     <TouchableOpacity
//                         style={styles.profileImageContainer}
//                         activeOpacity={0.8}
//                         onPress={handlePickImage}
//                     >
//                         <Image
//                             source={localProfileImage ? { uri: localProfileImage } : require('../assets/no-image.jpg')}
//                             style={styles.profilePic}
//                             cachePolicy="disk"
//                         />
//                         <View style={styles.cameraOverlay}>
//                             <Ionicons name="camera" size={22} color="#fff" />
//                         </View>
//                     </TouchableOpacity>
//                     <Text style={styles.profileHint}>Tap to change photo</Text>
//                 </View>

//                 {/* Personal Information Card */}
//                 <View style={styles.card}>
//                     <View style={styles.cardHeader}>
//                         <View style={styles.iconBadge}>
//                             <Ionicons name="person" size={20} color={COLORS.primary} />
//                         </View>
//                         <View style={styles.cardHeaderText}>
//                             <Text style={styles.cardTitle}>Personal Information</Text>
//                             <Text style={styles.cardSubtitle}>Your basic details</Text>
//                         </View>
//                     </View>

//                     {/* Name Row */}
//                     <View style={styles.row}>
//                         <View style={styles.inputGroup}>
//                             <Text style={styles.label}>First Name</Text>
//                             <View style={styles.inputContainer}>
//                                 <Ionicons name="person-outline" size={18} color="#9CA3AF" />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={form.firstName}
//                                     onChangeText={(text) => handleChange('firstName', text)}
//                                     placeholder="First Name"
//                                     placeholderTextColor="#9CA3AF"
//                                 />
//                             </View>
//                         </View>

//                         <View style={styles.inputGroup}>
//                             <Text style={styles.label}>Last Name</Text>
//                             <View style={styles.inputContainer}>
//                                 <Ionicons name="person-outline" size={18} color="#9CA3AF" />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={form.lastName}
//                                     onChangeText={(text) => handleChange('lastName', text)}
//                                     placeholder="Last Name"
//                                     placeholderTextColor="#9CA3AF"
//                                 />
//                             </View>
//                         </View>
//                     </View>

//                     {/* Email */}
//                     <View style={styles.inputGroup}>
//                         <Text style={styles.label}>Email Address</Text>
//                         <View style={styles.inputContainer}>
//                             <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
//                             <TextInput
//                                 style={styles.input}
//                                 value={form.userEmail}
//                                 onChangeText={(text) => handleChange('userEmail', text)}
//                                 placeholder="email@example.com"
//                                 placeholderTextColor="#9CA3AF"
//                                 keyboardType="email-address"
//                                 autoCapitalize="none"
//                             />
//                         </View>
//                     </View>

//                     {/* Phone */}
//                     <View style={styles.inputGroup}>
//                         <Text style={styles.label}>Phone Number</Text>
//                         <View style={styles.inputContainer}>
//                             <Ionicons name="call-outline" size={18} color="#9CA3AF" />
//                             <TextInput
//                                 style={styles.input}
//                                 value={form.mobileNumber}
//                                 onChangeText={(text) => handleChange('mobileNumber', text)}
//                                 placeholder="+91 00000 00000"
//                                 placeholderTextColor="#9CA3AF"
//                                 keyboardType="phone-pad"
//                             />
//                         </View>
//                     </View>
//                 </View>

//                 {/* Academic Information Card */}
//                 <View style={styles.card}>
//                     <View style={styles.cardHeader}>
//                         <View style={[styles.iconBadge, { backgroundColor: '#FEF3C7' }]}>
//                             <Ionicons name="school" size={20} color="#CA8A04" />
//                         </View>
//                         <View style={styles.cardHeaderText}>
//                             <Text style={styles.cardTitle}>Academic Information</Text>
//                             <Text style={styles.cardSubtitle}>Your student details</Text>
//                         </View>
//                     </View>

//                     {/* Student ID */}
//                     <View style={styles.inputGroup}>
//                         <Text style={styles.label}>Student ID</Text>
//                         <View style={styles.inputContainer}>
//                             <Ionicons name="card-outline" size={18} color="#9CA3AF" />
//                             <TextInput
//                                 style={styles.input}
//                                 value={form.idCardNo}
//                                 onChangeText={(text) => handleChange('idCardNo', text)}
//                                 placeholder="Enter your student ID"
//                                 placeholderTextColor="#9CA3AF"
//                             />
//                         </View>
//                     </View>

//                     {/* College (Disabled) */}
//                     <View style={styles.inputGroup}>
//                         <View style={styles.labelRow}>
//                             <Text style={styles.label}>College</Text>
//                             <View style={styles.lockedBadge}>
//                                 <Ionicons name="lock-closed" size={12} color="#6B7280" />
//                                 <Text style={styles.lockedText}>Locked</Text>
//                             </View>
//                         </View>
//                         <View style={[styles.inputContainer, styles.inputDisabled]}>
//                             <Ionicons name="school-outline" size={18} color="#9CA3AF" />
//                             <TextInput
//                                 style={styles.input}
//                                 value={form.collegeName}
//                                 editable={false}
//                                 placeholder="College"
//                                 placeholderTextColor="#9CA3AF"
//                             />
//                         </View>
//                         <Text style={styles.helperText}>
//                             College cannot be changed after registration
//                         </Text>
//                     </View>
//                 </View>

//                 {/* Info Banner */}
//                 <View style={styles.infoBanner}>
//                     <Ionicons name="information-circle" size={18} color={COLORS.primary} />
//                     <Text style={styles.infoBannerText}>
//                         Make sure your information is accurate for verification purposes
//                     </Text>
//                 </View>

//                 {/* Save Button */}
//                 <Button
//                     title="Save Changes"
//                     onPress={handleSave}
//                     variant="primary"
//                     fullWidth
//                     icon="checkmark-circle"
//                     size="large"
//                     disabled={isButtonDisabled}
//                 />
//             </ScrollView>

//             {/* Success Modal */}
//             <SuccessModal
//                 visible={modalVisible}
//                 title="Profile Updated!"
//                 message="Your profile has been updated successfully."
//                 onClose={() => {
//                     setModalVisible(false);
//                     navigation.goBack();
//                 }}
//                 iconSize={50}
//                 iconColor="#10B981"
//                 iconBgColor="#D1FAE5"
//                 buttonText="Done"
//             />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: COLORS.dark.bg,
//     },

//     scrollContainer: {
//         padding: 16,
//         paddingBottom: 40,
//     },

//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: COLORS.dark.bgElevated,
//     },

//     loadingText: {
//         marginTop: 12,
//         fontSize: 14,
//         color: COLORS.dark.textTertiary,
//         fontWeight: '500',
//     },

//     // Profile Section
//     profileSection: {
//         alignItems: 'center',
//         marginBottom: 24,
//         marginTop: 8,
//     },

//     profileImageContainer: {
//         width: 110,
//         height: 110,
//         borderRadius: 55,
//         overflow: 'hidden',
//         position: 'relative',
//         backgroundColor: COLORS.dark.cardElevated,
//         borderWidth: 4,
//         borderColor: COLORS.dark.bg,
//         shadowColor: COLORS.shadow.medium,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 4,
//     },

//     profilePic: {
//         width: '100%',
//         height: '100%',
//     },

//     cameraOverlay: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: 'rgba(0,0,0,0.6)',
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingVertical: 8,
//     },

//     profileHint: {
//         fontSize: 13,
//         color: COLORS.dark.textSecondary,
//         fontWeight: '500',
//         marginTop: 12,
//     },

//     // Card Styles
//     card: {
//         backgroundColor: COLORS.dark.card,
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 16,
//         shadowColor: COLORS.shadow.light,
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 8,
//         elevation: 2,
//     },

//     cardHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//         gap: 12,
//     },

//     iconBadge: {
//         width: 40,
//         height: 40,
//         borderRadius: 10,
//         backgroundColor: COLORS.primaryLightest,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },

//     cardHeaderText: {
//         flex: 1,
//     },

//     cardTitle: {
//         fontSize: 16,
//         fontWeight: '800',
//         color: COLORS.dark.text,
//     },

//     cardSubtitle: {
//         fontSize: 12,
//         color: COLORS.dark.textTertiary,
//         marginTop: 2,
//     },

//     // Input Styles
//     row: {
//         flexDirection: 'row',
//         gap: 12,
//         marginBottom: 16,
//     },

//     inputGroup: {
//         flex: 1,
//         marginBottom: 16,
//     },

//     labelRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 8,
//     },

//     label: {
//         fontSize: 13,
//         fontWeight: '700',
//         color: COLORS.dark.textTertiary,
//         marginBottom: 8,
//     },

//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.dark.gray700,
//         borderRadius: 12,
//         borderWidth: 1.5,
//         borderColor: COLORS.dark.border,
//         paddingHorizontal: 14,
//         gap: 10,
//     },

//     inputDisabled: {
//         backgroundColor: COLORS.dark.gray900,
//         opacity: 0.6,
//     },

//     input: {
//         flex: 1,
//         paddingVertical: 12,
//         fontSize: 15,
//         color: COLORS.dark.text,
//         fontWeight: '500',
//     },

//     lockedBadge: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.dark.cardElevated,
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 6,
//         gap: 4,
//     },

//     lockedText: {
//         fontSize: 11,
//         fontWeight: '600',
//         color: COLORS.dark.textTertiary,
//     },

//     helperText: {
//         fontSize: 12,
//         color: COLORS.dark.textTertiary,
//         marginTop: 6,
//         fontWeight: '500',
//     },

//     // Info Banner
//     infoBanner: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: COLORS.transparentWhite10,
//         padding: 14,
//         borderRadius: 12,
//         marginBottom: 16,
//         gap: 10,
//         borderWidth: 1,
//         borderColor: COLORS.dark.divider,
//     },

//     infoBannerText: {
//         flex: 1,
//         fontSize: 13,
//         color: COLORS.dark.textTertiary,
//         lineHeight: 18,
//         fontWeight: '500',
//     },
// });

// export default EditProfileScreen;


import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

import { apiPut } from '../services/api';

import SuccessModal from '../components/Modal';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';
import InfoBox from '../components/InfoBox';

const EditProfileScreen = ({ navigation, route }) => {
    const { user, profileImage } = route.params || {};

    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        userEmail: user?.userEmail || '',
        mobileNumber: user?.mobileNumber || '',
        idCardNo: user?.idCardNo || '',
        collegeName: user?.college?.collegeName || '',
    });

    // Keep original data to compare
    const originalData = useMemo(() => ({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        userEmail: user?.userEmail || '',
        mobileNumber: user?.mobileNumber || '',
        idCardNo: user?.idCardNo || '',
        profileImage: profileImage || null,
    }), [user, profileImage]);

    const [localProfileImage, setLocalProfileImage] = useState(profileImage || null);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is required!');
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
            // uploadProfileImage(uri); // Uncomment when you have this function
        }
    };

    // Check if there are any changes
    const hasChanges =
        form.firstName.trim() !== originalData.firstName ||
        form.lastName.trim() !== originalData.lastName ||
        form.userEmail.trim() !== originalData.userEmail ||
        form.mobileNumber.trim() !== originalData.mobileNumber ||
        form.idCardNo.trim() !== originalData.idCardNo ||
        localProfileImage !== originalData.profileImage;

    // Check if required fields are filled
    const isFormValid =
        form.firstName.trim() !== '' &&
        form.lastName.trim() !== '' &&
        form.userEmail.trim() !== '';

    // Button should be disabled if no changes OR form is invalid
    const isButtonDisabled = !hasChanges || !isFormValid;

    const handleSave = async () => {
        // Double check before making API call
        if (!hasChanges) {
            alert('No changes detected');
            return;
        }

        if (!isFormValid) {
            alert('Please fill in all required fields');
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

            await apiPut(`/profile/update/${user.id}`, payload);
            setModalVisible(true);
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
            alert('Something went wrong while updating your profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Updating profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content" />

            <AppHeader title="Edit Profile" onBack={() => navigation.goBack()} />

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
                    >
                        <Image
                            source={localProfileImage ? { uri: localProfileImage } : require('../assets/no-image.jpg')}
                            style={styles.profilePic}
                            cachePolicy="disk"
                        />
                        <View style={styles.cameraOverlay}>
                            <Ionicons name="camera" size={22} color={COLORS.white} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.profileHint}>Tap to change photo</Text>
                </View>

                {/* Unsaved Changes Banner */}
                {hasChanges && (
                    <View style={styles.changesBanner}>
                        <Ionicons name="alert-circle" size={20} color={COLORS.warning} />
                        <Text style={styles.changesBannerText}>
                            You have unsaved changes
                        </Text>
                    </View>
                )}

                {/* Personal Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconBadge}>
                            <Ionicons name="person" size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Personal Information</Text>
                            <Text style={styles.cardSubtitle}>Your basic details</Text>
                        </View>
                    </View>

                    {/* Name Row */}
                    <View style={styles.row}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>First Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={18} color={COLORS.gray400} />
                                <TextInput
                                    style={styles.input}
                                    value={form.firstName}
                                    onChangeText={(text) => handleChange('firstName', text)}
                                    placeholder="First Name"
                                    placeholderTextColor={COLORS.gray400}
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Last Name</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={18} color={COLORS.gray400} />
                                <TextInput
                                    style={styles.input}
                                    value={form.lastName}
                                    onChangeText={(text) => handleChange('lastName', text)}
                                    placeholder="Last Name"
                                    placeholderTextColor={COLORS.gray400}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.gray400} />
                            <TextInput
                                style={styles.input}
                                value={form.userEmail}
                                onChangeText={(text) => handleChange('userEmail', text)}
                                placeholder="email@example.com"
                                placeholderTextColor={COLORS.gray400}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={18} color={COLORS.gray400} />
                            <TextInput
                                style={styles.input}
                                value={form.mobileNumber}
                                onChangeText={(text) => handleChange('mobileNumber', text)}
                                placeholder="+91 00000 00000"
                                placeholderTextColor={COLORS.gray400}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Academic Information Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.iconBadge, { backgroundColor: COLORS.warningBg }]}>
                            <Ionicons name="school" size={20} color={COLORS.warningDark} />
                        </View>
                        <View style={styles.cardHeaderText}>
                            <Text style={styles.cardTitle}>Academic Information</Text>
                            <Text style={styles.cardSubtitle}>Your student details</Text>
                        </View>
                    </View>

                    {/* Student ID */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Student ID</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={18} color={COLORS.gray400} />
                            <TextInput
                                style={styles.input}
                                value={form.idCardNo}
                                onChangeText={(text) => handleChange('idCardNo', text)}
                                placeholder="Enter your student ID"
                                placeholderTextColor={COLORS.gray400}
                            />
                        </View>
                    </View>

                    {/* College (Disabled) */}
                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>College</Text>
                            <View style={styles.lockedBadge}>
                                <Ionicons name="lock-closed" size={12} color={COLORS.gray500} />
                                <Text style={styles.lockedText}>Locked</Text>
                            </View>
                        </View>
                        <View style={[styles.inputContainer, styles.inputDisabled]}>
                            <Ionicons name="school-outline" size={18} color={COLORS.gray400} />
                            <TextInput
                                style={styles.input}
                                value={form.collegeName}
                                editable={false}
                                placeholder="College"
                                placeholderTextColor={COLORS.gray400}
                            />
                        </View>
                        <Text style={styles.helperText}>
                            College cannot be changed after registration
                        </Text>
                    </View>
                </View>

                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={18} color={COLORS.primary} />
                    <Text style={styles.infoBannerText}>
                        Make sure your information is accurate for verification purposes
                    </Text>
                </View>

                {/* Save Button */}
                <Button
                    title="Save Changes"
                    onPress={handleSave}
                    variant="primary"
                    fullWidth
                    icon={hasChanges ? "checkmark-circle" : "alert-circle-outline"}
                    size="large"
                    disabled={isButtonDisabled}
                />

                {/* Helper text below button */}
                {!hasChanges && (
                    <Text style={styles.noChangesText}>
                        Make changes to update your profile
                    </Text>
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
        padding: THEME.spacing.md,
        paddingBottom: THEME.spacing['3xl'],
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.dark.bg,
    },
    loadingText: {
        marginTop: THEME.spacing.itemGap,
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },

    // Profile Section
    profileSection: {
        alignItems: 'center',
        marginBottom: THEME.spacing.sectionGap,
        marginTop: THEME.spacing[2],
    },
    profileImageContainer: {
        width: 110,
        height: 110,
        borderRadius: THEME.borderRadius.full,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: THEME.borderWidth.thick,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.md,
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
        backgroundColor: COLORS.transparentBlack70,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: THEME.spacing[2],
    },
    profileHint: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
        marginTop: THEME.spacing.itemGap,
    },

    // Changes Banner
    changesBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.warningBg,
        padding: THEME.spacing.sm + 2,
        borderRadius: THEME.borderRadius.md,
        marginBottom: THEME.spacing.md,
        gap: THEME.spacing[2] + 2,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.warning + '30',
    },
    changesBannerText: {
        flex: 1,
        fontSize: THEME.fontSize.sm,
        color: COLORS.warning,
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.snug,
        fontWeight: THEME.fontWeight.semibold,
    },

    // Card Styles
    card: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.card,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing.lg,
        gap: THEME.spacing.itemGap,
    },
    iconBadge: {
        width: 40,
        height: 40,
        borderRadius: THEME.borderRadius.md,
        backgroundColor: COLORS.primaryLightest,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: THEME.fontSize.md,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
    },
    cardSubtitle: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textSecondary,
        marginTop: THEME.spacing[0] + 2,
    },

    // Input Styles
    row: {
        flexDirection: 'row',
        gap: THEME.spacing.itemGap,
        marginBottom: THEME.spacing.md,
    },
    inputGroup: {
        flex: 1,
        marginBottom: THEME.spacing.md,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing[2],
    },
    label: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[2],
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.gray700,
        borderRadius: THEME.borderRadius.md,
        borderWidth: THEME.borderWidth.medium,
        borderColor: COLORS.dark.border,
        paddingHorizontal: THEME.spacing.sm + 2,
        gap: THEME.spacing[2] + 2,
    },
    inputDisabled: {
        backgroundColor: COLORS.dark.cardElevated,
        opacity: THEME.opacity.disabled,
    },
    input: {
        flex: 1,
        paddingVertical: THEME.spacing.itemGap,
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.text,
        fontWeight: THEME.fontWeight.medium,
    },
    lockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.cardElevated,
        paddingHorizontal: THEME.spacing[2],
        paddingVertical: THEME.spacing[1],
        borderRadius: THEME.borderRadius.sm,
        gap: THEME.spacing[1],
    },
    lockedText: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textSecondary,
    },
    helperText: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        marginTop: THEME.spacing[1] + 2,
        fontWeight: THEME.fontWeight.medium,
    },

    // Info Banner
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: COLORS.transparentWhite10,
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.dark.divider,
        alignItems: 'flex-start',
    },
    infoBannerText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        marginLeft: 10,
        lineHeight: 18,
        fontWeight: '500',
    },

    // No Changes Text
    noChangesText: {
        textAlign: 'center',
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        marginTop: THEME.spacing[2],
        fontWeight: THEME.fontWeight.medium,
    },
});

export default EditProfileScreen;