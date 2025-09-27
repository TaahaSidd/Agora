import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Modal } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleLogout = () => {
        setLogoutModalVisible(false);
        navigation.replace('Login');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', paddingTop: StatusBar.currentHeight || 20 }}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <Text style={styles.header}>Settings</Text>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity
                        style={styles.accountItem}
                        onPress={() => navigation.navigate('UserProfileScreen')}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/100' }}
                            style={styles.profilePic}
                        />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text style={styles.accountName}>John Doe</Text>
                            <Text style={styles.accountEmail}>john@example.com</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Options */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.optionItem}>
                        <FontAwesome5 name="heart" size={22} color="#555" />
                        <Text style={styles.optionText}>Favorites</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem}>
                        <FontAwesome5 name="heart" size={22} color="#555" />
                        <Text style={styles.optionText}>My Listings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="language-outline" size={22} color="#555" />
                        <Text style={styles.optionText}>Language</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="location-outline" size={22} color="#555" />
                        <Text style={styles.optionText}>Location</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem}>
                        <MaterialIcons name="help-outline" size={22} color="#555" />
                        <Text style={styles.optionText}>FAQ</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="headset-outline" size={22} color="#555" />
                        <Text style={styles.optionText}>Support</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => setLogoutModalVisible(true)}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Logout Modal */}
            <Modal
                transparent
                visible={logoutModalVisible}
                animationType="fade"
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>See you soon!</Text>
                        <Text style={styles.modalText}>You are about to logout.</Text>
                        <View style={styles.modalButtons}>
                            {/* Cancel */}
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            {/* Confirm */}
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.confirmText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 12,
    },
    accountItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    accountName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    accountEmail: {
        fontSize: 14,
        color: '#777',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        marginBottom: 12,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#000',
    },
    logoutButton: {
        marginTop: 20,
        paddingVertical: 15,
        borderRadius: 10,
        backgroundColor: '#FF4D4D',
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 25,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 25,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#FF4D4D',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginLeft: 15,
    },
    confirmText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    cancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        color: '#FF4D4D',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SettingsScreen;

//fix the issue of modal and safeareView color.