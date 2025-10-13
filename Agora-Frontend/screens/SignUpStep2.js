import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';

const { width } = Dimensions.get('window');

export default function SignUpStep2({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);

    const onNext = () => {
        if (!form.userEmail?.trim() || !form.mobileNumber?.trim()) {
            alert('Please fill all fields.');
            return;
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(form.userEmail)) {
            alert('Please enter a valid email address.');
            return;
        }
        navigation.navigate('SignUpStep3');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                <Text style={styles.header}>Sign-up</Text>

                <InputField
                    label="Email"
                    placeholder="Enter your email"
                    value={form.userEmail}
                    onChangeText={text => updateForm('userEmail', text)}
                    keyboardType="email-address"
                />
                <InputField
                    label="Mobile Number"
                    placeholder="Enter your mobile number"
                    value={form.mobileNumber}
                    onChangeText={text => updateForm('mobileNumber', text)}
                    keyboardType="phone-pad"
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
                        title="Next"
                        onPress={onNext}
                        variant="primary"
                        style={{ flex: 1, marginLeft: 10 }}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    wavyBackground: { position: 'absolute', top: 0 },
    inner: { flex: 1, justifyContent: 'center', padding: 20 },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: COLORS.black,
        alignSelf: 'center',
        marginBottom: 36,
        marginTop: 20
    },
    buttonsRow: { flexDirection: 'row', marginTop: 20 },
});
