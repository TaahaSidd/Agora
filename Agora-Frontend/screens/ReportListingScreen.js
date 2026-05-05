import React, { useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { useReport } from '../hooks/useReport';

import AppHeader from '../components/AppHeader';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';
import ModalComponent from '../components/Modal';
import InfoBox from '../components/InfoBox';

const REPORT_REASONS = [
    { id: 'counterfeit', title: 'Counterfeit Product', desc: 'Fake or replica items', icon: 'close-circle-outline', color: COLORS.error },
    { id: 'misleading', title: 'Misleading Description', desc: 'False or inaccurate information', icon: 'alert-circle-outline', color: COLORS.warning },
    { id: 'inappropriate', title: 'Inappropriate Content', desc: 'Offensive images or text', icon: 'eye-off-outline', color: COLORS.error },
    { id: 'prohibited', title: 'Prohibited Item', desc: 'Item not allowed to be sold', icon: 'ban-outline', color: COLORS.error },
    { id: 'pricing', title: 'Pricing Issue', desc: 'Price gouging or unreasonable pricing', icon: 'cash-outline', color: COLORS.warning },
    { id: 'duplicate', title: 'Duplicate Listing', desc: 'Same item listed multiple times', icon: 'copy-outline', color: COLORS.primary },
    { id: 'spam', title: 'Spam', desc: 'Irrelevant or repetitive posting', icon: 'megaphone-outline', color: COLORS.warning },
    { id: 'other', title: 'Other', desc: 'Something else', icon: 'ellipsis-horizontal-outline', color: COLORS.gray400 },
];

const ReportListingScreen = ({ navigation, route }) => {
    const { listingId, listingTitle, listingImage } = route.params;
    const { submitReport, loading } = useReport();

    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });

    const showToast = (type, title, message) => setToast({ visible: true, type, title, message });

    const handleSubmit = async () => {
        if (!selectedReason) {
            showToast('error', 'Required', 'Please select a reason for reporting.');
            return;
        }
        const success = await submitReport('LISTING', selectedReason, listingId, additionalDetails);
        if (success) setShowSuccessModal(true);
        else showToast('error', 'Error', 'Failed to submit report. Please try again.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content" />
            <AppHeader title="Report Listing" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Listing preview */}
                <View style={styles.preview}>
                    {listingImage ? (
                        <Image
                            source={typeof listingImage === 'string' ? { uri: listingImage } : listingImage}
                            style={styles.previewImage}
                        />
                    ) : (
                        <View style={[styles.previewImage, styles.previewPlaceholder]}>
                            <Ionicons name="image-outline" size={24} color={COLORS.gray400} />
                        </View>
                    )}
                    <View style={styles.previewInfo}>
                        <Text style={styles.previewTitle} numberOfLines={2}>
                            {listingTitle || 'Listing'}
                        </Text>
                        <View style={styles.reportBadge}>
                            <Ionicons name="flag" size={10} color={COLORS.error} />
                            <Text style={styles.reportBadgeText}>Reporting this listing</Text>
                        </View>
                    </View>
                </View>

                {/* Reason selection */}
                <Text style={styles.sectionLabel}>What's wrong with this listing?</Text>
                <View style={styles.reasons}>
                    {REPORT_REASONS.map((reason) => {
                        const selected = selectedReason === reason.id;
                        return (
                            <TouchableOpacity
                                key={reason.id}
                                style={[styles.reasonRow, selected && styles.reasonRowSelected]}
                                onPress={() => setSelectedReason(reason.id)}
                                activeOpacity={0.6}
                            >
                                <View style={[styles.reasonIcon, { backgroundColor: `${reason.color}12` }]}>
                                    <Ionicons name={reason.icon} size={18} color={reason.color} />
                                </View>
                                <View style={styles.reasonText}>
                                    <Text style={styles.reasonTitle}>{reason.title}</Text>
                                    <Text style={styles.reasonDesc}>{reason.desc}</Text>
                                </View>
                                <View style={[styles.radio, selected && styles.radioSelected]}>
                                    {selected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Additional details */}
                <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Additional Details (Optional)</Text>
                <View style={styles.textAreaWrapper}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Help us understand the issue better..."
                        placeholderTextColor={COLORS.gray400}
                        multiline
                        numberOfLines={5}
                        value={additionalDetails}
                        onChangeText={setAdditionalDetails}
                        textAlignVertical="top"
                        maxLength={500}
                    />
                    <Text style={styles.charCount}>{additionalDetails.length}/500</Text>
                </View>

                <InfoBox text="Our moderation team will review this report within 24 hours. False reports may lead to account restrictions." />

                <Button
                    title="Submit Report"
                    variant="danger"
                    size="large"
                    icon="send"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={!selectedReason || loading}
                    fullWidth
                    style={{ marginTop: 8 }}
                />
            </ScrollView>

            <ModalComponent
                visible={showSuccessModal}
                type="success"
                title="Report Submitted"
                message="Thank you for helping keep Agora safe. Our team will investigate this listing shortly."
                primaryButtonText="Back to Marketplace"
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
                    onHide={() => setToast(p => ({ ...p, visible: false }))}
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
        padding: 16,
        paddingBottom: 40,
    },

    // Preview
    preview: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        gap: 12,
    },
    previewImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: COLORS.gray100,
    },
    previewPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewInfo: {
        flex: 1,
        justifyContent: 'center',
        gap: 6,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
        lineHeight: 20,
    },
    reportBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: `${COLORS.error}12`,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    reportBadgeText: {
        fontSize: 10,
        color: COLORS.error,
        fontWeight: '600',
    },

    // Section label
    sectionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
    },

    // Reasons
    reasons: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        marginBottom: 24,
        overflow: 'hidden',
    },
    reasonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    reasonRowSelected: {
        backgroundColor: `${COLORS.primary}06`,
    },
    reasonIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reasonText: {
        flex: 1,
        gap: 2,
    },
    reasonTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
    },
    reasonDesc: {
        fontSize: 11,
        color: COLORS.gray400,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: COLORS.gray200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        borderColor: COLORS.primary,
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },

    // Text area
    textAreaWrapper: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        padding: 12,
        marginBottom: 16,
    },
    textArea: {
        fontSize: 13,
        color: COLORS.light.text,
        minHeight: 100,
        lineHeight: 20,
    },
    charCount: {
        fontSize: 11,
        color: COLORS.gray400,
        textAlign: 'right',
        marginTop: 4,
    },
});

export default ReportListingScreen;