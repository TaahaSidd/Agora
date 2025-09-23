import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';

const BottomNavBar = ({ active, setActive }) => {
    return (
        <View style={styles.container}>
            {/* Home */}
            <TouchableOpacity style={styles.navItem} onPress={() => setActive('Home')}>
                <FontAwesome5
                    name="home"
                    size={24}
                    color={active === 'Home' ? '#0066FF' : '#8e8e93'}
                    solid={active === 'Home'}
                />
                <Text style={[styles.label, active === 'Home' && styles.activeLabel]}>Home</Text>
            </TouchableOpacity>

            {/* Activity */}
            <TouchableOpacity style={styles.navItem} onPress={() => setActive('Activity')}>
                <MaterialIcons
                    name="timeline"
                    size={24}
                    color={active === 'Activity' ? '#0066FF' : '#8e8e93'}
                />
                <Text style={[styles.label, active === 'Activity' && styles.activeLabel]}>Activity</Text>
            </TouchableOpacity>

            {/* Center Plus Button */}
            <View style={styles.centerButtonWrapper}>
                <TouchableOpacity
                    style={styles.centerButton}
                    onPress={() => alert('Plus Action!')}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Chats */}
            <TouchableOpacity style={styles.navItem} onPress={() => setActive('Chats')}>
                <Feather
                    name="message-square"
                    size={24}
                    color={active === 'Chats' ? '#0066FF' : '#8e8e93'}
                />
                <Text style={[styles.label, active === 'Chats' && styles.activeLabel]}>Chats</Text>
            </TouchableOpacity>

            {/* Settings */}
            <TouchableOpacity style={styles.navItem} onPress={() => setActive('Settings')}>
                <Ionicons
                    name="settings-outline"
                    size={24}
                    color={active === 'Settings' ? '#0066FF' : '#8e8e93'}
                />
                <Text style={[styles.label, active === 'Settings' && styles.activeLabel]}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: '#000000ff',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 0,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.01,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 6,
    },
    navItem: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    label: {
        fontSize: 12,
        color: '#8e8e93',
        marginTop: 3,
        fontWeight: '500',
    },
    activeLabel: {
        color: '#0066FF',
        fontWeight: '700',
    },
    centerButtonWrapper: {
        width: 70,
        alignItems: 'center',
        marginTop: -40,
    },
    centerButton: {
        backgroundColor: '#0066FF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
    },
});

export default BottomNavBar;
