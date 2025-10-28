import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const CustomPicker = ({
    label,
    value,
    items,
    onValueChange,
    icon,
    placeholder = "Select an option",
    error
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedItem = items.find(item => item.value === value);
    const displayText = selectedItem ? selectedItem.label : placeholder;

    const handleSelect = (itemValue) => {
        onValueChange(itemValue);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            {/* Picker Button */}
            <TouchableOpacity
                style={[styles.pickerButton, error && styles.pickerButtonError]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.pickerContent}>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={20}
                            color="#9CA3AF"
                            style={styles.icon}
                        />
                    )}
                    <Text style={[
                        styles.pickerText,
                        !value && styles.placeholderText
                    ]}>
                        {displayText}
                    </Text>
                </View>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#9CA3AF"
                />
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalContent}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {label || 'Select'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {/* Options List */}
                        <ScrollView
                            style={styles.optionsList}
                            showsVerticalScrollIndicator={false}
                        >
                            {items.map((item, index) => {
                                const isSelected = value === item.value;
                                const isDisabled = item.value === "";

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.optionItem,
                                            isSelected && styles.optionItemSelected,
                                            index === items.length - 1 && styles.lastItem,
                                        ]}
                                        onPress={() => !isDisabled && handleSelect(item.value)}
                                        activeOpacity={0.7}
                                        disabled={isDisabled}
                                    >
                                        <View style={styles.optionContent}>
                                            {item.icon && (
                                                <View style={[
                                                    styles.optionIconContainer,
                                                    isSelected && { backgroundColor: '#EFF6FF' }
                                                ]}>
                                                    <Ionicons
                                                        name={item.icon}
                                                        size={22}
                                                        color={isSelected ? COLORS.primary : '#6B7280'}
                                                    />
                                                </View>
                                            )}
                                            <Text style={[
                                                styles.optionText,
                                                isSelected && styles.optionTextSelected,
                                                isDisabled && styles.optionTextDisabled,
                                            ]}>
                                                {item.label}
                                            </Text>
                                        </View>
                                        {isSelected && (
                                            <View style={styles.checkmarkContainer}>
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={24}
                                                    color={COLORS.primary}
                                                />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // No margin here as parent controls spacing
    },
    label: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 10,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 16,
        height: 52, // Match input height
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    pickerButtonError: {
        borderColor: '#EF4444',
        borderWidth: 2,
    },
    pickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        marginRight: 12,
    },
    pickerText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#111827',
        flex: 1,
    },
    placeholderText: {
        color: '#9CA3AF',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 13,
        color: '#EF4444',
        marginTop: 6,
        marginLeft: 4,
        fontWeight: '500',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: -0.3,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsList: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: '#F9FAFB',
    },
    optionItemSelected: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    lastItem: {
        marginBottom: 0,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        flex: 1,
    },
    optionTextSelected: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    optionTextDisabled: {
        color: '#D1D5DB',
    },
    checkmarkContainer: {
        marginLeft: 8,
    },
});

export default CustomPicker;