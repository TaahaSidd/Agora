import React, {useState} from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import {COLORS} from '../utils/colors';
import {useUserStore} from '../stores/userStore';
import {apiPost} from '../services/api';
import {uploadToCloudinary} from '../utils/upload';

import ModalComponent from '../components/Modal';
import ToastMessage from '../components/ToastMessage';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';
import CustomPicker from '../components/CustomPicker';
import InfoBox from '../components/InfoBox';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 5;

const categoryItems = [
    {label: 'Select Category', value: '', icon: null},
    {label: 'Textbooks & Study Materials', value: 'textbooks', icon: 'book-outline'},
    {label: 'Electronics & Gadgets', value: 'electronics', icon: 'laptop-outline'},
    {label: 'Clothing & Accessories', value: 'clothing', icon: 'shirt-outline'},
    {label: 'Furniture & Dorm Supplies', value: 'furniture', icon: 'bed-outline'},
    {label: 'Stationery & Office Supplies', value: 'stationery', icon: 'pencil-outline'},
    {label: 'Sports & Fitness Equipment', value: 'sports', icon: 'basketball-outline'},
    {label: 'Bicycles & Transportation', value: 'bicycles', icon: 'bicycle-outline'},
    {label: 'Food & Snacks', value: 'food', icon: 'fast-food-outline'},
    {label: 'Housing & Roommates', value: 'housing', icon: 'home-outline'},
    {label: 'Tutoring & Academic Services', value: 'tutoring', icon: 'school-outline'},
    {label: 'Events & Tickets', value: 'events', icon: 'ticket-outline'},
    {label: 'Miscellaneous', value: 'miscellaneous', icon: 'apps-outline'},
];

const conditionItems = [
    {label: 'Select Condition', value: '', icon: ''},
    {label: 'New', value: 'NEW', icon: 'sparkles-outline'},
    {label: 'Used', value: 'USED', icon: 'refresh-outline'},
    {label: 'Good', value: 'GOOD', icon: 'thumbs-up-outline'},
    {label: 'Refurbished', value: 'REFURBISHED', icon: 'build-outline'},
    {label: 'Repaired', value: 'REPAIRED', icon: 'medkit-outline'},
    {label: 'Damaged', value: 'DAMAGED', icon: 'alert-circle-outline'},
];

const AddListingScreen = ({navigation}) => {
    const [listing, setListing] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        images: [],
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState(false);
    const [toast, setToast] = useState({visible: false, type: 'info', message: ''});

    const handleChange = (key, value) => {
        setListing(prev => ({...prev, [key]: value}));
        setErrors(prev => ({...prev, [key]: null}));
    };

    const pickImages = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setToast({visible: true, type: 'error', message: 'Camera roll permission is required to upload images.'});
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
            allowsMultipleSelection: false,
        });

        if (!result.canceled) {
            const pickedImage = result.assets[0];
            try {
                const fileInfo = await FileSystem.getInfoAsync(pickedImage.uri);
                if (fileInfo.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                    setToast({visible: true, type: 'error', message: `Image too large. Max size is ${MAX_FILE_SIZE_MB}MB.`});
                    return;
                }
            } catch (e) {
                console.warn('FileSystem info failed:', e);
            }
            handleChange('images', [...listing.images, pickedImage.uri]);
        }
    };

    const removeImage = (index) => {
        handleChange('images', listing.images.filter((_, i) => i !== index));
    };

    const validateFields = () => {
        const errs = {};
        if (!listing.title.trim()) errs.title = 'Title is required';
        if (!listing.description.trim()) errs.description = 'Description is required';
        else if (listing.description.length < 20) errs.description = 'Description must be at least 20 characters';
        else if (listing.description.length > 800) errs.description = 'Description cannot exceed 800 characters';
        if (!listing.price.trim() || isNaN(listing.price)) errs.price = 'Valid price is required';
        if (!listing.category) errs.category = 'Category is required';
        if (!listing.condition) errs.condition = 'Condition is required';
        if (listing.images.length === 0) errs.images = 'At least one image is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleCreate = async () => {
        if (!validateFields()) return;
        const {currentUser, fetchUser, setCelebrationPending} = useUserStore.getState();
        const roleBefore = currentUser?.role;
        setLoading(true);
        try {
            const cloudinaryUrls = await Promise.all(listing.images.map(uri => uploadToCloudinary(uri)));
            const response = await apiPost('/listing/create', {
                title: listing.title,
                description: listing.description,
                price: Number(listing.price),
                category: listing.category,
                itemCondition: listing.condition.toUpperCase(),
                images: cloudinaryUrls,
            });
            if (response) {
                await fetchUser();
                const updatedUser = useUserStore.getState().currentUser;
                if (roleBefore === 'STUDENT' && updatedUser?.role === 'SELLER') {
                    setCelebrationPending(true);
                }
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setModalVisible(true);
            }
        } catch (error) {
            setToast({visible: true, type: 'error', message: 'Error creating listing. Please try again.'});
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.light.bg} barStyle="dark-content"/>
            <AppHeader title="New Listing" onBack={() => navigation.goBack()}/>

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    message={toast.message}
                    onHide={() => setToast({...toast, visible: false})}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero */}
                    <View style={styles.hero}>
                        <Text style={styles.heroTitle}>Create New Listing</Text>
                        <Text style={styles.heroSubtitle}>Enter item details to reach buyers on campus</Text>
                    </View>

                    {/* Photos */}
                    <View style={styles.section}>
                        <View style={styles.labelRow}>
                            <Text style={styles.fieldLabel}>Product Photos *</Text>
                            <View style={styles.countPill}>
                                <Text style={styles.countText}>{listing.images.length}/{MAX_IMAGES}</Text>
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
                                    style={[styles.addImageCard, errors.images && styles.fieldError]}
                                    onPress={pickImages}
                                    activeOpacity={0.6}
                                >
                                    <View style={styles.addIconWrapper}>
                                        <Ionicons name="add" size={22} color={COLORS.primary}/>
                                    </View>
                                    <Text style={styles.addImageText}>Add Photo</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {listing.images.length === 0 && (
                            <Text style={styles.helperText}>First image will be your cover photo</Text>
                        )}
                        {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
                    </View>

                    {/* Title */}
                    <View style={styles.section}>
                        <Text style={styles.fieldLabel}>Title *</Text>
                        <View style={[styles.inputRow, errors.title && styles.fieldError]}>
                            <Ionicons name="pricetag-outline" size={16} color={COLORS.gray400} style={styles.inputIcon}/>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. iPhone 13 Pro"
                                placeholderTextColor={COLORS.gray400}
                                value={listing.title}
                                onChangeText={(text) => handleChange('title', text)}
                                maxLength={50}
                                returnKeyType="next"
                            />
                            <Text style={[styles.counter, listing.title.length > 45 && styles.counterWarn]}>
                                {listing.title.length}/50
                            </Text>
                        </View>
                        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                    </View>

                    {/* Description */}
                    <View style={styles.section}>
                        <Text style={styles.fieldLabel}>Description *</Text>
                        <View style={[styles.inputRow, styles.textAreaRow, errors.description && styles.fieldError]}>
                            <Ionicons
                                name="document-text-outline"
                                size={16}
                                color={COLORS.gray400}
                                style={[styles.inputIcon, {alignSelf: 'flex-start', marginTop: 13}]}
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Describe your item — any scratches, original packaging, etc."
                                placeholderTextColor={COLORS.gray400}
                                multiline
                                numberOfLines={5}
                                value={listing.description}
                                onChangeText={(text) => handleChange('description', text)}
                                textAlignVertical="top"
                                maxLength={800}
                            />
                            <Text style={[
                                styles.counter,
                                {alignSelf: 'flex-end', marginBottom: 12},
                                listing.description.length > 750 && styles.counterWarn,
                            ]}>
                                {listing.description.length}/800
                            </Text>
                        </View>
                        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                    </View>

                    {/* Price */}
                    <View style={styles.section}>
                        <Text style={styles.fieldLabel}>Price (₹) *</Text>
                        <View style={[styles.inputRow, errors.price && styles.fieldError]}>
                            <Ionicons name="cash-outline" size={16} color={COLORS.gray400} style={styles.inputIcon}/>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                placeholderTextColor={COLORS.gray400}
                                keyboardType="numeric"
                                value={listing.price}
                                onChangeText={(text) => {
                                    const value = text.replace(/[^0-9.]/g, '');
                                    handleChange('price', value);
                                    const num = Number(value);
                                    if (!value) setErrors(p => ({...p, price: 'Price is required'}));
                                    else if (num < 10) setErrors(p => ({...p, price: 'Min price is ₹10'}));
                                    else if (num > 1000000) setErrors(p => ({...p, price: 'Max price is ₹10,00,000'}));
                                    else setErrors(p => ({...p, price: null}));
                                }}
                            />
                        </View>
                        {listing.price && !errors.price && (
                            <Text style={styles.pricePreview}>
                                ₹{Number(listing.price).toLocaleString('en-IN')}
                            </Text>
                        )}
                        {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
                    </View>

                    {/* Category */}
                    <View style={styles.section}>
                        <CustomPicker
                            label="Category *"
                            value={listing.category}
                            items={categoryItems}
                            onValueChange={(v) => handleChange('category', v)}
                            icon="grid-outline"
                            placeholder="Select Category"
                            error={errors.category}
                        />
                    </View>

                    {/* Condition */}
                    <View style={styles.section}>
                        <CustomPicker
                            label="Condition *"
                            value={listing.condition}
                            items={conditionItems}
                            onValueChange={(v) => handleChange('condition', v)}
                            icon="shield-checkmark-outline"
                            placeholder="Select Condition"
                            error={errors.condition}
                        />
                    </View>

                    <InfoBox text="Your listing will go live instantly for everyone on campus!"/>

                    <Button
                        title="Create Listing"
                        onPress={handleCreate}
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
                    title="Listing Created!"
                    message="Your listing is now live and visible to buyers."
                    primaryButtonText="Okay"
                    onPrimaryPress={() => {
                        setModalVisible(false);
                        navigation.replace('MainLayout');
                    }}
                />
            </KeyboardAvoidingView>
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
        paddingBottom: 60,
    },

    // Hero
    hero: {
        marginBottom: 20,
        paddingHorizontal: 4,
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.gray400,
        marginBottom: 6,
    },
    countPill: {
        backgroundColor: `${COLORS.primary}12`,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    countText: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.primary,
    },

    // Images grid
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
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
    },
    primaryBadgeText: {
        color: COLORS.white,
        fontSize: 8,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    removeBtn: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: COLORS.white,
        borderRadius: 10,
    },
    addImageCard: {
        width: '31%',
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: COLORS.gray100,
        borderStyle: 'dashed',
        backgroundColor: COLORS.white,
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
        fontWeight: '500',
        color: COLORS.gray400,
    },

    // Inputs
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        paddingHorizontal: 12,
        minHeight: 46,
    },
    textAreaRow: {
        alignItems: 'flex-start',
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: COLORS.light.text,
        paddingVertical: 12,
        fontWeight: '400',
    },
    textArea: {
        minHeight: 110,
        paddingTop: 12,
        paddingBottom: 12,
    },
    counter: {
        fontSize: 11,
        color: COLORS.gray400,
    },
    counterWarn: {
        color: COLORS.error,
    },
    fieldError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 11,
        marginTop: 4,
        fontWeight: '400',
    },
    helperText: {
        fontSize: 11,
        color: COLORS.gray400,
        marginTop: 6,
    },
    pricePreview: {
        fontSize: 13,
        color: '#10B981',
        marginTop: 5,
        fontWeight: '600',
        paddingLeft: 4,
    },
});

export default AddListingScreen;