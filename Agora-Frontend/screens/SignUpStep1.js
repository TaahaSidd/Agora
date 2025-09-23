import React, { useContext } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function SignUpStep1({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);

    const onNext = () => {
        if (!form.firstName.trim() || !form.lastName.trim() || !form.username.trim()) {
            alert('Please fill all fields.');
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

                <InputField
                    placeholder="First Name"
                    value={form.firstName}
                    onChangeText={text => updateForm('firstName', text)}
                    autoCapitalize="words"
                />
                <InputField
                    placeholder="Last Name"
                    value={form.lastName}
                    onChangeText={text => updateForm('lastName', text)}
                    autoCapitalize="words"
                />
                <InputField
                    placeholder="Username"
                    value={form.username}
                    onChangeText={text => updateForm('username', text)}
                    autoCapitalize="none"
                />

                <Button
                    title="Next"
                    onPress={onNext}
                    variant="primary"
                    style={{ marginTop: 20 }}
                />
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
});
