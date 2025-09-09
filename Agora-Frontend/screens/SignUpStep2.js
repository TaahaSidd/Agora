import React, { useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';

export default function SignUpStep2({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);

    const onNext = () => {
        if (!form.email.trim() || !form.mobile.trim() || !form.idCard.trim()) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }
        // Basic email validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(form.email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return;
        }
        navigation.navigate('SignUpStep3');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Step 2: Contact Info</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={text => updateForm('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={form.mobile}
                onChangeText={text => updateForm('mobile', text)}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="ID Card Number"
                value={form.idCard}
                onChangeText={text => updateForm('idCard', text)}
                autoCapitalize="characters"
            />

            <View style={styles.buttonsRow}>
                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
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
    buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 15,
        borderRadius: 6,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    backButton: { backgroundColor: COLORS.gray },
    buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
});
