import React, {useState} from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {apiPost} from '../services/api';

import {useUserStore} from '../stores/userStore';

import ToastMessage from "../components/ToastMessage";
import InfoBox from "../components/InfoBox";

const UserRatingScreen = ({route, navigation}) => {
    const {sellerId} = route.params;
    const {currentUser} = useUserStore();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: 'info', title: '', message: '' });

    const showToast = (type, title, message) => {
        setToast({ visible: true, type, title, message });
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            showToast('warning', 'Rating Required', 'Please select a star rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                listingId: 0,
                reviewerId: currentUser.id,
                rating: rating,
                comment: comment
            };

            await apiPost(`/Review/seller/${sellerId}`, payload);

            showToast('success', 'Review Posted!', 'Thank you for helping the community.');

            setTimeout(() => {
                navigation.goBack();
            }, 1500);

        } catch (error) {
            console.error("Submission error:", error);
            showToast('error', 'Error', 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.light.text}/>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Review</Text>
                    <Text style={styles.subtitle}>Help the Agora community by sharing your experience.</Text>
                </View>

                {/* Star Selector */}
                <View style={styles.starRow}>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <TouchableOpacity
                            key={num}
                            onPress={() => setRating(num)}
                            style={styles.starButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={rating >= num ? "star" : "star-outline"}
                                size={48}
                                color={rating >= num ? "#F59E0B" : COLORS.light.textTertiary}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>What was it like trading with them?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Was the seller punctual? Was the communication clear? Help others know what to expect..."
                        placeholderTextColor={COLORS.light.textTertiary}
                        multiline
                        value={comment}
                        onChangeText={setComment}
                        maxLength={800}
                    />
                    <Text style={styles.charCount}>{comment.length}/800</Text>
                </View>

                <InfoBox
                    icon="heart-circle"
                    text="Reviews are the backbone of our campus marketplace. By leaving a review, you're helping us maintain high standards of trust and safety for everyone."
                    type="success"
                />

                <TouchableOpacity
                    style={[styles.submitBtn, rating === 0 && styles.disabledBtn]}
                    onPress={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF"/>
                    ) : (
                        <Text style={styles.submitBtnText}>Post Review</Text>
                    )}
                </TouchableOpacity>

                {toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({ ...toast, visible: false })}
                    />
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg
    },
    content: {
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 40
    },
    backBtn: {
        marginBottom: 20
    },
    header: {
        marginBottom: 32
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.light.text,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.light.textSecondary,
        lineHeight: 22
    },
    starRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        gap: 5
    },
    starButton: {
        padding: 5
    },
    inputContainer: {
        marginBottom: 24
    },
    label: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.text,
        marginBottom: 12
    },
    input: {
        backgroundColor: COLORS.light.card,
        borderRadius: 20,
        padding: 20,
        color: COLORS.light.text,
        fontSize: 16,
        minHeight: 150,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: COLORS.light.border,
        // Added shadow for light mode depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    charCount: {
        textAlign: 'right',
        color: COLORS.light.textTertiary,
        fontSize: 12,
        marginTop: 8
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    disabledBtn: {
        backgroundColor: '#E5E7EB', // Neutral gray for disabled state in light mode
    },
    submitBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '800'
    }
});

export default UserRatingScreen;