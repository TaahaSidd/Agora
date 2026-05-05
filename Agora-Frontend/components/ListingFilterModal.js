import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import Button from './Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ListingFilterModal = ({
    visible,
    onClose,
    onApply,
    onReset,
    filters: { selectedCategory, selectedCondition, priceRange, sortBy },
    setters: { setSelectedCategory, setSelectedCondition, setPriceRange, setSortBy },
    options: { categories, conditions, priceRanges, sortOptions },
}) => {
    const [activeTab, setActiveTab] = useState('sort');

    const tabs = [
        { key: 'sort', label: 'Sort By' },
        { key: 'price', label: 'Price' },
        { key: 'category', label: 'Category' },
        { key: 'condition', label: 'Condition' },
    ];

    const getActiveData = () => {
        switch (activeTab) {
            case 'sort': return sortOptions;
            case 'price': return priceRanges;
            case 'category': return categories;
            case 'condition': return conditions;
            default: return [];
        }
    };

    const isSelected = (itemId) => {
        if (activeTab === 'sort') return sortBy === itemId;
        if (activeTab === 'price') return priceRange === itemId;
        if (activeTab === 'category') return selectedCategory === itemId;
        if (activeTab === 'condition') return selectedCondition === itemId;
        return false;
    };

    const handleSelect = (itemId) => {
        if (activeTab === 'sort') setSortBy(itemId);
        if (activeTab === 'price') setPriceRange(itemId);
        if (activeTab === 'category') setSelectedCategory(itemId);
        if (activeTab === 'condition') setSelectedCondition(itemId);
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <Pressable style={styles.overlayDismiss} onPress={onClose} />

                <View style={styles.sheet}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Filters & Sort</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.6}>
                            <Ionicons name="close" size={16} color={COLORS.gray400} />
                        </TouchableOpacity>
                    </View>

                    {/* Split view */}
                    <View style={styles.split}>
                        {/* Left tabs */}
                        <View style={styles.leftCol}>
                            {tabs.map((tab) => {
                                const active = activeTab === tab.key;
                                return (
                                    <Pressable
                                        key={tab.key}
                                        onPress={() => setActiveTab(tab.key)}
                                        style={[styles.tabItem, active && styles.tabItemActive]}
                                    >
                                        <Text style={[
                                            styles.tabText,
                                            { color: active ? COLORS.primary : COLORS.gray400 },
                                        ]}>
                                            {tab.label}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>

                        {/* Right options */}
                        <View style={styles.rightCol}>
                            <FlatList
                                data={getActiveData()}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 4 }}
                                renderItem={({ item }) => {
                                    const selected = isSelected(item.id);
                                    return (
                                        <TouchableOpacity
                                            style={styles.optionRow}
                                            onPress={() => handleSelect(item.id)}
                                            activeOpacity={0.6}
                                        >
                                            <View style={styles.optionLeft}>
                                                {item.icon && (
                                                    <Ionicons
                                                        name={item.icon}
                                                        size={14}
                                                        color={selected ? COLORS.primary : COLORS.gray400}
                                                        style={styles.optionIcon}
                                                    />
                                                )}
                                                <Text style={[
                                                    styles.optionText,
                                                    selected && styles.optionTextSelected,
                                                ]}>
                                                    {item.name}
                                                </Text>
                                            </View>
                                            <View style={[
                                                styles.checkbox,
                                                selected && styles.checkboxSelected,
                                            ]}>
                                                {selected && (
                                                    <Ionicons name="checkmark" size={10} color={COLORS.white} />
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Button
                            title="Reset"
                            variant="secondary"
                            onPress={onReset}
                            style={{ flex: 1 }}
                        />
                        <Button
                            title="Apply Filters"
                            variant="primary"
                            onPress={onApply}
                            style={{ flex: 2 }}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    overlayDismiss: {
        flex: 1,
    },
    sheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: SCREEN_HEIGHT * 0.58,
        paddingBottom: 8,
    },

    // Handle
    handle: {
        width: 36,
        height: 4,
        backgroundColor: COLORS.gray200,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    title: {
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

    // Split
    split: {
        flex: 1,
        flexDirection: 'row',
    },
    leftCol: {
        width: '30%',
        backgroundColor: COLORS.gray50,
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: COLORS.gray100,
    },
    tabItem: {
        paddingVertical: 16,
        paddingHorizontal: 14,
    },
    tabItemActive: {
        backgroundColor: COLORS.white,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
    },
    tabText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Options
    rightCol: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.gray100,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIcon: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.gray400,
    },
    optionTextSelected: {
        color: COLORS.light.text,
        fontWeight: '600',
    },
    checkbox: {
        width: 16,
        height: 16,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: COLORS.gray200,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },

    // Footer
    footer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 28,
        gap: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.gray100,
    },

});

export default ListingFilterModal;