import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Feather, FontAwesome5, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../utils/colors';
import {useChatRooms} from '../hooks/useChatRooms';
import {useUserStore} from '../stores/userStore';

import ModalComponent from './Modal';

const BottomNavBar = ({active, onNavigate, isGuest, isPending}) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const insets = useSafeAreaInsets();

    const {currentUser} = useUserStore();
    const {chatRooms} = useChatRooms(currentUser?.email);

    const hasUnreadChats = React.useMemo(() => {
        if (!chatRooms || !currentUser?.email) return false;

        const sanitizedEmail = currentUser.email.replace(/\./g, '_');

        return chatRooms.some(chat => {
            const lastRead = chat.lastRead?.[sanitizedEmail];
            const lastMessage = chat.lastMessage;

            if (!lastMessage) return false;


            const isMyMessage = lastMessage.senderId === currentUser.email;
            if (isMyMessage) return false;

            if (!lastRead) return true;

            if (lastMessage.createdAt && lastRead) {
                const lastMessageTime = lastMessage.createdAt.seconds || 0;
                const lastReadTime = lastRead.seconds || 0;
                return lastMessageTime > lastReadTime;
            }

            return false;
        });
    }, [chatRooms, currentUser]);

    const handleAddPress = () => {
        if (isGuest) {
            setModalVisible(true);
            return;
        }

        if (isPending) {
            setModalVisible(true);
            return;
        }

        navigation.navigate('AddListingScreen');
    };

    const NavItem = ({name, icon, iconType, label, screen, showBadge}) => {
        const isActive = active === screen;

        const renderIcon = () => {
            const iconColor = isActive ? COLORS.primary : COLORS.gray400;
            const iconSize = 24;

            switch (iconType) {
                case 'FontAwesome5':
                    return <FontAwesome5 name={icon} size={iconSize} color={iconColor}/>;
                case 'MaterialIcons':
                    return <MaterialIcons name={icon} size={iconSize} color={iconColor}/>;
                case 'Feather':
                    return <Feather name={icon} size={iconSize} color={iconColor}/>;
                case 'Ionicons':
                default:
                    return <Ionicons name={icon} size={iconSize} color={iconColor}/>;
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
                    {showBadge && (
                        <View style={styles.badge}/>
                    )}
                </View>
                <Text style={[styles.label, isActive && styles.activeLabel]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.wrapper, {paddingBottom: Math.max(insets.bottom, 20)}]}>
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
                    <View style={styles.centerPlaceholder}/>

                    <NavItem
                        screen="Chats"
                        icon="message-square"
                        iconType="Feather"
                        label="Chats"
                        showBadge={hasUnreadChats}
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
                            <Ionicons name="add" size={32} color={COLORS.white}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <ModalComponent
                visible={modalVisible}
                type="warning"
                title={isGuest ? "Login Required" : "Complete Your Profile"}
                message={isGuest
                    ? "You need to login to add a listing."
                    : "Please complete your profile to start selling items."}
                primaryButtonText={isGuest ? "Login" : "Complete Profile"}
                secondaryButtonText="Cancel"
                onPrimaryPress={() => {
                    setModalVisible(false);
                    if (isGuest) {
                        navigation.replace('Login');
                    } else {
                        navigation.navigate('EditListingScreen');
                    }
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
        // UPDATED: Now pure white to pop against the gray background
        backgroundColor: COLORS.white,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.light.border,
        // UPDATED: Softer shadows for light mode
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 8,
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
        position: 'relative',
    },
    iconContainerActive: {
        // Subtle blue tint for the active background
        backgroundColor: COLORS.primary + '10',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        // Match the container background
        borderColor: COLORS.white,
    },
    label: {
        fontSize: 10,
        color: COLORS.light.textTertiary,
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
        // UPDATED: Matches the floating bar
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        // Match the Screen background (off-white) to look seamless
        borderColor: COLORS.light.bg,
        elevation: 2,
    },
    centerButtonInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
});;

export default BottomNavBar;