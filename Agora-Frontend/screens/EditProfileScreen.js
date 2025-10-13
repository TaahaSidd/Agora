import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import { apiPut } from '../services/api';

const EditProfileScreen = ({ navigation, route }) => {
    const { user } = route.params || {};

    const [form, setForm] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        userEmail: user?.userEmail || '',
        mobileNumber: user?.mobileNumber || '',
        idCardNo: user?.idCardNo || '',
        collegeName: user?.college?.collegeName || '',
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSave = async () => {
        if (!form.firstName || !form.lastName || !form.userEmail) return;

        try {
            setLoading(true);

            const payload = {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                userEmail: form.userEmail.trim(),
                mobileNumber: form.mobileNumber.trim(),
                idCardNo: form.idCardNo.trim(),
            };

            const response = await apiPut(`/profile/update/${user.id}`, payload);
            console.log('✅ Update response:', response);
            setModalVisible(true);
        } catch (error) {
            console.error('❌ Error updating profile:', error.response?.data || error.message);
            alert('Something went wrong while updating your profile.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.gray }}>Updating profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.containerRoot}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.picWrapper}>
                    <Image
                        source={
                            user?.profilePic
                                ? { uri: user.profilePic }
                                : require('../assets/adaptive-icon.png')
                        }
                        style={styles.profilePic}
                    />
                    <View style={styles.cameraIcon}>
                        <Ionicons name="camera" size={18} color={COLORS.white} />
                    </View>
                </TouchableOpacity>
                <View style={styles.form}>
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            value={form.firstName}
                            onChangeText={(text) => handleChange('firstName', text)}
                            placeholder="First Name"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            value={form.lastName}
                            onChangeText={(text) => handleChange('lastName', text)}
                            placeholder="Last Name"
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        value={form.userEmail}
                        onChangeText={(text) => handleChange('userEmail', text)}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        value={form.mobileNumber}
                        onChangeText={(text) => handleChange('mobileNumber', text)}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        value={form.idCardNo}
                        onChangeText={(text) => handleChange('idCardNo', text)}
                        placeholder="ID Card Number"
                    />
                    <TextInput
                        style={styles.input}
                        value={form.collegeName}
                        editable={false}
                        placeholder="College"
                    />
                </View>
            </ScrollView>
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Profile Updated!</Text>
                        <Text style={styles.modalMessage}>Your profile has been updated successfully.</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                navigation.goBack();
                            }}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    containerRoot: { flex: 1, backgroundColor: COLORS.white, paddingTop: StatusBar.currentHeight || 20 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.black },
    saveText: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
    scrollContainer: { padding: THEME.spacing.lg },
    picWrapper: { alignSelf: 'center', marginBottom: 24, position: 'relative' },
    profilePic: { width: 120, height: 120, borderRadius: THEME.borderRadius.full },
    cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, borderRadius: THEME.borderRadius.full, padding: 6 },
    form: { marginBottom: 40 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: THEME.borderRadius.md,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        color: COLORS.black,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    halfInput: { flex: 1, marginRight: 8 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: COLORS.white, padding: 20, borderRadius: 12, alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
    modalMessage: { fontSize: 16, color: COLORS.gray, textAlign: 'center', marginBottom: 20 },
    modalButton: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 8 },
    modalButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 16 },
});

export default EditProfileScreen;
