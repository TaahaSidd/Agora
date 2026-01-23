import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

import {useReport} from '../hooks/useReport';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import ModalComponent from '../components/Modal';
import InfoBox from "../components/InfoBox";
import {THEME} from '../utils/theme';

const ReportUserScreen = ({navigation, route}) => {
    const {userId, userName} = route.params;
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const {submitReport, loading} = useReport();
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});

    const reportReasons = [
        { id: 'spam', title: 'Spam', description: 'Posting spam or unwanted content', icon: 'megaphone-outline', color: '#F59E0B' },
        { id: 'harassment', title: 'Harassment', description: 'Bullying or abusive behavior', icon: 'alert-circle-outline', color: '#EF4444' },
        { id: 'fake', title: 'Fake Account', description: 'Pretending to be someone else', icon: 'person-remove-outline', color: '#8B5CF6' },
        { id: 'scam', title: 'Scam or Fraud', description: 'Suspicious or fraudulent activity', icon: 'warning-outline', color: '#DC2626' },
        { id: 'inappropriate', title: 'Inappropriate Content', description: 'Offensive or adult content', icon: 'eye-off-outline', color: '#EF4444' },
        { id: 'other', title: 'Other', description: 'Something else', icon: 'ellipsis-horizontal-outline', color: '#6B7280' },
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

        const success = await submitReport("USER", selectedReason, userId, additionalDetails);

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
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>
            <AppHeader title="Report User" onBack={() => navigation.goBack()}/>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Info */}
                <View style={styles.headerCard}>
                    <View style={styles.warningIconCircle}>
                        <Ionicons name="flag" size={32} color="#EF4444"/>
                    </View>
                    <Text style={styles.headerTitle}>Report {userName}</Text>
                    <Text style={styles.headerSubtitle}>
                        Help us understand what's happening. Your report is anonymous and helps keep the campus safe.
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
                                    {backgroundColor: `${reason.color}10`},
                                ]}
                            >
                                <Ionicons name={reason.icon} size={24} color={reason.color}/>
                            </View>
                            <View style={styles.reasonContent}>
                                <Text style={styles.reasonTitle}>{reason.title}</Text>
                                <Text style={styles.reasonDescription}>{reason.description}</Text>
                            </View>
                            <View style={[styles.radioButton, selectedReason === reason.id && styles.radioButtonActive]}>
                                {selectedReason === reason.id && (
                                    <View style={styles.radioButtonInner}/>
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
                            color={COLORS.light.textTertiary}
                            style={styles.textAreaIcon}
                        />
                        <TextInput
                            style={styles.textArea}
                            placeholder="Provide more context about this report..."
                            placeholderTextColor={COLORS.light.textTertiary}
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
                <InfoBox
                    text="We take reports seriously. False reports may result in action against your account."
                />

                {/* Submit Button */}
                <Button
                    title="Submit Report"
                    onPress={handleSubmit}
                    variant="danger"
                    size="large"
                    icon="send"
                    loading={loading}
                    disabled={!selectedReason || loading}
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
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    headerCard: {
        backgroundColor: COLORS.light.card,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    warningIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEF2F2', // Soft red
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.light.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.textSecondary,
        marginBottom: 12,
    },
    reasonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.light.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: COLORS.light.border,
    },
    reasonCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#EFF6FF', // Light primary tint
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
        color: COLORS.light.text,
        marginBottom: 2,
    },
    reasonDescription: {
        fontSize: 13,
        color: COLORS.light.textSecondary,
        fontWeight: '500',
    },
    radioButton: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: COLORS.light.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonActive: {
        borderColor: COLORS.primary,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
    textAreaContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.light.card,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.light.border,
        padding: 16,
    },
    textAreaIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    textArea: {
        flex: 1,
        fontSize: 15,
        color: COLORS.light.text,
        minHeight: 100,
        fontWeight: '500',
    },
    characterCount: {
        fontSize: 12,
        color: COLORS.light.textTertiary,
        textAlign: 'right',
        marginTop: 6,
        fontWeight: '500',
    },
});

export default ReportUserScreen;