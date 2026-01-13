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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

import { useReport } from '../hooks/useReport';

import AppHeader from '../components/AppHeader';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';
import ModalComponent from '../components/Modal';

const ReportListingScreen = ({ navigation, route }) => {
    const { listingId, listingTitle, listingImage } = route.params;
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { submitReport, loading } = useReport();
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });

    const reportReasons = [
        {
            id: 'counterfeit',
            title: 'Counterfeit Product',
            description: 'Fake or replica items',
            icon: 'close-circle-outline',
            color: '#EF4444',
        },
        {
            id: 'misleading',
            title: 'Misleading Description',
            description: 'False or inaccurate information',
            icon: 'alert-circle-outline',
            color: '#F59E0B',
        },
        {
            id: 'inappropriate',
            title: 'Inappropriate Content',
            description: 'Offensive images or text',
            icon: 'eye-off-outline',
            color: '#DC2626',
        },
        {
            id: 'prohibited',
            title: 'Prohibited Item',
            description: 'Item not allowed to be sold',
            icon: 'ban-outline',
            color: '#EF4444',
        },
        {
            id: 'pricing',
            title: 'Pricing Issue',
            description: 'Price gouging or unreasonable pricing',
            icon: 'cash-outline',
            color: '#F59E0B',
        },
        {
            id: 'duplicate',
            title: 'Duplicate Listing',
            description: 'Same item listed multiple times',
            icon: 'copy-outline',
            color: '#8B5CF6',
        },
        {
            id: 'spam',
            title: 'Spam',
            description: 'Irrelevant or repetitive posting',
            icon: 'megaphone-outline',
            color: '#F59E0B',
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

        const success = await submitReport(
            "LISTING",
            selectedReason,
            listingId,
            additionalDetails
        );

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
            <AppHeader title="Report Listing" onBack={() => navigation.goBack()} />

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Listing Preview */}
                <View style={styles.listingPreview}>
                    {listingImage && (
                        <Image
                            source={typeof listingImage === 'string' ? { uri: listingImage } : listingImage}
                            style={styles.listingImage}
                        />
                    )}
                    <View style={styles.listingInfo}>
                        <Text style={styles.listingTitle} numberOfLines={2}>
                            {listingTitle || 'Listing'}
                        </Text>
                        <View style={styles.reportingBadge}>
                            <Ionicons name="flag" size={12} color="#EF4444" />
                            <Text style={styles.reportingText}>Reporting this listing</Text>
                        </View>
                    </View>
                </View>

                {/* Reason Selection */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>What's wrong with this listing? *</Text>

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
                            placeholder="Help us understand the issue better..."
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
                    <Ionicons name="information-circle" size={20} color="#3B82F6" />
                    <Text style={styles.infoText}>
                        Our team will review this report. False reports may affect your account standing.
                    </Text>
                </View>

                {/* Submit Button */}
                <Button
                    title="Submit Report"
                    variant="danger"
                    size="large"
                    icon="send"
                    iconPosition="left"
                    onPress={handleSubmit}
                    disabled={!selectedReason}
                    style={[!selectedReason && styles.submitButtonDisabled]}
                />
            </ScrollView>

            <ModalComponent
                visible={showSuccessModal}
                type="success"
                title="Report Submitted"
                message="We've received your report and will investigate this listing. Thank you for helping maintain quality."
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
    listingPreview: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: 16,
        padding: 14,
        marginBottom: 24,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    listingImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: COLORS.dark.bgElevated,
    },
    listingInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 8,
        lineHeight: 22,
    },
    reportingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.errorBgDark,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    reportingText: {
        fontSize: 12,
        color: COLORS.error,
        fontWeight: '700',
        marginLeft: 5,
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
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    reasonCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#0F2A55', // dark version of light blue (#EFF6FF)
    },
    reasonIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        backgroundColor: COLORS.dark.cardElevated,
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
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    textAreaIcon: {
        marginRight: 12,
        marginTop: 2,
        color: COLORS.dark.textSecondary,
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
        backgroundColor: '#0F2A55',
        padding: 14,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#1C3B7A',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#66B8FF', // dark blue text
        marginLeft: 10,
        lineHeight: 18,
        fontWeight: '500',
    },
    submitButtonDisabled: {
        backgroundColor: COLORS.gray600,
        opacity: 0.6,
    },
});

export default ReportListingScreen;