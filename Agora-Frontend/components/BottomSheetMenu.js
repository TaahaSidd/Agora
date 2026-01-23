import React from 'react';
import {Modal, Platform, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const BottomSheetMenu = ({
                             visible,
                             onClose,
                             type = 'user',
                             onShare,
                             onReport,
                             onBlock,
                             title = 'Options',
                             isGuest,
                             onAuthRequired,
                         }) => {
    const insets = useSafeAreaInsets();

    const handleAction = (item) => {
        if (item.label.includes('Share')) {
            onClose();
            item.action?.();
            return;
        }
        if (isGuest) {
            onClose();
            onAuthRequired?.();
            return;
        }
        onClose();
        item.action?.();
    };

    const userOptions = [
        {
            label: 'Share Profile',
            description: 'Share with your friends',
            icon: 'share-outline',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            action: onShare,
        },
        {
            label: 'Report User',
            description: 'Report inappropriate behavior',
            icon: 'flag-outline',
            iconBg: '#FEF3C7',
            iconColor: '#F59E0B',
            action: onReport,
        },
        {
            label: 'Block User',
            description: "You won't see their content",
            icon: 'ban-outline',
            iconBg: '#FEE2E2',
            iconColor: '#EF4444',
            labelColor: '#EF4444',
            action: onBlock,
        },
    ];

    const listingOptions = [
        {
            label: 'Share Listing',
            description: 'Share this listing with others',
            icon: 'share-outline',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            action: onShare,
        },
        {
            label: 'Report Listing',
            description: 'Report inappropriate content',
            icon: 'flag-outline',
            iconBg: '#FEF3C7',
            iconColor: '#F59E0B',
            action: onReport,
        },
    ];

    const options = (type === 'user' ? userOptions : listingOptions).filter(item => item.action !== null && item.action !== undefined);


    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[
                    styles.bottomSheet,
                    {paddingBottom: Math.max(insets.bottom, 24)}
                ]}>
                    <View style={styles.sheetHandle}/>
                    <View style={styles.sheetHeader}>
                        <Text style={styles.sheetTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#6B7280"/>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuOptions}>
                        {options.map((item, index) => (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.menuOption,
                                        (isGuest && !item.label.includes('Share')) && {opacity: 0.6}
                                    ]}
                                    onPress={() => handleAction(item)}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.menuIconCircle,
                                            {backgroundColor: item.iconBg},
                                        ]}
                                    >
                                        <Ionicons name={item.icon} size={22} color={item.iconColor}/>
                                    </View>
                                    <View style={styles.menuTextContainer}>
                                        <Text
                                            style={[
                                                styles.menuTitle,
                                                item.labelColor ? {color: item.labelColor} : {},
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                        <Text style={styles.menuDescription}>{item.description}</Text>
                                    </View>
                                    {isGuest && !item.label.includes('Share') ? (
                                        <Ionicons name="lock-closed" size={18} color="#9CA3AF"/>
                                    ) : (
                                        <Ionicons name="chevron-forward" size={20} color="#D1D5DB"/>
                                    )}
                                </TouchableOpacity>
                                {index !== options.length - 1 && <View style={styles.menuDivider}/>}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        // Using a softer semi-transparent black for light mode
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        // Pure white background for the sheet
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 28, // Slightly more rounded for premium feel
        borderTopRightRadius: 28,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    sheetHandle: {
        width: 36,
        height: 5,
        // Using light border color for the drag handle
        backgroundColor: COLORS.light.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light.border,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.light.text,
        letterSpacing: -0.5,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.light.bg, // Soft gray background
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuOptions: {
        paddingTop: 4,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    menuIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        // Background colors are provided in the options array (e.g., #DBEAFE)
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.light.text,
        marginBottom: 1,
    },
    menuDescription: {
        fontSize: 13,
        color: COLORS.light.textSecondary,
        fontWeight: '500',
    },
    menuDivider: {
        height: 1,
        backgroundColor: COLORS.light.border,
        marginHorizontal: 20,
        opacity: 0.6,
    },
});

export default BottomSheetMenu;
