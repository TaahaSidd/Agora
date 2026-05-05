import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const USER_OPTIONS = (onShare, onReport, onBlock) => [
    {
        label: 'Share Profile',
        desc: 'Share with your friends',
        icon: 'share-outline',
        color: '#3B82F6',
        action: onShare,
    },
    {
        label: 'Report User',
        desc: 'Report inappropriate behavior',
        icon: 'flag-outline',
        color: '#F59E0B',
        action: onReport,
    },
    {
        label: 'Block User',
        desc: "You won't see their content",
        icon: 'ban-outline',
        color: COLORS.error,
        action: onBlock,
    },
];

const LISTING_OPTIONS = (onShare, onReport) => [
    {
        label: 'Share Listing',
        desc: 'Share this listing with others',
        icon: 'share-outline',
        color: '#3B82F6',
        action: onShare,
    },
    {
        label: 'Report Listing',
        desc: 'Report inappropriate content',
        icon: 'flag-outline',
        color: '#F59E0B',
        action: onReport,
    },
];

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

    const allOptions = type === 'user'
        ? USER_OPTIONS(onShare, onReport, onBlock)
        : LISTING_OPTIONS(onShare, onReport);

    const options = allOptions.filter(o => o.action != null);

    const handleAction = (item) => {
        if (isGuest && !item.label.includes('Share')) {
            onClose();
            onAuthRequired?.();
            return;
        }
        onClose();
        item.action?.();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.6}>
                            <Ionicons name="close" size={16} color={COLORS.gray400} />
                        </TouchableOpacity>
                    </View>

                    {/* Options */}
                    <View style={styles.options}>
                        {options.map((item, index) => {
                            const locked = isGuest && !item.label.includes('Share');
                            const isLast = index === options.length - 1;
                            return (
                                <React.Fragment key={index}>
                                    <TouchableOpacity
                                        style={[styles.option, locked && { opacity: 0.5 }]}
                                        onPress={() => handleAction(item)}
                                        activeOpacity={0.6}
                                    >
                                        <View style={[styles.iconWrapper, { backgroundColor: `${item.color}12` }]}>
                                            <Ionicons name={item.icon} size={18} color={item.color} />
                                        </View>
                                        <View style={styles.optionText}>
                                            <Text style={[styles.optionLabel, { color: item.color === COLORS.error ? COLORS.error : COLORS.light.text }]}>
                                                {item.label}
                                            </Text>
                                            <Text style={styles.optionDesc}>{item.desc}</Text>
                                        </View>
                                        <Ionicons
                                            name={locked ? 'lock-closed' : 'chevron-forward'}
                                            size={14}
                                            color={COLORS.gray300}
                                        />
                                    </TouchableOpacity>
                                    {!isLast && <View style={styles.divider} />}
                                </React.Fragment>
                            );
                        })}
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
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

    // Options
    options: {
        paddingVertical: 4,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    iconWrapper: {
        width: 38,
        height: 38,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        flex: 1,
        gap: 2,
    },
    optionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
    },
    optionDesc: {
        fontSize: 11,
        color: COLORS.gray400,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.gray100,
        marginHorizontal: 16,
    },
});

export default BottomSheetMenu;