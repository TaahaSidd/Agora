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

import InfoBox from "../components/InfoBox";

const UserRatingScreen = ({route, navigation}) => {
    const {sellerId} = route.params;
    const {currentUser} = useUserStore();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a star rating");
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

            navigation.goBack();
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
        >
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={28} color={COLORS.dark.text}/>
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
                        >
                            <Ionicons
                                name={rating >= num ? "star" : "star-outline"}
                                size={48}
                                color={rating >= num ? "#F59E0B" : COLORS.dark.textTertiary}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>What was it like trading with them?</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Was the seller punctual? Was the communication clear? Help others know what to expect..."
                        placeholderTextColor={COLORS.dark.textTertiary}
                        multiline
                        value={comment}
                        onChangeText={setComment}
                        maxLength={800}
                    />
                    <Text style={styles.charCount}>{comment.length}/800</Text>
                </View>

                <InfoBox
                    icon="heart-circle"
                    text=" Reviews are the backbone of our campus marketplace. By leaving a review, you're helping us
                        maintain high standards of trust and safety for everyone."
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: COLORS.dark.bg},
    content: {padding: 24, paddingTop: 60},
    backBtn: {marginBottom: 20},
    header: {marginBottom: 32},
    title: {fontSize: 28, fontWeight: '900', color: COLORS.dark.text, marginBottom: 8},
    subtitle: {fontSize: 16, color: COLORS.dark.textSecondary, lineHeight: 22},
    starRow: {flexDirection: 'row', justifyContent: 'center', marginBottom: 40, gap: 5},
    starButton: {padding: 5},
    inputContainer: {marginBottom: 24},
    label: {fontSize: 15, fontWeight: '700', color: COLORS.dark.text, marginBottom: 12},
    input: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        padding: 20,
        color: COLORS.dark.text,
        fontSize: 16,
        minHeight: 150,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: COLORS.dark.border
    },
    charCount: {textAlign: 'right', color: COLORS.dark.textTertiary, fontSize: 12, marginTop: 8},
    communityCard: {
        backgroundColor: COLORS.dark.cardElevated,
        padding: 20,
        borderRadius: 20,
        marginBottom: 32,
    },
    communityHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10},
    communityTitle: {fontWeight: '800', color: COLORS.dark.text, fontSize: 16},
    communityText: {fontSize: 14, color: COLORS.dark.textSecondary, lineHeight: 20},
    submitBtn: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledBtn: {backgroundColor: COLORS.dark.cardElevated},
    submitBtnText: {color: '#FFF', fontSize: 18, fontWeight: '800'}
});

export default UserRatingScreen;