import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/100';

const ProfileSection = ({ user, profileImage, onPress, verified = true }) => (
    <TouchableOpacity
        style={styles.profileCard}
        onPress={onPress}
        activeOpacity={0.6}
    >
        <View style={styles.avatarContainer}>
            <Image
                source={{ uri: profileImage || user?.avatar || DEFAULT_AVATAR }}
                style={styles.avatar}
                cachePolicy="disk"
            />
            {verified && (
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                </View>
            )}
        </View>

        <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
                {user?.firstName
                    ? `${user.firstName} ${user.lastName || ''}`
                    : user?.name || user?.username || 'User'}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
                {user?.email || 'No email provided'}
            </Text>
        </View>

        <Ionicons name="chevron-forward" size={14} color={COLORS.gray300} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.gray100,
        gap: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: COLORS.gray100,
        borderWidth: 1,
        borderColor: COLORS.gray100,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -3,
        right: -3,
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 1,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.light.text,
        letterSpacing: -0.3,
        marginBottom: 2,
    },
    profileEmail: {
        fontSize: 12,
        color: COLORS.gray400,
        fontWeight: '400',
    },
});

export default ProfileSection;