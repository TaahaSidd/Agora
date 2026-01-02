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
            const iconSize = 24;

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
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                    {renderIcon()}
                </View>
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <NavItem
                        screen="Explore"
                        icon="home"
                        iconType="FontAwesome5"
                        label="Home"
                    />

                    <NavItem
                        screen="My-Listings"
                        icon="layers-outline"
                        iconType="Ionicons"
                        label="My Listings"
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
                        activeOpacity={0.8}
                        onPress={handleAddPress}
                    >
                        <View style={styles.centerButtonInner}>
                            <Ionicons name="add" size={32} color={COLORS.white} />
                        </View>
                    </TouchableOpacity>
                </View>
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
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: COLORS.transparent,
        pointerEvents: 'box-none',
    },
    container: {
        position: 'relative',
        backgroundColor: COLORS.transparent,
    },
    innerContainer: {
        flexDirection: 'row',
        height: 68,
        backgroundColor: COLORS.dark.card,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 16,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.transparent,
        marginBottom: 2,
    },
    iconContainerActive: {
        backgroundColor: COLORS.primary + '15',
    },
    label: {
        fontSize: 11,
        color: COLORS.gray400,
        marginTop: 2,
        fontWeight: '600',
        letterSpacing: -0.2,
    },
    activeLabel: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    centerPlaceholder: {
        width: 64,
    },
    centerButtonWrapper: {
        position: 'absolute',
        top: -22,
        left: '50%',
        marginLeft: -34,
        zIndex: 10,
    },
    centerButton: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: COLORS.dark.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: COLORS.dark.bg,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 12,
    },
    centerButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
});

export default BottomNavBar;