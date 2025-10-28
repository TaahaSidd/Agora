import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/100';

const ProfileSection = ({
    user,
    profileImage,
    onPress,
    verified = true,
    buttonLabel = 'View Profile',
    onButtonPress = () => { },
}) => (
    <TouchableOpacity style={styles.profileCard} onPress={onPress} activeOpacity={0.7}>
        <View style={{ position: 'relative' }}>
            <View style={styles.profileImageContainer}>
                <Image
                    source={{ uri: profileImage || user?.avatar || DEFAULT_AVATAR }}
                    style={styles.profilePic}
                    cachePolicy="disk"
                />
            </View>
            {verified && (
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                </View>
            )}
        </View>

        <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
                {user?.name || user?.username || 'Your Name'}
            </Text>
            <Text style={styles.profileEmail}>
                {user?.email || 'email@example.com'}
            </Text>
            <TouchableOpacity style={styles.viewProfileBadge} onPress={onButtonPress}>
                <Text style={styles.viewProfileText}>{buttonLabel}</Text>
                <Ionicons name="arrow-forward" size={12} color={COLORS.primary} />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    profileImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    profilePic: {
        width: '130%',
        height: '100%',
        resizeMode: 'cover',
        marginRight: 6,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 4,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 16,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    viewProfileBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    viewProfileText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
        marginRight: 4,
    },
});

export default ProfileSection;
