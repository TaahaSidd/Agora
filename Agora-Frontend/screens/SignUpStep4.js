import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';

export default function SignUpStep4({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!form.password || !form.confirmPassword) {
            Alert.alert('Validation Error', 'Please fill all fields.');
            return;
        }
        if (form.password.length < 6) {
            Alert.alert('Validation Error', 'Password must be at least 6 characters.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            Alert.alert('Validation Error', 'Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const body = {
                firstName: form.firstName,
                lastName: form.lastName,
                username: form.username,
                email: form.email,
                mobile: form.mobile,
                idCard: form.idCard,
                college: form.college,
                password: form.password,
            };
            const data = await apiPost('/auth/register', body);
            Alert.alert('Success', 'Account created successfully!');
            navigation.replace('Explore');
        } catch (error) {
            Alert.alert('Signup Failed', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Step 4: Set Password</Text>

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={form.password}
                onChangeText={text => updateForm('password', text)}
                secureTextEntry
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChangeText={text => updateForm('confirmPassword', text)}
                secureTextEntry
                autoCapitalize="none"
            />

            <View style={styles.buttonsRow}>
                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <Text style={styles.buttonText}>Submit</Text>
                    )}
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
