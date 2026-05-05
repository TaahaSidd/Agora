import React, {useState} from 'react';
import {
    View, Text, SafeAreaView, StyleSheet, TouchableOpacity,
    TextInput, Image, ScrollView, StatusBar,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {COLORS} from '../utils/colors';
import {apiPut} from '../services/api';
import {uploadToCloudinary} from '../utils/upload';

import ModalComponent from '../components/Modal';
import Button from '../components/Button';
import ToastMessage from '../components/ToastMessage';
import AppHeader from '../components/AppHeader';
import CustomPicker from '../components/CustomPicker';
import InfoBox from '../components/InfoBox';

const MAX_IMAGES = 5;

const CATEGORY_ITEMS = [
    {label: 'Select Category',              value: '',             icon: null},
    {label: 'Textbooks & Study Materials',  value: 'textbooks',   icon: 'book-outline'},
    {label: 'Electronics & Gadgets',        value: 'electronics', icon: 'laptop-outline'},
    {label: 'Clothing & Accessories',       value: 'clothing',    icon: 'shirt-outline'},
    {label: 'Furniture & Dorm Supplies',    value: 'furniture',   icon: 'bed-outline'},
    {label: 'Stationery & Office Supplies', value: 'stationery',  icon: 'pencil-outline'},
    {label: 'Sports & Fitness Equipment',   value: 'sports',      icon: 'basketball-outline'},
    {label: 'Bicycles & Transportation',    value: 'bicycles',    icon: 'bicycle-outline'},
    {label: 'Food & Snacks',                value: 'food',        icon: 'fast-food-outline'},
    {label: 'Housing & Roommates',          value: 'housing',     icon: 'home-outline'},
    {label: 'Tutoring & Academic Services', value: 'tutoring',    icon: 'school-outline'},
    {label: 'Events & Tickets',             value: 'events',      icon: 'ticket-outline'},
    {label: 'Miscellaneous',                value: 'miscellaneous', icon: 'apps-outline'},
];

const CONDITION_ITEMS = [
    {label: 'Select Condition', value: ''},
    {label: 'New',              value: 'NEW'},
    {label: 'Used',             value: 'USED'},
    {label: 'Good',             value: 'GOOD'},
    {label: 'Refurbished',      value: 'REFURBISHED'},
    {label: 'Repaired',         value: 'REPAIRED'},
    {label: 'Damaged',          value: 'DAMAGED'},
];

const STATUS_ITEMS = [
    {label: 'Available',   value: 'AVAILABLE'},
    {label: 'Sold',        value: 'SOLD'},
    {label: 'Reserved',    value: 'RESERVED'},
    {label: 'Rented',      value: 'RENTED'},
    {label: 'Exchanged',   value: 'EXCHANGED'},
    {label: 'Deactivated', value: 'DEACTIVATED'},
];

const EditListingScreen = ({navigation, route}) => {
    const {listing: existingListing} = route.params;

    const [listing, setListing] = useState({
        title: existingListing.title || existingListing.name || '',
        description: existingListing.description || '',
        price: existingListing.price
            ? String(existingListing.price).replace('₹ ', '').replace(/[^0-9.]/g, '')
            : '',
        category: existingListing.category?.toLowerCase() || '',
        condition: existingListing.condition?.toUpperCase() || existingListing.itemCondition?.toUpperCase() || '',
        itemStatus: existingListing.itemStatus || 'AVAILABLE',
        images: existingListing.images?.map(img => typeof img === 'string' ? img : img.uri) ||
            existingListing.imageUrl?.map(img => typeof img === 'string' ? img : img.uri) || [],
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [toast, setToast] = useState({visible: false, type: 'info', message: ''});

    const handleChange = (key, value) => {
        setListing(prev => ({...prev, [key]: value}));
        setErrors(prev => ({...prev, [key]: null}));
    };

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) {
            handleChange('images', [...listing.images, result.assets[0].uri]);
        }
    };

    const removeImage = (index) => {
        handleChange('images', listing.images.filter((_, i) => i !== index));
    };

    const validateFields = () => {
        const e = {};
        if (!listing.title.trim())                                          e.title = 'Title is required';
        if (!listing.description.trim())                                    e.description = 'Description is required';
        else if (listing.description.length < 20)                          e.description = 'Description must be at least 20 characters';
        if (!listing.price.trim() || isNaN(listing.price))                 e.price = 'Valid price is required';
        if (!listing.category)                                              e.category = 'Category is required';
        if (!listing.condition)                                             e.condition = 'Condition is required';
        if (listing.images.length === 0)                                    e.images = 'At least one image is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateFields()) return;
        setLoading(true);
        try {
            const newImages      = listing.images.filter(img => !img.startsWith('http'));
            const existingImages = listing.images.filter(img => img.startsWith('http'));
            const uploaded       = await Promise.all(newImages.map(uri => uploadToCloudinary(uri)));

            await apiPut(`/listing/update/${existingListing.id}`, {
                title:         listing.title,
                description:   listing.description,
                price:         Number(listing.price),
                category:      listing.category,
                itemCondition: listing.condition.toUpperCase(),
                itemStatus:    listing.itemStatus,
                images: [
                    ...existingImages.map(url => ({url, publicId: null})),
                    ...uploaded.map(img => ({url: img.url, publicId: img.publicId})),
                ],
            });
            setModalVisible(true);
        } catch {
            setToast({visible: true, type: 'error', message: 'Error updating listing. Please try again.'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content"/>
            <AppHeader title="Edit Listing" onBack={() => navigation.goBack()}/>

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    message={toast.message}
                    onHide={() => setToast(p => ({...p, visible: false}))}
                />
            )}

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                {/* Hero */}
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>Edit Listing</Text>
                    <Text style={styles.heroSubtitle}>Update your item details</Text>
                </View>

                {/* Photos */}
                <View style={styles.section}>
                    <View style={styles.labelRow}>
                        <Text style={styles.fieldLabel}>Product Photos *</Text>
                        <View style={styles.countPill}>
                            <Text style={styles.countPillText}>{listing.images.length}/{MAX_IMAGES}</Text>
                        </View>
                    </View>
                    <View style={styles.imagesGrid}>
                        {listing.images.map((uri, index) => (
                            <View key={index} style={styles.imageCard}>
                                <Image source={{uri}} style={styles.uploadedImage}/>
                                {index === 0 && (
                                    <View style={styles.primaryBadge}>
                                        <Text style={styles.primaryBadgeText}>Cover</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    style={styles.removeBtn}
                                    onPress={() => removeImage(index)}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="close-circle" size={20} color={COLORS.error}/>
                                </TouchableOpacity>
                            </View>
                        ))}
                        {listing.images.length < MAX_IMAGES && (
                            <TouchableOpacity
                                style={[styles.addImageCard, errors.images && styles.errorBorder]}
                                onPress={pickImages}
                                activeOpacity={0.7}
                            >
                                <View style={styles.addIconWrapper}>
                                    <Ionicons name="add" size={24} color={COLORS.primary}/>
                                </View>
                                <Text style={styles.addImageText}>Add Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
                </View>

                {/* Title */}
                <View style={styles.section}>
                    <Text style={styles.fieldLabel}>Title *</Text>
                    <View style={[styles.inputRow, errors.title && styles.errorBorder]}>
                        <Ionicons name="pricetag-outline" size={16} color={COLORS.gray400} style={styles.inputIcon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. iPhone 13 Pro"
                            placeholderTextColor={COLORS.gray400}
                            value={listing.title}
                            onChangeText={t => handleChange('title', t)}
                            maxLength={50}
                        />
                        <Text style={[styles.counter, listing.title.length > 45 && {color: COLORS.error}]}>
                            {listing.title.length}/50
                        </Text>
                    </View>
                    {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.fieldLabel}>Description *</Text>
                    <View style={[styles.inputRow, styles.textAreaRow, errors.description && styles.errorBorder]}>
                        <Ionicons name="document-text-outline" size={16} color={COLORS.gray400} style={[styles.inputIcon, {marginTop: 2}]}/>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Describe your item in detail..."
                            placeholderTextColor={COLORS.gray400}
                            multiline
                            numberOfLines={5}
                            value={listing.description}
                            onChangeText={t => handleChange('description', t)}
                            textAlignVertical="top"
                            maxLength={800}
                        />
                    </View>
                    {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                </View>

                {/* Price */}
                <View style={styles.section}>
                    <Text style={styles.fieldLabel}>Price (₹) *</Text>
                    <View style={[styles.inputRow, errors.price && styles.errorBorder]}>
                        <Ionicons name="cash-outline" size={16} color={COLORS.gray400} style={styles.inputIcon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={COLORS.gray400}
                            keyboardType="numeric"
                            value={String(listing.price || '')}
                            onChangeText={t => handleChange('price', t.replace(/[^0-9.]/g, ''))}
                        />
                    </View>
                    {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                </View>

                {/* Pickers */}
                <View style={styles.section}>
                    <CustomPicker
                        label="Category *"
                        value={listing.category}
                        items={CATEGORY_ITEMS}
                        onValueChange={v => handleChange('category', v)}
                        icon="grid-outline"
                        placeholder="Select Category"
                        error={errors.category}
                    />
                </View>

                <View style={styles.section}>
                    <CustomPicker
                        label="Condition *"
                        value={listing.condition}
                        items={CONDITION_ITEMS}
                        onValueChange={v => handleChange('condition', v)}
                        icon="shield-checkmark-outline"
                        placeholder="Select Condition"
                        error={errors.condition}
                    />
                </View>

                <View style={styles.section}>
                    <CustomPicker
                        label="Status"
                        value={listing.itemStatus}
                        items={STATUS_ITEMS}
                        onValueChange={v => handleChange('itemStatus', v)}
                        icon="checkmark-circle-outline"
                        placeholder="Select Status"
                    />
                </View>

                <InfoBox text="Changes will be updated immediately and visible to all buyers."/>

                <Button
                    title="Update Listing"
                    onPress={handleUpdate}
                    variant="primary"
                    size="large"
                    icon="checkmark-circle-outline"
                    iconPosition="left"
                    loading={loading}
                    disabled={loading}
                    fullWidth
                    style={{marginTop: 8}}
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
        padding: 16,
        paddingBottom: 40,
    },

    // Hero
    hero: {
        marginBottom: 20,
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 13,
        color: COLORS.gray400,
    },

    // Section
    section: {
        marginBottom: 16,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.gray400,
        marginBottom: 8,
    },

    // Count pill
    countPill: {
        backgroundColor: `${COLORS.primary}12`,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    countPillText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.primary,
    },

    // Images
    imagesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    imageCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: COLORS.gray100,
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
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 5,
    },
    primaryBadgeText: {
        color: COLORS.white,
        fontSize: 9,
        fontWeight: '700',
    },
    removeBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 10,
    },
    addImageCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.gray100,
        borderStyle: 'dashed',
        backgroundColor: COLORS.gray50,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    addIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: `${COLORS.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addImageText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
    },

    // Inputs
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        paddingHorizontal: 12,
        height: 46,
    },
    textAreaRow: {
        height: 'auto',
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.light.text,
        fontWeight: '400',
    },
    textArea: {
        minHeight: 100,
        paddingTop: 0,
    },
    counter: {
        fontSize: 11,
        color: COLORS.gray400,
    },
    errorBorder: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 11,
        marginTop: 4,
        marginLeft: 2,
    },
});

export default EditListingScreen;