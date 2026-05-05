import React, {useState} from 'react';
import {
    SafeAreaView, ScrollView, StatusBar, StyleSheet,
    Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {useReport} from '../hooks/useReport';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import ModalComponent from '../components/Modal';
import InfoBox from '../components/InfoBox';

const REPORT_REASONS = [
    {id: 'spam',          title: 'Spam',                   desc: 'Posting spam or unwanted content',   icon: 'megaphone-outline',          color: COLORS.warning},
    {id: 'harassment',    title: 'Harassment',             desc: 'Bullying or abusive behavior',       icon: 'alert-circle-outline',       color: COLORS.error},
    {id: 'fake',          title: 'Fake Account',           desc: 'Pretending to be someone else',      icon: 'person-remove-outline',      color: COLORS.primary},
    {id: 'scam',          title: 'Scam or Fraud',          desc: 'Suspicious or fraudulent activity',  icon: 'warning-outline',            color: COLORS.error},
    {id: 'inappropriate', title: 'Inappropriate Content',  desc: 'Offensive or adult content',         icon: 'eye-off-outline',            color: COLORS.error},
    {id: 'other',         title: 'Other',                  desc: 'Something else',                     icon: 'ellipsis-horizontal-outline', color: COLORS.gray400},
];

const ReportUserScreen = ({navigation, route}) => {
    const {userId, userName} = route.params;
    const {submitReport, loading} = useReport();

    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});

    const showToast = (type, title, message) => setToast({visible: true, type, title, message});

    const handleSubmit = async () => {
        if (!selectedReason) {
            showToast('error', 'Required', 'Please select a reason for reporting.');
            return;
        }
        const success = await submitReport('USER', selectedReason, userId, additionalDetails);
        if (success) setShowSuccessModal(true);
        else showToast('error', 'Error', 'Failed to submit report. Please try again.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content"/>
            <AppHeader title="Report User" onBack={() => navigation.goBack()}/>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Header preview — same pattern as ReportListingScreen */}
                <View style={styles.preview}>
                    <View style={styles.previewIconWrapper}>
                        <Ionicons name="flag" size={22} color={COLORS.error}/>
                    </View>
                    <View style={styles.previewInfo}>
                        <Text style={styles.previewTitle} numberOfLines={1}>
                            {userName || 'User'}
                        </Text>
                        <View style={styles.reportBadge}>
                            <Ionicons name="flag" size={10} color={COLORS.error}/>
                            <Text style={styles.reportBadgeText}>Reporting this user</Text>
                        </View>
                    </View>
                </View>

                {/* Reason selection */}
                <Text style={styles.sectionLabel}>Why are you reporting this user?</Text>
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
                                <View style={[styles.reasonIcon, {backgroundColor: `${reason.color}12`}]}>
                                    <Ionicons name={reason.icon} size={18} color={reason.color}/>
                                </View>
                                <View style={styles.reasonText}>
                                    <Text style={styles.reasonTitle}>{reason.title}</Text>
                                    <Text style={styles.reasonDesc}>{reason.desc}</Text>
                                </View>
                                <View style={[styles.radio, selected && styles.radioSelected]}>
                                    {selected && <View style={styles.radioInner}/>}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Additional details */}
                <Text style={[styles.sectionLabel, {marginTop: 8}]}>Additional Details (Optional)</Text>
                <View style={styles.textAreaWrapper}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Provide more context about this report..."
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

                <InfoBox text="We take reports seriously. False reports may result in action against your account."/>

                <Button
                    title="Submit Report"
                    onPress={handleSubmit}
                    variant="danger"
                    size="large"
                    icon="send"
                    loading={loading}
                    disabled={!selectedReason || loading}
                    fullWidth
                    style={{marginTop: 8}}
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
                    onHide={() => setToast(p => ({...p, visible: false}))}
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

    // Preview — matches ReportListingScreen exactly
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
    previewIconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 12,
        backgroundColor: `${COLORS.error}12`,
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

export default ReportUserScreen;