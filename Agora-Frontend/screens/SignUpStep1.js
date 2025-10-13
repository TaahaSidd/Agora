import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

export default function SignUpStep1({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);

    const onNext = () => {
        if (!form.firstName.trim() || !form.lastName.trim() || !form.userName.trim()) {
            alert('Please fill all fields.');
            return;
        }
        navigation.navigate('SignUpStep2');
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

            <ScrollView contentContainerStyle={styles.inner}>
                <Text style={styles.title}>Sign Up</Text>

                <InputField
                    label="First Name"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChangeText={(text) => updateForm('firstName', text)}
                    autoCapitalize="words"
                />
                <InputField
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChangeText={(text) => updateForm('lastName', text)}
                    autoCapitalize="words"
                />
                <InputField
                    label="Username"
                    placeholder="Enter your username"
                    value={form.userName}
                    onChangeText={(text) => updateForm('userName', text)}
                    autoCapitalize="none"
                />

                <Button
                    title="Next"
                    onPress={onNext}
                    variant="primary"
                    style={{ marginTop: 30 }}
                />

                {/* Already have an account */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    wavyBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    inner: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.white,
        marginBottom: 30,
        alignSelf: 'center',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    loginText: {
        color: COLORS.black,
        fontSize: 16,
        opacity: 0.7,
    },
    loginLink: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
