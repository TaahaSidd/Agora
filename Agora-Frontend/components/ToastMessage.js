// import React, { useEffect, useRef } from 'react';
// import { Animated, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { COLORS } from '../utils/colors';

// const ToastMessage = ({
//     type = 'info',
//     title,
//     message,
//     onHide,
//     duration = 3000,
//     position = 'top',
// }) => {
//     const slideAnim = useRef(new Animated.Value(position === 'top' ? -200 : 200)).current;
//     const opacityAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         Animated.parallel([
//             Animated.spring(slideAnim, {
//                 toValue: 0,
//                 tension: 50,
//                 friction: 7,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(opacityAnim, {
//                 toValue: 1,
//                 duration: 300,
//                 useNativeDriver: true,
//             }),
//         ]).start();

//         const timer = setTimeout(() => {
//             hideToast();
//         }, duration);

//         return () => clearTimeout(timer);
//     }, []);

//     const hideToast = () => {
//         Animated.parallel([
//             Animated.timing(slideAnim, {
//                 toValue: position === 'top' ? -200 : 200,
//                 duration: 300,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(opacityAnim, {
//                 toValue: 0,
//                 duration: 300,
//                 useNativeDriver: true,
//             }),
//         ]).start(() => onHide && onHide());
//     };

//     const getToastConfig = () => {
//         switch (type) {
//             case 'success':
//                 return {
//                     icon: 'checkmark-circle',
//                     iconColor: '#10B981',
//                     backgroundColor: '#ECFDF5',
//                     borderColor: '#A7F3D0',
//                     titleColor: '#065F46',
//                     messageColor: '#047857',
//                 };
//             case 'error':
//                 return {
//                     icon: 'close-circle',
//                     iconColor: '#EF4444',
//                     backgroundColor: '#FEF2F2',
//                     borderColor: '#FECACA',
//                     titleColor: '#991B1B',
//                     messageColor: '#DC2626',
//                 };
//             case 'warning':
//                 return {
//                     icon: 'warning',
//                     iconColor: '#F59E0B',
//                     backgroundColor: '#FFFBEB',
//                     borderColor: '#FDE68A',
//                     titleColor: '#92400E',
//                     messageColor: '#D97706',
//                 };
//             case 'info':
//             default:
//                 return {
//                     icon: 'information-circle',
//                     iconColor: '#3B82F6',
//                     backgroundColor: '#EFF6FF',
//                     borderColor: '#DBEAFE',
//                     titleColor: '#1E40AF',
//                     messageColor: '#2563EB',
//                 };
//         }
//     };

//     const config = getToastConfig();

//     return (
//         <Animated.View
//             style={[
//                 styles.container,
//                 position === 'top' ? styles.topPosition : styles.bottomPosition,
//                 {
//                     backgroundColor: config.backgroundColor,
//                     borderColor: config.borderColor,
//                     transform: [{ translateY: slideAnim }],
//                     opacity: opacityAnim,
//                 },
//             ]}
//         >
//             <View style={styles.content}>
//                 <View style={[styles.iconCircle, { backgroundColor: `${config.iconColor}20` }]}>
//                     <Ionicons name={config.icon} size={24} color={config.iconColor} />
//                 </View>

//                 <View style={styles.textContainer}>
//                     {title && (
//                         <Text style={[styles.title, { color: config.titleColor }]}>
//                             {title}
//                         </Text>
//                     )}
//                     {message && (
//                         <Text style={[styles.message, { color: config.messageColor }]}>
//                             {message}
//                         </Text>
//                     )}
//                 </View>

//                 <TouchableOpacity
//                     onPress={hideToast}
//                     style={styles.closeButton}
//                     activeOpacity={0.7}
//                 >
//                     <Ionicons name="close" size={18} color={config.messageColor} />
//                 </TouchableOpacity>
//             </View>

//             {/* Progress bar */}
//             <Animated.View
//                 style={[
//                     styles.progressBar,
//                     {
//                         backgroundColor: config.iconColor,
//                         width: opacityAnim.interpolate({
//                             inputRange: [0, 1],
//                             outputRange: ['0%', '100%'],
//                         }),
//                     },
//                 ]}
//             />
//         </Animated.View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         left: 16,
//         right: 16,
//         borderRadius: 16,
//         borderWidth: 1,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowOffset: { width: 0, height: 4 },
//         shadowRadius: 12,
//         elevation: 8,
//         zIndex: 9999,
//         overflow: 'hidden',
//     },
//     topPosition: {
//         top: Platform.OS === 'ios' ? 80 : 40,
//     },
//     bottomPosition: {
//         bottom: Platform.OS === 'ios' ? 40 : 20,
//     },
//     content: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 16,
//     },
//     iconCircle: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginRight: 12,
//     },
//     textContainer: {
//         flex: 1,
//     },
//     title: {
//         fontWeight: '700',
//         fontSize: 15,
//         marginBottom: 2,
//         letterSpacing: -0.2,
//     },
//     message: {
//         fontSize: 13,
//         lineHeight: 18,
//         fontWeight: '500',
//     },
//     closeButton: {
//         width: 28,
//         height: 28,
//         borderRadius: 14,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginLeft: 8,
//     },
//     progressBar: {
//         height: 3,
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//     },
// });

// export default ToastMessage;




import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const ToastMessage = ({
    type = 'info',
    title,
    message,
    onHide,
    duration = 3000,
    position = 'top',
}) => {
    const slideAnim = useRef(new Animated.Value(position === 'top' ? -200 : 200)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        const timer = setTimeout(() => {
            hideToast();
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: position === 'top' ? -200 : 200,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onHide && onHide());
    };

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'checkmark-circle',
                    iconColor: COLORS.success,
                    backgroundColor: COLORS.dark.cardElevated,
                    borderColor: COLORS.successDark,
                    titleColor: COLORS.successLight,
                    messageColor: COLORS.dark.textSecondary,
                };
            case 'error':
                return {
                    icon: 'close-circle',
                    iconColor: COLORS.error,
                    backgroundColor: COLORS.dark.cardElevated,
                    borderColor: COLORS.errorDark,
                    titleColor: COLORS.errorLight,
                    messageColor: COLORS.dark.textSecondary,
                };
            case 'warning':
                return {
                    icon: 'warning',
                    iconColor: COLORS.warning,
                    backgroundColor: COLORS.dark.cardElevated,
                    borderColor: COLORS.warningDark,
                    titleColor: COLORS.warningLight,
                    messageColor: COLORS.dark.textSecondary,
                };
            case 'info':
            default:
                return {
                    icon: 'information-circle',
                    iconColor: COLORS.info,
                    backgroundColor: COLORS.dark.cardElevated,
                    borderColor: COLORS.infoDark,
                    titleColor: COLORS.infoLight,
                    messageColor: COLORS.dark.textSecondary,
                };
        }
    };

    const config = getToastConfig();

    return (
        <Animated.View
            style={[
                styles.container,
                position === 'top' ? styles.topPosition : styles.bottomPosition,
                {
                    backgroundColor: config.backgroundColor,
                    borderColor: config.borderColor,
                    transform: [{ translateY: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <View style={styles.content}>
                <View style={[styles.iconCircle, { backgroundColor: `${config.iconColor}20` }]}>
                    <Ionicons name={config.icon} size={24} color={config.iconColor} />
                </View>

                <View style={styles.textContainer}>
                    {title && (
                        <Text style={[styles.title, { color: config.titleColor }]}>
                            {title}
                        </Text>
                    )}
                    {message && (
                        <Text style={[styles.message, { color: config.messageColor }]}>
                            {message}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={hideToast}
                    style={styles.closeButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={18} color={COLORS.dark.textTertiary} />
                </TouchableOpacity>
            </View>

            {/* Progress bar */}
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        backgroundColor: config.iconColor,
                        width: opacityAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        borderRadius: 16,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 8,
        zIndex: 9999,
        overflow: 'hidden',
    },
    topPosition: {
        top: Platform.OS === 'ios' ? 80 : 40,
    },
    bottomPosition: {
        bottom: Platform.OS === 'ios' ? 40 : 20,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 2,
        letterSpacing: -0.2,
    },
    message: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '500',
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    progressBar: {
        height: 3,
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});

export default ToastMessage;