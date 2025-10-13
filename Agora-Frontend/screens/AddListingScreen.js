import React, { useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import SuccessModal from '../components/Modal';
import { apiPost } from '../services/api';

import AppHeader from '../components/AppHeader';

const AddListingScreen = ({ navigation }) => {
    const [listing, setListing] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        condition: '',
        image: null,
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (key, value) => {
        setListing({ ...listing, [key]: value });
        setErrors((prev) => ({ ...prev, [key]: null }));
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            handleChange('image', result.assets[0].uri);
        }
    };

    const validateFields = () => {
        const validationErrors = {};
        if (!listing.title.trim()) validationErrors.title = 'Title is required';
        if (!listing.description.trim()) validationErrors.description = 'Description is required';
        if (!listing.price.trim() || isNaN(listing.price)) validationErrors.price = 'Valid price is required';
        if (!listing.category) validationErrors.category = 'Category is required';
        if (!listing.condition) validationErrors.condition = 'Condition is required';
        if (!listing.image) validationErrors.image = 'Product image is required';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validateFields()) return;

        setLoading(true);
        try {
            const payload = {
                title: listing.title,
                description: listing.description,
                price: Number(listing.price),
                category: listing.category,
                itemCondition: listing.condition.toUpperCase(),
                image: listing.image,
            };

            await apiPost('/listing/create', payload);

            setModalVisible(true);
        } catch (error) {
            console.log('Error creating listing:', error);
            alert('Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <AppHeader title="Add Your Listing" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity
                    style={[styles.imageBox, errors.image && { borderColor: 'red' }]}
                    onPress={pickImage}
                >
                    {listing.image ? (
                        <Image source={{ uri: listing.image }} style={styles.imagePreview} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="image-outline" size={40} color={COLORS.gray} />
                            <Text style={styles.imageText}>Add Product Image</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

                <TextInput
                    style={[styles.input, errors.title && { borderColor: 'red' }]}
                    placeholder="Title"
                    value={listing.title}
                    onChangeText={(text) => handleChange('title', text)}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                <TextInput
                    style={[styles.input, styles.textArea, errors.description && { borderColor: 'red' }]}
                    placeholder="Description"
                    multiline
                    numberOfLines={4}
                    value={listing.description}
                    onChangeText={(text) => handleChange('description', text)}
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                <TextInput
                    style={[styles.input, errors.price && { borderColor: 'red' }]}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={listing.price}
                    onChangeText={(text) => handleChange('price', text)}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                <View style={[styles.pickerWrapper, errors.category && { borderColor: 'red' }]}>
                    <Picker
                        selectedValue={listing.category}
                        onValueChange={(value) => handleChange('category', value)}
                    >
                        <Picker.Item label="Select Category" value="" />
                        <Picker.Item label="Books" value="books" />
                        <Picker.Item label="Electronics" value="electronics" />
                        <Picker.Item label="Clothing" value="clothing" />
                        <Picker.Item label="Furniture" value="furniture" />
                    </Picker>
                </View>
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

                <View style={[styles.pickerWrapper, errors.condition && { borderColor: 'red' }]}>
                    <Picker
                        selectedValue={listing.condition}
                        onValueChange={(value) => handleChange('condition', value)}
                    >
                        <Picker.Item label="Select Condition" value="" />
                        <Picker.Item label="New" value="new" />
                        <Picker.Item label="Like New" value="like-new" />
                        <Picker.Item label="Used" value="used" />
                    </Picker>
                </View>
                {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={handleCreate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Create Listing</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <SuccessModal
                visible={modalVisible}
                message="Your item has been successfully listed!"
                onClose={() => {
                    setModalVisible(false);
                    navigation.navigate('MainLayout');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { padding: THEME.spacing.lg },
    imageBox: {
        borderWidth: 2,
        borderColor: COLORS.gray,
        borderStyle: 'dashed',
        borderRadius: THEME.borderRadius.md,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fafafa',
    },
    imagePlaceholder: { alignItems: 'center' },
    imageText: { marginTop: 8, color: COLORS.gray },
    imagePreview: { width: '100%', height: '100%', borderRadius: THEME.borderRadius.md },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: THEME.borderRadius.md,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        color: COLORS.black,
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: THEME.borderRadius.md,
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: THEME.borderRadius.md,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600'
    },
    errorText: {
        color: 'red',
        marginBottom: THEME.spacing.sm,
        marginLeft: 8,
    },
});

export default AddListingScreen;
