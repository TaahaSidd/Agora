import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';

export default function SignUpStep1({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);

    const onNext = () => {
        if (!form.firstName.trim() || !form.lastName.trim() || !form.username.trim()) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }
        navigation.navigate('SignUpStep2');
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: COLORS.darkBlue }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Step 1: Personal Info</Text>

                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={form.firstName}
                    onChangeText={text => updateForm('firstName', text)}
                    autoCapitalize="words"
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={form.lastName}
                    onChangeText={text => updateForm('lastName', text)}
                    autoCapitalize="words"
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={form.username}
                    onChangeText={text => updateForm('username', text)}
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />

                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 30,
        alignSelf: 'center',
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginBottom: 20,
        fontSize: 16,
        color: '#000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
