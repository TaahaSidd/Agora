import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Image} from 'expo-image';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';
import {THEME} from '../utils/theme';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/100';

const ProfileSection = ({
                            user,
                            profileImage,
                            onPress,
                            verified = true,
                            buttonLabel = 'View Profile',
                            onButtonPress = () => {
                            },
                        }) => (
    <TouchableOpacity style={styles.profileCard} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.avatarContainer}>
            <Image
                source={{uri: profileImage || user?.avatar || DEFAULT_AVATAR}}
                style={styles.avatar}
                cachePolicy="disk"
            />
            {verified && (
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success}/>
                </View>
            )}
        </View>

        <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
                {user?.name || user?.username}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={1}>
                {user?.email}
            </Text>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.dark.textTertiary}/>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing.md,
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        marginBottom: THEME.spacing.lg,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: THEME.spacing[3],
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.dark.cardElevated,
        borderWidth: 2,
        borderColor: COLORS.dark.border,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: COLORS.dark.card,
        borderRadius: 12,
    },
    profileInfo: {
        flex: 1,
        marginRight: THEME.spacing[2],
    },
    profileName: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[1],
        letterSpacing: THEME.letterSpacing.tight,
    },
    profileEmail: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
    },
});

export default ProfileSection;