import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import Button from './Button';

export default function IDCardConsentModal({ visible, onAccept, onDecline }) {
    const [hasReadTerms, setHasReadTerms] = useState(false);
    const [agreedToConsent, setAgreedToConsent] = useState(false);

    const handleScroll = (event) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

        if (isCloseToBottom && !hasReadTerms) {
            setHasReadTerms(true);
        }
    };

    const canProceed = hasReadTerms && agreedToConsent;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onDecline}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
                    </View>
                    <Text style={styles.headerTitle}>ID Card Verification</Text>
                    <Text style={styles.headerSubtitle}>Data Privacy & Consent</Text>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    onScroll={handleScroll}
                    scrollEventThrottle={400}
                    showsVerticalScrollIndicator={true}
                >
                    {/* Introduction */}
                    <View style={styles.section}>
                        <Text style={styles.introText}>
                            Before you upload your ID card, please read and understand how we handle your information.
                        </Text>
                    </View>

                    {/* What We Collect */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>What We Collect</Text>
                        </View>
                        <Text style={styles.bodyText}>
                            We will securely review your student ID card to verify your student status and extract basic profile information.
                        </Text>
                    </View>

                    {/* Why We Need It */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>Why We Need This</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Verification:</Text> To confirm you're a genuine student
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Trust & Safety:</Text> To create a secure student-only marketplace
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Profile Setup:</Text> To automatically fill your profile details
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Community Building:</Text> To connect you with students from your college
                            </Text>
                        </View>
                    </View>

                    {/* How We Protect It */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="lock-closed-outline" size={20} color={COLORS.success} />
                            <Text style={styles.sectionTitle}>How We Protect Your Data</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Encrypted Storage:</Text> Your ID card image is encrypted and stored securely
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Limited Access:</Text> Only authorized internal systems can access it for verification purposes
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>No Sharing:</Text> We never share your ID card with third parties
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Automatic Deletion:</Text> Your ID card image is permanently deleted within 7 days
                            </Text>
                        </View>
                    </View>

                    {/* Automatic Deletion */}
                    <View style={styles.highlightBox}>
                        <View style={styles.highlightHeader}>
                            <Ionicons name="time-outline" size={24} color={COLORS.warning} />
                            <Text style={styles.highlightTitle}>Automatic Deletion Policy</Text>
                        </View>
                        <Text style={styles.highlightText}>
                            Your ID card image will be automatically and permanently deleted from our servers within <Text style={styles.bold}>7 days</Text> of verification. Only the extracted text data (name, college) will be retained for your profile.
                        </Text>
                    </View>

                    {/* Your Rights */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="hand-right-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>Your Rights</Text>
                        </View>
                        <View style={styles.list}>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Right to Delete:</Text> Request deletion of your ID card image at any time
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Right to Access:</Text> View what data we have collected from your ID
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Right to Correct:</Text> Update any incorrect information
                            </Text>
                            <Text style={styles.listItem}>
                                • <Text style={styles.bold}>Right to Withdraw:</Text> Delete your account and all associated data
                            </Text>
                        </View>
                    </View>

                    {/* Contact */}
                    <View style={styles.section}>
                        <Text style={styles.bodyText}>
                            Questions about your data? Contact us at{' '}
                            <Text
                                style={styles.link}
                                onPress={() => Linking.openURL('mailto:privacy@agora.com')}
                            >
                                privacy@agora.com
                            </Text>
                        </Text>
                        <Text style={styles.bodyTextSmall}>
                            Read our full{' '}
                            <Text style={styles.link} onPress={() => { }}>
                                Privacy Policy
                            </Text>
                            {' '}and{' '}
                            <Text style={styles.link} onPress={() => { }}>
                                Terms of Service
                            </Text>
                        </Text>
                    </View>

                    {/* Scroll Indicator */}
                    {!hasReadTerms && (
                        <View style={styles.scrollIndicator}>
                            <Ionicons name="arrow-down" size={20} color={COLORS.dark.textTertiary} />
                            <Text style={styles.scrollText}>Scroll to continue</Text>
                        </View>
                    )}
                </ScrollView>

                {/* Consent Checkbox */}
                <View style={styles.consentSection}>
                    <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => setAgreedToConsent(!agreedToConsent)}
                        disabled={!hasReadTerms}
                    >
                        <View style={[
                            styles.checkbox,
                            agreedToConsent && styles.checkboxChecked,
                            !hasReadTerms && styles.checkboxDisabled
                        ]}>
                            {agreedToConsent && (
                                <Ionicons name="checkmark" size={18} color="#fff" />
                            )}
                        </View>
                        <Text style={[
                            styles.consentText,
                            !hasReadTerms && styles.consentTextDisabled
                        ]}>
                            I have read and agree to the data collection and usage terms outlined above
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <Button
                        title="Decline"
                        onPress={onDecline}
                        variant="outline"
                        size="medium"
                        style={styles.declineButton}
                    />

                    <Button
                        title="Continue"
                        onPress={onAccept}
                        variant="primary"
                        size="medium"
                        disabled={!canProceed}
                        style={styles.acceptButton}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    header: {
        alignItems: 'center',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    headerIcon: {
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.dark.text,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 28,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.dark.text,
        marginLeft: 8,
    },
    introText: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        lineHeight: 22,
    },
    bodyText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 21,
        marginBottom: 8,
    },
    bodyTextSmall: {
        fontSize: 13,
        color: COLORS.dark.textTertiary,
        lineHeight: 20,
        marginTop: 8,
    },
    list: {
        marginTop: 8,
    },
    listItem: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 24,
        paddingLeft: 8,
    },
    bold: {
        fontWeight: '600',
        color: COLORS.dark.text,
    },
    link: {
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
    highlightBox: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning,
        marginBottom: 28,
    },
    highlightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    highlightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark.text,
        marginLeft: 8,
    },
    highlightText: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        lineHeight: 21,
    },
    scrollIndicator: {
        alignItems: 'center',
        marginTop: 20,
        opacity: 0.6,
    },
    scrollText: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        marginTop: 4,
    },
    consentSection: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.dark.border,
        backgroundColor: COLORS.dark.bgElevated,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.dark.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    checkboxDisabled: {
        opacity: 0.3,
    },
    consentText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.dark.text,
        lineHeight: 20,
    },
    consentTextDisabled: {
        opacity: 0.3,
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 20,
        paddingTop: 0,
        gap: 12,
    },
    declineButton: {
        flex: 1,
    },
    acceptButton: {
        flex: 1,
    },
});