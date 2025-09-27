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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import SuccessModal from '../components/Modal';

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

    const handleChange = (key, value) => {
        setListing({ ...listing, [key]: value });
    };

    const handleCreate = () => {
        // TODO: replace with API call
        console.log('New listing:', listing);
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: StatusBar.currentHeight || 20 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Your Listing</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Image Selector */}
                <TouchableOpacity
                    style={styles.imageBox}
                    onPress={() => alert('Image picker logic here')}
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

                {/* Inputs */}
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    value={listing.title}
                    onChangeText={(text) => handleChange('title', text)}
                />

                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Description"
                    multiline
                    numberOfLines={4}
                    value={listing.description}
                    onChangeText={(text) => handleChange('description', text)}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Price"
                    keyboardType="numeric"
                    value={listing.price}
                    onChangeText={(text) => handleChange('price', text)}
                />

                {/* Category Picker */}
                <View style={styles.pickerWrapper}>
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

                {/* Condition Picker */}
                <View style={styles.pickerWrapper}>
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

                {/* Create Listing Button */}
                <TouchableOpacity style={styles.button} onPress={handleCreate}>
                    <Text style={styles.buttonText}>Create Listing</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Success Modal */}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.black },
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
    buttonText: { color: COLORS.white, fontSize: 18, fontWeight: '600' },
});

export default AddListingScreen;
