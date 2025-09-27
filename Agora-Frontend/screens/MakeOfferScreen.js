import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const MakeOfferScreen = ({ navigation, route }) => {
    const { item } = route.params; // item = { name, image, price, sellerName }

    const [customOffer, setCustomOffer] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(null);

    const presetPercentages = [90, 80, 70]; // preset offers in %

    const handlePresetPress = (percent) => {
        setSelectedPreset(percent);
        setCustomOffer(''); // clear custom input when preset selected
    };

    const handleCustomChange = (value) => {
        setCustomOffer(value);
        setSelectedPreset(null); // deselect presets if typing custom
    };

    const handleMakeOffer = () => {
        const offer = selectedPreset
            ? (item.price * selectedPreset) / 100
            : parseFloat(customOffer);

        if (!offer || offer <= 0) {
            alert('Please enter a valid offer.');
            return;
        }

        // TODO: send offer to backend
        console.log('Offer sent:', offer);

        // success modal / feedback
        alert(`Offer of $${offer.toFixed(2)} sent to seller!`);

        navigation.goBack(); // or navigate to "Your Offers"
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: StatusBar.currentHeight || 20 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{item.sellerName}</Text>
                <View style={{ width: 24 }} /> {/* placeholder for alignment */}
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Item Box */}
                <View style={styles.itemBox}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Offer Box */}
                <Text style={styles.sectionTitle}>Make an Offer</Text>

                {/* Preset Buttons */}
                <View style={styles.presetsContainer}>
                    {presetPercentages.map((percent) => (
                        <TouchableOpacity
                            key={percent}
                            style={[
                                styles.presetButton,
                                selectedPreset === percent && { backgroundColor: COLORS.primary },
                            ]}
                            onPress={() => handlePresetPress(percent)}
                        >
                            <Text
                                style={[
                                    styles.presetText,
                                    selectedPreset === percent && { color: COLORS.white },
                                ]}
                            >
                                {percent}%
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Custom Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter custom price"
                    keyboardType="numeric"
                    value={customOffer}
                    onChangeText={handleCustomChange}
                />

                {/* Make Offer Button */}
                <TouchableOpacity style={styles.makeOfferButton} onPress={handleMakeOffer}>
                    <Text style={styles.makeOfferText}>Make Offer</Text>
                </TouchableOpacity>
            </ScrollView>
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
    itemBox: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        padding: THEME.spacing.md,
        borderRadius: 12,
        marginBottom: 24,
        alignItems: 'center',
    },
    itemImage: { width: 80, height: 80, borderRadius: 12 },
    itemName: { fontSize: 18, fontWeight: '700', color: COLORS.black },
    itemPrice: { fontSize: 16, color: COLORS.gray, marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: COLORS.black },
    presetsContainer: { flexDirection: 'row', marginBottom: 12, justifyContent: 'space-between' },
    presetButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        alignItems: 'center',
    },
    presetText: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f5f5f5',
        color: COLORS.black,
    },
    makeOfferButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    makeOfferText: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
});

export default MakeOfferScreen;
