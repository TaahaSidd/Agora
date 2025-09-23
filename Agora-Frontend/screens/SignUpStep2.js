import React, { useContext } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';

export default function SignUpStep2({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);

    const onNext = () => {
        if (!form.email.trim() || !form.mobile.trim()) {
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

            <InputField
                placeholder="Email"
                value={form.email}
                onChangeText={text => updateForm('email', text)}
                keyboardType="email-address"
            />
            <InputField
                placeholder="Mobile Number"
                value={form.mobile}
                onChangeText={text => updateForm('mobile', text)}
                keyboardType="phone-pad"
            />

            <View style={styles.buttonsRow}>
                <Button
                    title="Back"
                    onPress={() => navigation.goBack()}
                    variant="secondary"
                    style={{ flex: 1, marginRight: 10 }}
                    textStyle={{ color: '#fff' }}
                />
                <Button
                    title="Next"
                    onPress={onNext}
                    variant="primary"
                    style={{ flex: 1, marginLeft: 10 }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.darkBlue, padding: 20, justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: 'bold', color: COLORS.white, marginBottom: 30, alignSelf: 'center' },
    buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
