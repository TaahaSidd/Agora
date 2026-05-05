import React, {useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const CustomPicker = ({
    label,
    value,
    items,
    onValueChange,
    icon,
    placeholder = 'Select an option',
    error,
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

            {/* Trigger */}
            <TouchableOpacity
                style={[styles.trigger, error && styles.triggerError]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.6}
            >
                <View style={styles.triggerLeft}>
                    {icon && (
                        <Ionicons name={icon} size={16} color={COLORS.gray500}/>
                    )}
                    <Text style={[styles.triggerText, !value && styles.placeholder]}>
                        {displayText}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={14} color={COLORS.gray500}/>
            </TouchableOpacity>

            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setModalVisible(false)}
                >
                    <Pressable
                        style={styles.sheet}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Handle */}
                        <View style={styles.handle}/>

                        {/* Header */}
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>{label || 'Select'}</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeBtn}
                                activeOpacity={0.6}
                            >
                                <Ionicons name="close" size={16} color={COLORS.gray400}/>
                            </TouchableOpacity>
                        </View>

                        {/* Options */}
                        <ScrollView
                            contentContainerStyle={styles.optionsList}
                            showsVerticalScrollIndicator={false}
                        >
                            {items.map((item, index) => {
                                const isSelected = value === item.value;
                                const isDisabled = item.value === '';

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.option,
                                            isSelected && styles.optionSelected,
                                        ]}
                                        onPress={() => !isDisabled && handleSelect(item.value)}
                                        activeOpacity={0.6}
                                        disabled={isDisabled}
                                    >
                                        <View style={styles.optionLeft}>
                                            {item.icon && (
                                                <View style={[
                                                    styles.optionIconWrapper,
                                                    isSelected && {backgroundColor: `${COLORS.primary}12`},
                                                ]}>
                                                    <Ionicons
                                                        name={item.icon}
                                                        size={18}
                                                        color={isSelected ? COLORS.primary : COLORS.gray400}
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
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={18}
                                                color={COLORS.primary}
                                            />
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
    container: {},

    // Label
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.gray400,
        marginBottom: 6,
    },

    // Trigger button
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.gray50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        paddingHorizontal: 12,
        height: 46,
    },
    triggerError: {
        borderColor: COLORS.error,
    },
    triggerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    triggerText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.light.text,
        flex: 1,
    },
    placeholder: {
        color: COLORS.gray500,
        fontWeight: '400',
    },
    errorText: {
        fontSize: 11,
        color: COLORS.error,
        marginTop: 5,
        fontWeight: '400',
    },

    // Bottom sheet
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '60%',
        paddingBottom: 32,
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: COLORS.gray200,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    sheetTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.3,
    },
    closeBtn: {
        width: 30,
        height: 30,
        borderRadius: 9,
        backgroundColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Options
    optionsList: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
        gap: 4,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 11,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        minHeight: 46,
    },
    optionSelected: {
        backgroundColor: `${COLORS.primary}08`,
        borderColor: `${COLORS.primary}25`,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1,
    },
    optionIconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.light.text,
        flex: 1,
    },
    optionTextSelected: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    optionTextDisabled: {
        color: COLORS.gray300,
    },
});

export default CustomPicker;