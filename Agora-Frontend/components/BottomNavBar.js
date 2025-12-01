// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { COLORS } from '../utils/colors';

// import ModalComponent from './Modal';

// const BottomNavBar = ({ active, onNavigate, isGuest }) => {
//     const navigation = useNavigation();
//     const [modalVisible, setModalVisible] = useState(false);

//     const handleAddPress = () => {
//         if (isGuest) {
//             setModalVisible(true);
//             return;
//         }
//         navigation.navigate('AddListingScreen');
//     };

//     const NavItem = ({ name, icon, iconType, label, screen }) => {
//         const isActive = active === screen;

//         const renderIcon = () => {
//             const iconColor = isActive ? COLORS.primary : '#9CA3AF';
//             const iconSize = 24;

//             switch (iconType) {
//                 case 'FontAwesome5':
//                     return <FontAwesome5 name={icon} size={iconSize} color={iconColor} />;
//                 case 'MaterialIcons':
//                     return <MaterialIcons name={icon} size={iconSize} color={iconColor} />;
//                 case 'Feather':
//                     return <Feather name={icon} size={iconSize} color={iconColor} />;
//                 case 'Ionicons':
//                 default:
//                     return <Ionicons name={icon} size={iconSize} color={iconColor} />;
//             }
//         };

//         return (
//             <TouchableOpacity
//                 style={styles.navItem}
//                 onPress={() => onNavigate(screen)}
//                 activeOpacity={0.7}
//             >
//                 <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
//                     {renderIcon()}
//                 </View>
//                 <Text style={[styles.label, isActive && styles.activeLabel]}>
//                     {label}
//                 </Text>
//                 {isActive && <View style={styles.activeIndicator} />}
//             </TouchableOpacity>
//         );
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.innerContainer}>
//                 <NavItem
//                     screen="Explore"
//                     icon="home"
//                     iconType="FontAwesome5"
//                     label="Home"
//                 />

//                 <NavItem
//                     screen="Activity"
//                     icon="timeline"
//                     iconType="MaterialIcons"
//                     label="Activity"
//                 />

//                 {/* Center Add Button Placeholder */}
//                 <View style={styles.centerPlaceholder} />

//                 <NavItem
//                     screen="Chats"
//                     icon="message-square"
//                     iconType="Feather"
//                     label="Chats"
//                 />

//                 <NavItem
//                     screen="Settings"
//                     icon="settings-outline"
//                     iconType="Ionicons"
//                     label="Settings"
//                 />
//             </View>

//             {/* Floating Add Button */}
//             <View style={styles.centerButtonWrapper}>
//                 <TouchableOpacity
//                     style={styles.centerButton}
//                     activeOpacity={0.85}
//                     onPress={handleAddPress}
//                 >
//                     <View style={styles.centerButtonInner}>
//                         <Ionicons name="add" size={28} color="#fff" />
//                     </View>
//                 </TouchableOpacity>
//             </View>

//             <ModalComponent
//                 visible={modalVisible}
//                 type="warning"
//                 title="Login Required"
//                 message="You need to login to add a listing."
//                 primaryButtonText="Login"
//                 secondaryButtonText="Cancel"
//                 onPrimaryPress={() => {
//                     setModalVisible(false);
//                     navigation.replace('Login');
//                 }}
//                 onSecondaryPress={() => setModalVisible(false)}
//                 onClose={() => setModalVisible(false)}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         position: 'relative',
//         backgroundColor: 'transparent',
//     },
//     innerContainer: {
//         flexDirection: 'row',
//         height: 80,
//         backgroundColor: '#fff',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//         paddingHorizontal: 8,
//         elevation: 8,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowOffset: { width: 0, height: -4 },
//         shadowRadius: 12,
//         borderTopLeftRadius: 24,
//         borderTopRightRadius: 24,
//         paddingBottom: 8,
//         paddingTop: 8,
//     },
//     navItem: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative',
//     },
//     iconContainer: {
//         width: 44,
//         height: 44,
//         borderRadius: 22,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'transparent',
//     },
//     iconContainerActive: {
//         backgroundColor: '#dcebffff',
//     },
//     label: {
//         fontSize: 11,
//         color: '#9CA3AF',
//         marginTop: 4,
//         fontWeight: '600',
//         letterSpacing: 0.2,
//     },
//     activeLabel: {
//         color: COLORS.primary,
//         fontWeight: '700',
//     },
//     activeIndicator: {
//         position: 'absolute',
//         bottom: -8,
//         width: 60,
//         height: 4,
//         borderRadius: 2,
//         backgroundColor: COLORS.primary,
//     },
//     centerPlaceholder: {
//         width: 70,
//     },
//     centerButtonWrapper: {
//         position: 'absolute',
//         top: -18,
//         left: '50%',
//         marginLeft: -32,
//         zIndex: 10,
//     },
//     centerButton: {
//         width: 64,
//         height: 64,
//         borderRadius: 32,
//         backgroundColor: '#fff',
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 1,
//     },
//     centerButtonInner: {
//         width: 56,
//         height: 56,
//         borderRadius: 28,
//         backgroundColor: COLORS.primary,
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 1,
//     },
// });

// export default BottomNavBar;


import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

import ModalComponent from './Modal';

const BottomNavBar = ({ active, onNavigate, isGuest }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleAddPress = () => {
        if (isGuest) {
            setModalVisible(true);
            return;
        }
        navigation.navigate('AddListingScreen');
    };

    const NavItem = ({ name, icon, iconType, label, screen }) => {
        const isActive = active === screen;

        const renderIcon = () => {
            const iconColor = isActive ? COLORS.primary : COLORS.gray400;
            const iconSize = THEME.iconSize.lg;

            switch (iconType) {
                case 'FontAwesome5':
                    return <FontAwesome5 name={icon} size={iconSize} color={iconColor} />;
                case 'MaterialIcons':
                    return <MaterialIcons name={icon} size={iconSize} color={iconColor} />;
                case 'Feather':
                    return <Feather name={icon} size={iconSize} color={iconColor} />;
                case 'Ionicons':
                default:
                    return <Ionicons name={icon} size={iconSize} color={iconColor} />;
            }
        };

        return (
            <TouchableOpacity
                style={styles.navItem}
                onPress={() => onNavigate(screen)}
                activeOpacity={THEME.opacity.pressed}
            >
                <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                    {renderIcon()}
                </View>
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                    {label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <NavItem
                    screen="Explore"
                    icon="home"
                    iconType="FontAwesome5"
                    label="Home"
                />

                <NavItem
                    screen="Activity"
                    icon="timeline"
                    iconType="MaterialIcons"
                    label="Activity"
                />

                {/* Center Add Button Placeholder */}
                <View style={styles.centerPlaceholder} />

                <NavItem
                    screen="Chats"
                    icon="message-square"
                    iconType="Feather"
                    label="Chats"
                />

                <NavItem
                    screen="Settings"
                    icon="settings-outline"
                    iconType="Ionicons"
                    label="Settings"
                />
            </View>

            {/* Floating Add Button */}
            <View style={styles.centerButtonWrapper}>
                <TouchableOpacity
                    style={styles.centerButton}
                    activeOpacity={THEME.opacity.hover}
                    onPress={handleAddPress}
                >
                    <View style={styles.centerButtonInner}>
                        <Ionicons name="add" size={THEME.iconSize['2xl']} color={COLORS.white} />
                    </View>
                </TouchableOpacity>
            </View>

            <ModalComponent
                visible={modalVisible}
                type="warning"
                title="Login Required"
                message="You need to login to add a listing."
                primaryButtonText="Login"
                secondaryButtonText="Cancel"
                onPrimaryPress={() => {
                    setModalVisible(false);
                    navigation.replace('Login');
                }}
                onSecondaryPress={() => setModalVisible(false)}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: COLORS.transparent,
    },
    innerContainer: {
        flexDirection: 'row',
        height: THEME.layout.tabBarHeight,
        backgroundColor: COLORS.dark.card,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing[2],
        borderTopLeftRadius: THEME.borderRadius['2xl'],
        borderTopRightRadius: THEME.borderRadius['2xl'],
        paddingBottom: THEME.spacing[2],
        paddingTop: THEME.spacing[2],
        borderTopWidth: THEME.borderWidth.hairline,
        borderTopColor: COLORS.dark.border,
        ...THEME.shadows.lg,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    iconContainer: {
        width: THEME.layout.minTouchTarget,
        height: THEME.layout.minTouchTarget,
        borderRadius: THEME.layout.minTouchTarget / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.transparent,
    },
    iconContainerActive: {
    },
    label: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.gray400,
        marginTop: THEME.spacing[1],
        fontWeight: THEME.fontWeight.semibold,
        letterSpacing: THEME.letterSpacing.wide,
    },
    activeLabel: {
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.bold,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -THEME.spacing[2],
        width: 60,
        height: THEME.spacing[1],
        borderRadius: THEME.borderRadius.xs,
        backgroundColor: COLORS.primary,
    },
    centerPlaceholder: {
        width: 70,
    },
    centerButtonWrapper: {
        position: 'absolute',
        top: -18,
        left: '50%',
        marginLeft: -32,
        zIndex: THEME.zIndex.fixed,
    },
    centerButton: {
        width: 64,
        height: 64,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.dark.cardElevated,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: THEME.borderWidth.thick,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.md,
    },
    centerButtonInner: {
        width: 56,
        height: 56,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.primary,
    },
});

export default BottomNavBar;