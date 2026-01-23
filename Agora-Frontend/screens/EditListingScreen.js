import React, {useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';
import {apiPut} from '../services/api';
import {uploadToCloudinary} from '../utils/upload';

import ModalComponent from '../components/Modal';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import AppHeader from '../components/AppHeader';
import CustomPicker from '../components/CustomPicker';
import InfoBox from '../components/InfoBox';

const EditListingScreen = ({navigation, route}) => {
    const {listing: existingListing} = route.params;

    const [listing, setListing] = useState({
        title: existingListing.title || existingListing.name || '',
        description: existingListing.description || '',
        price: existingListing.price ? String(existingListing.price).replace('₹ ', '').replace(/[^0-9.]/g, '') : '',
        category: existingListing.category?.toLowerCase() || '',
        condition: existingListing.condition?.toUpperCase() || existingListing.itemCondition?.toUpperCase() || '',
        images: existingListing.images?.map(img => typeof img === 'string' ? img : img.uri) ||
            existingListing.imageUrl?.map(img => typeof img === 'string' ? img : img.uri) || [],
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(false);
    const [toast, setToast] = useState({visible: false, type: 'info', message: ''});

    const categoryItems = [
        {label: "Select Category", value: "", icon: null},
        {label: "Textbooks & Study Materials", value: "textbooks", icon: "book-outline"},
        {label: "Electronics & Gadgets", value: "electronics", icon: "laptop-outline"},
        {label: "Clothing & Accessories", value: "clothing", icon: "shirt-outline"},
        {label: "Furniture & Dorm Supplies", value: "furniture", icon: "bed-outline"},
        {label: "Stationery & Office Supplies", value: "stationery", icon: "pencil-outline"},
        {label: "Sports & Fitness Equipment", value: "sports", icon: "basketball-outline"},
        {label: "Bicycles & Transportation", value: "bicycles", icon: "bicycle-outline"},
        {label: "Food & Snacks", value: "food", icon: "fast-food-outline"},
        {label: "Housing & Roommates", value: "housing", icon: "home-outline"},
        {label: "Tutoring & Academic Services", value: "tutoring", icon: "school-outline"},
        {label: "Events & Tickets", value: "events", icon: "ticket-outline"},
        {label: "Miscellaneous", value: "miscellaneous", icon: "apps-outline"},
    ];

    const conditionItems = [
        {label: "Select Condition", value: ""},
        {label: "New", value: "NEW"},
        {label: "Used", value: "USED"},
        {label: "Good", value: "GOOD"},
        {label: "Refurbished", value: "REFURBISHED"},
        {label: "Repaired", value: "REPAIRED"},
        {label: "Damaged", value: "DAMAGED"},
    ];

    const statusItems = [
        {label: "Available", value: "AVAILABLE"},
        {label: "Sold", value: "SOLD"},
        {label: "Reserved", value: "RESERVED"},
        {label: "Rented", value: "RENTED"},
        {label: "Exchanged", value: "EXCHANGED"},
        {label: "Deactivated", value: "DEACTIVATED"},
    ];

    const handleChange = (key, value) => {
        setListing({...listing, [key]: value});
        setErrors((prev) => ({...prev, [key]: null}));
    };

    const MAX_IMAGES = 5;
    const MAX_FILE_SIZE_MB = 5;

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            const pickedImage = result.assets[0];
            const newImages = [...listing.images, pickedImage.uri];
            handleChange('images', newImages);
        }
    };

    const removeImage = (index) => {
        const newImages = listing.images.filter((_, i) => i !== index);
        handleChange('images', newImages);
    };

    const validateFields = () => {
        const validationErrors = {};
        if (!listing.title.trim()) validationErrors.title = 'Title is required';
        if (!listing.description.trim()) {
            validationErrors.description = 'Description is required';
        } else if (listing.description.length < 20) {
            validationErrors.description = 'Description must be at least 20 characters';
        }
        if (!listing.price.trim() || isNaN(listing.price)) validationErrors.price = 'Valid price is required';
        if (!listing.category) validationErrors.category = 'Category is required';
        if (!listing.condition) validationErrors.condition = 'Condition is required';
        if (listing.images.length === 0) validationErrors.images = 'At least one product image is required';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const newImages = listing.images.filter(img => !img.startsWith('http'));
            const existingImages = listing.images.filter(img => img.startsWith('http'));

            const uploadPromises = newImages.map(imageUri => uploadToCloudinary(imageUri));
            const cloudinaryResults = await Promise.all(uploadPromises);

            const allImages = [
                ...existingImages.map(url => ({url, publicId: null})),
                ...cloudinaryResults.map(img => ({url: img.url, publicId: img.publicId}))
            ];

            const payload = {
                title: listing.title,
                description: listing.description,
                price: Number(listing.price),
                category: listing.category,
                itemCondition: listing.condition.toUpperCase(),
                itemStatus: listing.itemStatus,
                images: allImages,
            };

            await apiPut(`/listing/update/${existingListing.id}`, payload);
            setModalVisible(true);
        } catch (error) {
            setToast({
                visible: true,
                type: 'error',
                message: `Error updating listing! Please try again later`,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>
            <AppHeader title="Edit Your Listing" onBack={() => navigation.goBack()}/>

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    message={toast.message}
                    onHide={() => setToast({...toast, visible: false})}
                />
            )}

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Edit Listing</Text>
                    <Text style={styles.headerSubtitle}>Update your item details</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.labelRow}>
                        <Text style={styles.sectionLabel}>Product Photos *</Text>
                        <Text style={styles.imageCount}>
                            {listing.images.length}/{MAX_IMAGES}
                        </Text>
                    </View>

                    <View style={styles.imagesGrid}>
                        {listing.images.map((imageUri, index) => (
                            <View key={index} style={styles.imageCard}>
                                <Image source={{uri: imageUri}} style={styles.uploadedImage}/>
                                {index === 0 && (
                                    <View style={styles.primaryBadge}>
                                        <Text style={styles.primaryText}>Primary</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(index)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close-circle" size={24} color="#EF4444"/>
                                </TouchableOpacity>
                            </View>
                        ))}

                        {listing.images.length < MAX_IMAGES && (
                            <TouchableOpacity
                                style={[styles.addImageCard, errors.images && listing.images.length === 0 && styles.inputError]}
                                onPress={pickImages}
                                activeOpacity={0.7}
                            >
                                <View style={styles.uploadIcon}>
                                    <Ionicons name="add" size={32} color={COLORS.primary}/>
                                </View>
                                <Text style={styles.addImageText}>Add Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Title *</Text>
                    <View style={[styles.inputContainer, errors.title && styles.inputError]}>
                        <Ionicons name="pricetag-outline" size={20} color="#9CA3AF" style={styles.inputIcon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. iPhone 13 Pro"
                            placeholderTextColor="#9CA3AF"
                            value={listing.title}
                            onChangeText={(text) => handleChange('title', text)}
                            maxLength={50}
                        />
                        <Text style={[styles.counterText, {color: listing.title.length > 45 ? '#EF4444' : '#6B7280'}]}>
                            {listing.title.length}/50
                        </Text>
                    </View>
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Description *</Text>
                    <View style={[styles.inputContainer, styles.textAreaContainer, errors.description && styles.inputError]}>
                        <Ionicons name="document-text-outline" size={20} color="#9CA3AF"
                                  style={[styles.inputIcon, {alignSelf: 'flex-start', marginTop: 12}]}/>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your item in detail..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={5}
                            value={listing.description}
                            onChangeText={(text) => handleChange('description', text)}
                            textAlignVertical="top"
                            maxLength={800}
                        />
                    </View>
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Price (₹) *</Text>
                    <View style={[styles.inputContainer, errors.price && styles.inputError]}>
                        <Ionicons name="cash-outline" size={20} color="#9CA3AF" style={styles.inputIcon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="numeric"
                            value={String(listing.price || '')}
                            onChangeText={(text) => {
                                const value = text.replace(/[^0-9.]/g, '');
                                handleChange('price', value);
                            }}
                        />
                    </View>
                    {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                </View>

                <View style={styles.section}>
                    <CustomPicker
                        label="Category *"
                        value={listing.category}
                        items={categoryItems}
                        onValueChange={(value) => handleChange('category', value)}
                        icon="grid-outline"
                        placeholder="Select Category"
                        error={errors.category}
                    />
                </View>

                <View style={styles.section}>
                    <CustomPicker
                        label="Condition *"
                        value={listing.condition}
                        items={conditionItems}
                        onValueChange={(value) => handleChange('condition', value)}
                        icon="shield-checkmark-outline"
                        placeholder="Select Condition"
                        error={errors.condition}
                    />
                </View>

                <View style={styles.section}>
                    <CustomPicker
                        label="Status *"
                        value={listing.itemStatus || 'AVAILABLE'}
                        items={statusItems}
                        onValueChange={(value) => handleChange('itemStatus', value)}
                        icon="checkmark-circle-outline"
                        placeholder="Select Status"
                    />
                </View>

                <InfoBox text="Changes will be updated immediately and visible to all buyers" />

                <Button
                    title="Update Listing"
                    onPress={handleUpdate}
                    variant="primary"
                    size="large"
                    icon="checkmark-circle-outline"
                    iconPosition="left"
                    loading={loading}
                    disabled={loading}
                />
            </ScrollView>

            <ModalComponent
                visible={modalVisible}
                type="success"
                title="Listing Updated!"
                message="Your listing has been successfully updated and is now live."
                primaryButtonText="Okay"
                onPrimaryPress={() => {
                    setModalVisible(false);
                    navigation.goBack();
                }}
            />
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
    headerInfo: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.light.text,
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.light.textSecondary,
        fontWeight: '500',
    },
    section: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.text,
        marginBottom: 6,
    },
    imageCount: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
        backgroundColor: '#EBF2FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    imageCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#F3F4F6',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
    },
    primaryBadge: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    primaryText: {
        color: COLORS.white,
        fontSize: 9,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    removeButton: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 12,
    },
    addImageCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadIcon: {
        width: 50,
        height: 50,
        borderRadius: 24,
        backgroundColor: '#EBF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    addImageText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.light.textSecondary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
    },
    textAreaContainer: {
        alignItems: 'flex-start',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.light.text,
        paddingVertical: 14,
        fontWeight: '500',
    },
    textArea: {
        minHeight: 120,
        paddingTop: 14,
        paddingBottom: 14,
    },
    counterText: {
        textAlign: 'right',
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.light.textSecondary,
    },
    inputError: {
        borderColor: COLORS.error,
        borderWidth: 2,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 2,
        marginLeft: 4,
        fontWeight: '500',
    },
});

export default EditListingScreen;