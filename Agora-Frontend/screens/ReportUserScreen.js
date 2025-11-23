import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

import { useReport } from '../hooks/useReport';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import ModalComponent from '../components/Modal';

const ReportUserScreen = ({ navigation, route }) => {
    const { userId, userName } = route.params;
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { submitReport, loading } = useReport();
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });

    const reportReasons = [
        {
            id: 'spam',
            title: 'Spam',
            description: 'Posting spam or unwanted content',
            icon: 'megaphone-outline',
            color: '#F59E0B',
        },
        {
            id: 'harassment',
            title: 'Harassment',
            description: 'Bullying or abusive behavior',
            icon: 'alert-circle-outline',
            color: '#EF4444',
        },
        {
            id: 'fake',
            title: 'Fake Account',
            description: 'Pretending to be someone else',
            icon: 'person-remove-outline',
            color: '#8B5CF6',
        },
        {
            id: 'scam',
            title: 'Scam or Fraud',
            description: 'Suspicious or fraudulent activity',
            icon: 'warning-outline',
            color: '#DC2626',
        },
        {
            id: 'inappropriate',
            title: 'Inappropriate Content',
            description: 'Offensive or adult content',
            icon: 'eye-off-outline',
            color: '#EF4444',
        },
        {
            id: 'other',
            title: 'Other',
            description: 'Something else',
            icon: 'ellipsis-horizontal-outline',
            color: '#6B7280',
        },
    ];

    const handleSubmit = async () => {
        if (!selectedReason) {
            setToast({
                visible: true,
                type: 'error',
                title: 'Required',
                message: 'Please select a reason for reporting',
            });
            return;
        }

        const success = await submitReport("USER", selectedReason, userId);
        if (success) {
            setShowSuccessModal(true);
        } else {
            setToast({
                visible: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to submit report. Please try again.',
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#F9FAFB" barStyle="dark-content" />
            <AppHeader title="Report User" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Info */}
                <View style={styles.headerCard}>
                    <View style={styles.warningIconCircle}>
                        <Ionicons name="flag" size={32} color="#EF4444" />
                    </View>
                    <Text style={styles.headerTitle}>Report {userName}</Text>
                    <Text style={styles.headerSubtitle}>
                        Help us understand what's happening. Your report is anonymous.
                    </Text>
                </View>

                {/* Reason Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Why are you reporting this user? *</Text>

                    {reportReasons.map((reason) => (
                        <TouchableOpacity
                            key={reason.id}
                            style={[
                                styles.reasonCard,
                                selectedReason === reason.id && styles.reasonCardSelected,
                            ]}
                            onPress={() => setSelectedReason(reason.id)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.reasonIconCircle,
                                    { backgroundColor: `${reason.color}15` },
                                ]}
                            >
                                <Ionicons name={reason.icon} size={24} color={reason.color} />
                            </View>
                            <View style={styles.reasonContent}>
                                <Text style={styles.reasonTitle}>{reason.title}</Text>
                                <Text style={styles.reasonDescription}>{reason.description}</Text>
                            </View>
                            <View style={styles.radioButton}>
                                {selectedReason === reason.id && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Additional Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Additional Details (Optional)</Text>
                    <View style={styles.textAreaContainer}>
                        <Ionicons
                            name="document-text-outline"
                            size={20}
                            color="#9CA3AF"
                            style={styles.textAreaIcon}
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Provide more context about this report..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={5}
                            value={additionalDetails}
                            onChangeText={setAdditionalDetails}
                            textAlignVertical="top"
                            maxLength={500}
                        />
                    </View>
                    <Text style={styles.characterCount}>{additionalDetails.length}/500</Text>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Ionicons name="shield-checkmark" size={20} color="#3B82F6" />
                    <Text style={styles.infoText}>
                        We take reports seriously. False reports may result in action against your account.
                    </Text>
                </View>

                {/* Submit Button */}
                <Button
                    title="Submit Report"
                    onPress={handleSubmit}
                    variant="danger"
                    size="large"
                    icon="send"
                    iconPosition="left"
                    disabled={!selectedReason}
                />
            </ScrollView>

            <ModalComponent
                visible={showSuccessModal}
                type="success"
                title="Report Submitted"
                message="Thank you for helping keep our community safe. We'll review this report shortly."
                primaryButtonText="Done"
                onPrimaryPress={() => {
                    setShowSuccessModal(false);
                    navigation.goBack();
                }}
            />

            {
                toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({ ...toast, visible: false })}
                    />
                )
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    headerCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    warningIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.errorBgDark,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.dark.textSecondary,
        marginBottom: 12,
    },
    reasonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: COLORS.dark.divider,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    reasonCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLightest,
    },
    reasonIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    reasonContent: {
        flex: 1,
    },
    reasonTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 2,
    },
    reasonDescription: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.dark.textTertiary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
    textAreaContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.dark.divider,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    textAreaIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    textArea: {
        flex: 1,
        fontSize: 15,
        color: COLORS.dark.text,
        minHeight: 100,
        fontWeight: '500',
    },
    characterCount: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        textAlign: 'right',
        marginTop: 6,
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: COLORS.infoBgDark,
        padding: 14,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.infoDark,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: COLORS.infoDark,
        marginLeft: 10,
        lineHeight: 18,
        fontWeight: '500',
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.dark.textTertiary,
        opacity: 0.6,
    },
});


export default ReportUserScreen;