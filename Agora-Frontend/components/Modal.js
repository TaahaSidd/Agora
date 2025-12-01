// import React from 'react';
// import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';

// import Button from './Button';

// import { COLORS } from '../utils/colors';
// import { THEME } from '../utils/theme';

// const ModalComponent = ({
//     visible,
//     type = 'success',
//     title,
//     message,
//     icon,
//     iconSize = 50,
//     iconColor,
//     iconBgColor,
//     primaryButtonText,
//     secondaryButtonText,
//     onPrimaryPress,
//     onSecondaryPress,
//     onClose,
// }) => {
//     const getConfig = () => {
//         switch (type) {
//             case 'success':
//                 return {
//                     icon: icon || 'checkmark-circle',
//                     iconColor: iconColor || '#10B981',
//                     iconBgColor: iconBgColor || '#D1FAE5',
//                     title: title || 'Success!',
//                     primaryButtonText: primaryButtonText || 'Continue',
//                     primaryButtonColor: COLORS.primary,
//                     showSecondary: false,
//                 };
//             case 'warning':
//                 return {
//                     icon: icon || 'alert-circle',
//                     iconColor: iconColor || '#F59E0B',
//                     iconBgColor: iconBgColor || '#FEF3C7',
//                     title: title || 'Warning',
//                     primaryButtonText: primaryButtonText || 'Yes, Continue',
//                     secondaryButtonText: secondaryButtonText || 'Cancel',
//                     primaryButtonColor: '#F59E0B',
//                     showSecondary: true,
//                 };
//             case 'error':
//                 return {
//                     icon: icon || 'close-circle',
//                     iconColor: iconColor || '#EF4444',
//                     iconBgColor: iconBgColor || '#FEE2E2',
//                     title: title || 'Error',
//                     primaryButtonText: primaryButtonText || 'Try Again',
//                     secondaryButtonText: secondaryButtonText || 'Cancel',
//                     primaryButtonColor: '#EF4444',
//                     showSecondary: true,
//                 };
//             case 'confirm':
//                 return {
//                     icon: icon || 'help-circle',
//                     iconColor: iconColor || COLORS.primary,
//                     iconBgColor: iconBgColor || '#EFF6FF',
//                     title: title || 'Confirm Action',
//                     primaryButtonText: primaryButtonText || 'Confirm',
//                     secondaryButtonText: secondaryButtonText || 'Cancel',
//                     primaryButtonColor: COLORS.primary,
//                     showSecondary: true,
//                 };
//             case 'delete':
//                 return {
//                     icon: icon || 'trash',
//                     iconColor: iconColor || '#EF4444',
//                     iconBgColor: iconBgColor || '#FEE2E2',
//                     title: title || 'Delete Item?',
//                     primaryButtonText: primaryButtonText || 'Yes, Delete',
//                     secondaryButtonText: secondaryButtonText || 'Cancel',
//                     primaryButtonColor: '#EF4444',
//                     showSecondary: true,
//                 };
//             case 'logout':
//                 return {
//                     icon: icon || 'log-out-outline',
//                     iconColor: iconColor || '#EF4444',
//                     iconBgColor: iconBgColor || '#FEE2E2',
//                     title: title || 'Logout?',
//                     primaryButtonText: primaryButtonText || 'Logout',
//                     secondaryButtonText: secondaryButtonText || 'Cancel',
//                     primaryButtonColor: '#EF4444',
//                     showSecondary: true,
//                 };
//             default:
//                 return {
//                     icon: icon || 'information-circle',
//                     iconColor: iconColor || COLORS.primary,
//                     iconBgColor: iconBgColor || '#EFF6FF',
//                     title: title || 'Information',
//                     primaryButtonText: primaryButtonText || 'OK',
//                     primaryButtonColor: COLORS.primary,
//                     showSecondary: false,
//                 };
//         }
//     };

//     const config = getConfig();

//     const handlePrimaryPress = () => {
//         if (onPrimaryPress) {
//             onPrimaryPress();
//         } else if (onClose) {
//             onClose();
//         }
//     };

//     const handleSecondaryPress = () => {
//         if (onSecondaryPress) {
//             onSecondaryPress();
//         } else if (onClose) {
//             onClose();
//         }
//     };

//     return (
//         <Modal
//             transparent
//             visible={visible}
//             animationType="fade"
//             onRequestClose={onClose}
//         >
//             <View style={styles.overlay}>
//                 <View style={styles.container}>
//                     {/* Icon */}
//                     <View
//                         style={[
//                             styles.iconContainer,
//                             { backgroundColor: config.iconBgColor }
//                         ]}
//                     >
//                         <Ionicons
//                             name={config.icon}
//                             size={iconSize}
//                             color={config.iconColor}
//                         />
//                     </View>

//                     {/* Title */}
//                     <Text style={styles.title}>{config.title}</Text>

//                     {/* Message */}
//                     {message && (
//                         <Text style={styles.message}>{message}</Text>
//                     )}

//                     {/* Buttons */}
//                     <View style={styles.buttonsContainer}>
//                         {config.showSecondary && (
//                             <Button
//                                 title={config.secondaryButtonText}
//                                 variant="secondary"
//                                 size="medium"
//                                 onPress={handleSecondaryPress}
//                                 style={styles.secondaryButton}
//                                 textStyle={styles.secondaryButtonText}
//                             />
//                         )}
//                         <Button
//                             title={config.primaryButtonText}
//                             variant="primary"
//                             size="medium"
//                             onPress={handlePrimaryPress}
//                             style={[
//                                 styles.primaryButton,
//                                 { backgroundColor: config.primaryButtonColor },
//                                 config.showSecondary && styles.buttonWithSecondary
//                             ]}
//                             textStyle={styles.primaryButtonText}
//                         />
//                     </View>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0,0,0,0.6)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     container: {
//         width: '85%',
//         backgroundColor: '#fff',
//         borderRadius: 24,
//         padding: 28,
//         alignItems: 'center',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 8 },
//         shadowOpacity: 0.2,
//         shadowRadius: 16,
//         elevation: 10,
//     },
//     iconContainer: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: '800',
//         color: '#111827',
//         marginBottom: 8,
//         textAlign: 'center',
//     },
//     message: {
//         fontSize: 15,
//         color: '#6B7280',
//         textAlign: 'center',
//         marginBottom: 28,
//         lineHeight: 22,
//         fontWeight: '500',
//     },
//     buttonsContainer: {
//         flexDirection: 'row',
//         width: '100%',
//         gap: 12,
//     },
//     primaryButton: {
//         flex: 1,
//     },
//     buttonWithSecondary: {
//         // Style when secondary button is present
//     },
//     primaryButtonText: {
//         color: '#fff',
//         fontWeight: '700',
//         fontSize: 15,
//     },
//     secondaryButton: {
//         flex: 1,
//         // paddingVertical: 14,
//         // borderRadius: 14,
//         backgroundColor: '#F3F4F6',
//     },
//     secondaryButtonText: {
//         color: '#6B7280',
//         fontWeight: '700',
//         fontSize: 15,
//     },
// });

// export default ModalComponent;



import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from './Button';

import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const ModalComponent = ({
    visible,
    type = 'success',
    title,
    message,
    icon,
    iconSize = 50,
    iconColor,
    iconBgColor,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryPress,
    onSecondaryPress,
    onClose,
}) => {
    const getConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: icon || 'checkmark-circle',
                    iconColor: iconColor || COLORS.success,
                    iconBgColor: iconBgColor || COLORS.successBg,
                    title: title || 'Success!',
                    primaryButtonText: primaryButtonText || 'Continue',
                    primaryButtonColor: COLORS.primary,
                    showSecondary: false,
                };
            case 'warning':
                return {
                    icon: icon || 'alert-circle',
                    iconColor: iconColor || COLORS.warning,
                    iconBgColor: iconBgColor || COLORS.warningBg,
                    title: title || 'Warning',
                    primaryButtonText: primaryButtonText || 'Yes, Continue',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    primaryButtonColor: COLORS.warning,
                    showSecondary: true,
                };
            case 'error':
                return {
                    icon: icon || 'close-circle',
                    iconColor: iconColor || COLORS.error,
                    iconBgColor: iconBgColor || COLORS.errorBg,
                    title: title || 'Error',
                    primaryButtonText: primaryButtonText || 'Try Again',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    primaryButtonColor: COLORS.error,
                    showSecondary: true,
                };
            case 'confirm':
                return {
                    icon: icon || 'help-circle',
                    iconColor: iconColor || COLORS.primary,
                    iconBgColor: iconBgColor || COLORS.primaryLightest,
                    title: title || 'Confirm Action',
                    primaryButtonText: primaryButtonText || 'Confirm',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    primaryButtonColor: COLORS.primary,
                    showSecondary: true,
                };
            case 'delete':
                return {
                    icon: icon || 'trash',
                    iconColor: iconColor || COLORS.error,
                    iconBgColor: iconBgColor || COLORS.errorBg,
                    title: title || 'Delete Item?',
                    primaryButtonText: primaryButtonText || 'Yes, Delete',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    primaryButtonColor: COLORS.error,
                    showSecondary: true,
                };
            case 'logout':
                return {
                    icon: icon || 'log-out-outline',
                    iconColor: iconColor || COLORS.error,
                    iconBgColor: iconBgColor || COLORS.errorBg,
                    title: title || 'Logout?',
                    primaryButtonText: primaryButtonText || 'Logout',
                    secondaryButtonText: secondaryButtonText || 'Cancel',
                    primaryButtonColor: COLORS.error,
                    showSecondary: true,
                };
            default:
                return {
                    icon: icon || 'information-circle',
                    iconColor: iconColor || COLORS.primary,
                    iconBgColor: iconBgColor || COLORS.primaryLightest,
                    title: title || 'Information',
                    primaryButtonText: primaryButtonText || 'OK',
                    primaryButtonColor: COLORS.primary,
                    showSecondary: false,
                };
        }
    };

    const config = getConfig();

    const handlePrimaryPress = () => {
        if (onPrimaryPress) {
            onPrimaryPress();
        } else if (onClose) {
            onClose();
        }
    };

    const handleSecondaryPress = () => {
        if (onSecondaryPress) {
            onSecondaryPress();
        } else if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Icon */}
                    <View
                        style={[
                            styles.iconContainer,
                            { backgroundColor: config.iconBgColor }
                        ]}
                    >
                        <Ionicons
                            name={config.icon}
                            size={iconSize}
                            color={config.iconColor}
                        />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{config.title}</Text>

                    {/* Message */}
                    {message && (
                        <Text style={styles.message}>{message}</Text>
                    )}

                    {/* Buttons */}
                    <View style={styles.buttonsContainer}>
                        {config.showSecondary && (
                            <Button
                                title={config.secondaryButtonText}
                                variant="secondary"
                                size="medium"
                                onPress={handleSecondaryPress}
                                style={styles.secondaryButton}
                                textStyle={styles.secondaryButtonText}
                            />
                        )}
                        <Button
                            title={config.primaryButtonText}
                            variant="primary"
                            size="medium"
                            onPress={handlePrimaryPress}
                            style={[
                                styles.primaryButton,
                                { backgroundColor: config.primaryButtonColor },
                                config.showSecondary && styles.buttonWithSecondary
                            ]}
                            textStyle={styles.primaryButtonText}
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
        backgroundColor: COLORS.dark.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.xl,
        padding: THEME.spacing['2xl'] - 8,
        alignItems: 'center',
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
        ...THEME.shadows['2xl'],
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: THEME.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.lg,
    },
    title: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[2],
        textAlign: 'center',
        letterSpacing: THEME.letterSpacing.tight,
    },
    message: {
        fontSize: THEME.fontSize.base,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        marginBottom: THEME.spacing['2xl'] - 4,
        lineHeight: THEME.fontSize.base * THEME.lineHeight.relaxed,
        fontWeight: THEME.fontWeight.medium,
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: THEME.spacing.md,
    },
    primaryButton: {
        flex: 1,
    },
    buttonWithSecondary: {
        // Style when secondary button is present
    },
    primaryButtonText: {
        color: COLORS.white,
        fontWeight: THEME.fontWeight.bold,
        fontSize: THEME.fontSize.base,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    secondaryButtonText: {
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.bold,
        fontSize: THEME.fontSize.base,
    },
});

export default ModalComponent;