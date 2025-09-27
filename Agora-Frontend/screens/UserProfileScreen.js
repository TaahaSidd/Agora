import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const UserProfileScreen = ({ navigation }) => {
    const user = {
        firstName: 'John',
        lastName: 'Doe',
        username: 'johnnyd',
        email: 'john@example.com',
        phone: '+1234567890',
        dob: '01/01/1990',
        idCard: 'ID12345678',
        college: 'Amity University',
        profilePic: 'https://i.pravatar.cc/150',
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: StatusBar.currentHeight || 20 }}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color={COLORS.black} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 24 }} /> {/* alignment placeholder */}
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Top section: Profile pic + Name/Email */}
                <View style={styles.topSection}>
                    <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                        {/* Reusable Button */}
                        <Button
                            title="Edit Profile"
                            variant="primary"
                            onPress={() => navigation.navigate('EditProfileScreen')}
                            style={{ marginTop: 10, paddingVertical: 12 }}
                        />
                    </View>
                </View>

                {/* Your Info Section */}
                <Text style={styles.sectionTitle}>Your Information</Text>
                <View style={styles.infoContainer}>
                    {/* First + Last Name side by side */}
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            value={user.firstName}
                            editable={false}
                            placeholder="First Name"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            value={user.lastName}
                            editable={false}
                            placeholder="Last Name"
                        />
                    </View>

                    <TextInput style={styles.input} value={user.username} editable={false} placeholder="Username" />
                    <TextInput style={styles.input} value={user.email} editable={false} placeholder="Email" />
                    <TextInput style={styles.input} value={user.phone} editable={false} placeholder="Phone Number" />
                    <TextInput style={styles.input} value={user.idCard} editable={false} placeholder="ID Card Number" />
                    <TextInput style={styles.input} value={user.college} editable={false} placeholder="College" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.black },
    container: { padding: THEME.spacing.lg },
    topSection: { flexDirection: 'row', marginBottom: 24, alignItems: 'center' },
    profilePic: { width: 100, height: 100, borderRadius: THEME.borderRadius.full },
    name: { fontSize: 20, fontWeight: '700', color: COLORS.black },
    email: { fontSize: 16, color: COLORS.gray, marginVertical: 4 },
    sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: COLORS.black },
    infoContainer: { marginBottom: 30 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: THEME.borderRadius.md,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        color: COLORS.gray,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        flex: 1,
        marginRight: 8,
    },
});

export default UserProfileScreen;
