import React, { useState, useEffect } from 'react';
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
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import SuccessModal from '../components/Modal';
import { apiPut } from '../services/api';
import AppHeader from '../components/AppHeader';

const EditListingScreen = ({ navigation, route }) => {
    const { listing } = route.params;

    const [formData, setFormData] = useState({
        title: listing.name || listing.title || '',
        description: listing.description || '',
        price: listing.price ? listing.price.replace('₹ ', '') : '',
        category: listing.category || '',
        condition: listing.condition || '',
        image: listing.image || null,
    });

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
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
        let validationErrors = {};
        if (!formData.title.trim()) validationErrors.title = 'Title is required';
        if (!formData.description.trim()) validationErrors.description = 'Description is required';
        if (!formData.price.trim() || isNaN(formData.price)) validationErrors.price = 'Valid price is required';
        if (!formData.category) validationErrors.category = 'Category is required';
        if (!formData.condition) validationErrors.condition = 'Condition is required';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateFields()) return;

        try {
            setLoading(true);

            const payload = {
                title: formData.title,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                itemCondition: formData.condition.toUpperCase(),
                image: formData.image,
            };

            await apiPut(`/listing/update/${listing.id}`, payload);

            setModalVisible(true);
        } catch (error) {
            console.error('Error updating listing:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to update listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <AppHeader title="Edit Listing" onBack={() => navigation.goBack()} />

            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={[styles.imageBox, errors.image && { borderColor: 'red' }]} onPress={pickImage}>
                    {formData.image ? (
                        <Image source={{ uri: formData.image }} style={styles.imagePreview} />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Ionicons name="image-outline" size={40} color={COLORS.gray} />
                            <Text style={styles.imageText}>Update Product Image</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

                <TextInput
                    style={[styles.input, errors.title && { borderColor: 'red' }]}
                    placeholder="Title"
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                <TextInput
                    style={[styles.input, styles.textArea, errors.description && { borderColor: 'red' }]}
                    placeholder="Description"
                    multiline
                    numberOfLines={4}
                    value={formData.description}
                    onChangeText={(text) => handleChange('description', text)}
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                <TextInput
                    style={[styles.input, errors.price && { borderColor: 'red' }]}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={formData.price}
                    onChangeText={(text) => handleChange('price', text)}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                <View style={[styles.pickerWrapper, errors.category && { borderColor: 'red' }]}>
                    <Picker
                        selectedValue={formData.category}
                        onValueChange={(value) => handleChange('category', value)}
                    >
                        <Picker.Item label="Select Category" value="" />
                        <Picker.Item label="Books" value="books" />
                        <Picker.Item label="Electronics" value="electronics" />
                        <Picker.Item label="Clothing" value="clothing" />
                        <Picker.Item label="Furniture" value="furniture" />
                        <Picker.Item label="Vehicle" value="vehicle" />
                        <Picker.Item label="Device" value="device" />
                        <Picker.Item label="Stationery" value="stationery" />
                        <Picker.Item label="Cloth" value="cloth" />
                    </Picker>
                </View>
                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

                <View style={[styles.pickerWrapper, errors.condition && { borderColor: 'red' }]}>
                    <Picker
                        selectedValue={formData.condition}
                        onValueChange={(value) => handleChange('condition', value)}
                    >
                        <Picker.Item label="Select Condition" value="" />
                        <Picker.Item label="New" value="new" />
                        <Picker.Item label="Like New" value="like-new" />
                        <Picker.Item label="Used" value="used" />
                        <Picker.Item label="Fair" value="fair" />
                        <Picker.Item label="Poor" value="poor" />
                    </Picker>
                </View>
                {errors.condition && <Text style={styles.errorText}>{errors.condition}</Text>}

                <TouchableOpacity
                    style={[styles.button, loading && { opacity: 0.6 }]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Update Listing</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            <SuccessModal
                visible={modalVisible}
                message="Your listing has been successfully updated!"
                onClose={() => {
                    setModalVisible(false);
                    navigation.goBack();
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

export default EditListingScreen;
