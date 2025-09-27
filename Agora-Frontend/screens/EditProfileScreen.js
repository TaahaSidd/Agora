import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const EditProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState({
        firstName: 'John',
        lastName: 'Doe',
        username: 'johnnyd',
        email: 'john@example.com',
        phone: '+1234567890',
        idCard: 'ID12345678',
        college: 'Amity University',
        profilePic: 'https://i.pravatar.cc/150',
    });

    const handleChange = (key, value) => {
        setUser({ ...user, [key]: value });
    };

    const handleSave = () => {
        console.log('Updated user:', user);
        navigation.goBack(); // or API call to save
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: StatusBar.currentHeight || 20 }}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Profile Picture */}
                <TouchableOpacity style={styles.picWrapper}>
                    <Image source={{ uri: user.profilePic }} style={styles.profilePic} />
                    <View style={styles.cameraIcon}>
                        <Ionicons name="camera" size={18} color={COLORS.white} />
                    </View>
                </TouchableOpacity>

                {/* Editable Fields */}
                <View style={styles.form}>
                    {/* First & Last Name */}
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            value={user.firstName}
                            onChangeText={(text) => handleChange('firstName', text)}
                            placeholder="First Name"
                        />
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            value={user.lastName}
                            onChangeText={(text) => handleChange('lastName', text)}
                            placeholder="Last Name"
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        value={user.username}
                        onChangeText={(text) => handleChange('username', text)}
                        placeholder="Username"
                    />
                    <TextInput
                        style={styles.input}
                        value={user.email}
                        onChangeText={(text) => handleChange('email', text)}
                        placeholder="Email"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        value={user.phone}
                        onChangeText={(text) => handleChange('phone', text)}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        value={user.idCard}
                        onChangeText={(text) => handleChange('idCard', text)}
                        placeholder="ID Card Number"
                    />
                    <TextInput
                        style={styles.input}
                        value={user.college}
                        onChangeText={(text) => handleChange('college', text)}
                        placeholder="College"
                    />
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
    saveText: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
    container: { padding: THEME.spacing.lg },
    picWrapper: {
        alignSelf: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    profilePic: {
        width: 120,
        height: 120,
        borderRadius: THEME.borderRadius.full,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        borderRadius: THEME.borderRadius.full,
        padding: 6,
    },
    form: { marginBottom: 40 },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: THEME.borderRadius.md,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: '#f5f5f5',
        color: COLORS.black,
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

export default EditProfileScreen;
