import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import AppHeader from '../components/AppHeader';
import { apiGet } from '../services/api';

const UserProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const data = await apiGet('/profile/myProfile');
            setUser(data);
        } catch (error) {
            console.error('Error fetching profile:', error.response?.data || error.message);
            Alert.alert('Error', 'Unable to fetch profile information.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={{ color: COLORS.gray }}>No profile data found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <AppHeader title="My Profile" onBack={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Top Section */}
                <View style={styles.topSection}>
                    <Image
                        source={
                            user.profilePic
                                ? { uri: user.profilePic }
                                : require('../assets/adaptive-icon.png')
                        }
                        style={styles.profilePic}
                    />

                    <View style={styles.profileInfo}>
                        <Text style={styles.nameText}>
                            {user.firstName} {user.lastName}
                        </Text>
                        <Text style={styles.emailText}>{user.userEmail}</Text>

                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditProfileScreen', { user })}
                        >
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Your Information</Text>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        value={user.firstName || ''}
                        editable={false}
                        placeholder="First Name"
                    />
                    <TextInput
                        style={[styles.input, styles.halfInput]}
                        value={user.lastName || ''}
                        editable={false}
                        placeholder="Last Name"
                    />
                </View>

                <TextInput
                    style={styles.input}
                    value={user.userEmail || ''}
                    editable={false}
                    placeholder="Email"
                />
                <TextInput
                    style={styles.input}
                    value={user.mobileNumber || ''}
                    editable={false}
                    placeholder="Phone Number"
                />
                <TextInput
                    style={styles.input}
                    value={user.idCardNo || ''}
                    editable={false}
                    placeholder="ID Card Number"
                />
                <TextInput
                    style={styles.input}
                    value={user.college?.collegeName || 'N/A'}
                    editable={false}
                    placeholder="College"
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 16,
    },
    topSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f9ff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#eaeaea',
    },
    profileInfo: {
        marginLeft: 16,
        flex: 1,
    },
    nameText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
    },
    emailText: {
        fontSize: 14,
        color: COLORS.gray,
        marginVertical: 4,
    },
    editButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    editButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 14,
    },
    sectionTitle: {
        fontWeight: '700',
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 12,
    },
    input: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fafafa',
        color: COLORS.black,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
});

export default UserProfileScreen;
