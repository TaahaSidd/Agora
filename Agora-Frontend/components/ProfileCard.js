import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

export default function ProfileCard({ user, type = 'settings', onPress }) {
    const isSettings = type === 'settings';

    return (
        <TouchableOpacity
            style={[styles.card, isSettings ? styles.settingsCard : styles.profileCard]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.profileImageContainer}>
                <Image
                    source={
                        user.profilePic
                            ? { uri: user.profilePic }
                            : require('../assets/adaptive-icon.png')
                    }
                    style={[styles.profilePic, isSettings ? styles.settingsPic : styles.profilePic]}
                />
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={isSettings ? 12 : 14} color="#fff" />
                </View>
            </View>

            <View style={styles.profileInfo}>
                <Text style={[styles.nameText, isSettings ? styles.settingsName : null]}>
                    {user.firstName} {user.lastName}
                </Text>

                {isSettings ? (
                    <View style={styles.viewProfileBadge}>
                        <Text style={styles.viewProfileText}>View Profile</Text>
                        <Ionicons name="arrow-forward" size={12} color={COLORS.primary} />
                    </View>
                ) : (
                    <>
                        <View style={styles.emailRow}>
                            <Ionicons name="mail-outline" size={14} color="#6B7280" />
                            <Text style={styles.emailText}>{user.userEmail}</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    settingsCard: {
        padding: 16,
    },
    profileCard: {},
    profileImageContainer: {
        position: 'relative',
    },
    profilePic: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#F3F4F6',
        borderWidth: 3,
        borderColor: '#F3F4F6',
    },
    settingsPic: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
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
    nameText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    settingsName: {
        fontSize: 20,
        marginBottom: 4,
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    emailText: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 6,
        fontWeight: '500',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    editButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 14,
        marginLeft: 6,
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
