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
import AppHeader from '../components/AppHeader';
import ModalComponent from '../components/Modal';

const ReportListingScreen = ({ navigation, route }) => {
    const { listingId, listingTitle, listingImage } = route.params;
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
            Alert.alert('Required', 'Please select a reason for reporting');
            return;
        }

        try {
            // TODO: Implement API call to submit report
            console.log('Listing report submitted:', {
                listingId,
                reason: selectedReason,
                details: additionalDetails,
            });

            setShowSuccessModal(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit report. Please try again.');
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
                <TouchableOpacity
                    style={[styles.submitButton, !selectedReason && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!selectedReason}
                    activeOpacity={0.8}
                >
                    <Ionicons name="send" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                </TouchableOpacity>
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    listingPreview: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    listingImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    listingInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    listingTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        lineHeight: 22,
    },
    reportingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    reportingText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '700',
        marginLeft: 5,
    },
    section: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
    },
    reasonCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    reasonCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: '#EFF6FF',
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
        color: '#111827',
        marginBottom: 2,
    },
    reasonDescription: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
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
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
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
        color: '#111827',
        minHeight: 100,
        fontWeight: '500',
    },
    characterCount: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'right',
        marginTop: 6,
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        padding: 14,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1E40AF',
        marginLeft: 10,
        lineHeight: 18,
        fontWeight: '500',
    },
    submitButton: {
        flexDirection: 'row',
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EF4444',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        gap: 8,
    },
    submitButtonDisabled: {
        backgroundColor: '#D1D5DB',
        opacity: 0.6,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ReportListingScreen;