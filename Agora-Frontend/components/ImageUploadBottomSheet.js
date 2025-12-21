import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Platform,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';


//use custom button.
const ImageUploadBottomSheet = ({
    visible,
    onClose,
    onCamera,
    onGallery,
    title = 'Upload ID Card',
}) => {
    const options = [
        {
            label: 'Take Photo',
            description: 'Use camera to capture ID card',
            icon: 'camera',
            iconBg: '#DBEAFE',
            iconColor: '#3B82F6',
            action: onCamera,
        },
        {
            label: 'Choose from Gallery',
            description: 'Select from your photos',
            icon: 'images',
            iconBg: '#D1FAE5',
            iconColor: '#10B981',
            action: onGallery,
        },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.bottomSheet}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.sheetHandle} />

                    <View style={styles.sheetHeader}>
                        <View>
                            <Text style={styles.sheetTitle}>{title}</Text>
                            <Text style={styles.sheetSubtitle}>
                                Choose how to upload your ID card
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={22} color={COLORS.dark.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.menuOptions}>
                        {options.map((item, index) => (
                            <React.Fragment key={index}>
                                <TouchableOpacity
                                    style={styles.menuOption}
                                    onPress={() => {
                                        onClose();
                                        setTimeout(() => item.action?.(), 300);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.menuIconCircle,
                                            { backgroundColor: item.iconBg },
                                        ]}
                                    >
                                        <Ionicons name={item.icon} size={24} color={item.iconColor} />
                                    </View>
                                    <View style={styles.menuTextContainer}>
                                        <Text style={styles.menuTitle}>{item.label}</Text>
                                        <Text style={styles.menuDescription}>
                                            {item.description}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={20}
                                        color={COLORS.dark.textTertiary}
                                    />
                                </TouchableOpacity>
                                {index !== options.length - 1 && (
                                    <View style={styles.menuDivider} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.dark.overlayHeavy,
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: COLORS.dark.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    sheetHandle: {
        width: 40,
        height: 4,
        backgroundColor: COLORS.dark.divider,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.divider,
    },
    sheetTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 4,
    },
    sheetSubtitle: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '400',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuOptions: {
        paddingTop: 8,
        paddingBottom: 12,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    menuIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark.text,
        marginBottom: 3,
        letterSpacing: -0.2,
    },
    menuDescription: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        fontWeight: '400',
        lineHeight: 19,
    },
    menuDivider: {
        height: 1,
        backgroundColor: COLORS.dark.divider,
        marginHorizontal: 20,
    },
    cancelButton: {
        marginHorizontal: 20,
        marginTop: 8,
        paddingVertical: 16,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.dark.text,
        letterSpacing: -0.2,
    },
});

export default ImageUploadBottomSheet;