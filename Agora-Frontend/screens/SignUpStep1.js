// src/screens/SignUpStep1.js
import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
        <View style={styles.container}>
            <Text style={styles.title}>Step 1: Personal Info</Text>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                value={form.firstName}
                onChangeText={text => updateForm('firstName', text)}
                autoCapitalize="words"
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={form.lastName}
                onChangeText={text => updateForm('lastName', text)}
                autoCapitalize="words"
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={form.username}
                onChangeText={text => updateForm('username', text)}
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={onNext}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.darkBlue, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 20, alignSelf: 'center' },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});
