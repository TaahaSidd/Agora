import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import { apiPost } from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

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
                userName: form.userName,
                firstName: form.firstName,
                lastName: form.lastName,
                mobileNumber: form.mobileNumber,
                userEmail: form.userEmail,
                idCardNo: form.idCardNo,
                collegeId: form.collegeId,
                password: form.password,
            };

            const data = await apiPost('/auth/register', body);
            Alert.alert('Success', 'Account created successfully!');
            navigation.replace('Mainlayout');
        } catch (error) {
            Alert.alert('Signup Failed', error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <Svg
                height="400"
                width={width}
                viewBox={`0 0 ${width} 400`}
                style={styles.wavyBackground}
            >
                <Path
                    d={`M0 250 C ${width * 0.25} 350, ${width * 0.75} 150, ${width} 250 L ${width} 0 L0 0 Z`}
                    fill={COLORS.primary}
                />
            </Svg>
            <View style={styles.inner}>
                <Text style={styles.title}>Set Your Password</Text>
                <InputField
                    label="Password"
                    placeholder="Enter password"
                    value={form.password}
                    onChangeText={text => updateForm('password', text)}
                    secureTextEntry
                    autoCapitalize="none"
                />
                <InputField
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChangeText={text => updateForm('confirmPassword', text)}
                    secureTextEntry
                    autoCapitalize="none"
                    style={{ marginBottom: 20 }}
                />

                <View style={styles.buttonsRow}>
                    <Button
                        title="Back"
                        onPress={() => navigation.goBack()}
                        variant="secondary"
                        style={{ flex: 1, marginRight: 10 }}
                        textStyle={{ color: COLORS.primary }}
                    />
                    <Button
                        title={loading ? '' : 'Submit'}
                        onPress={onSubmit}
                        variant="primary"
                        style={{ flex: 1, marginLeft: 10 }}
                    >
                        {loading && <ActivityIndicator color={COLORS.white} />}
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    wavyBackground: { position: 'absolute', top: 0 },
    inner: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 22, fontWeight: '600', color: COLORS.black, marginBottom: 20, textAlign: 'center' },
    buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
