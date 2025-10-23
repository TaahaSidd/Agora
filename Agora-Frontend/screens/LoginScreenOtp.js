import React, { useState, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { getAuth, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { BASE_URL } from "../services/api";

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [loading, setLoading] = useState(false);
    const recaptchaVerifier = useRef(null);

    const formatPhoneNumber = (number) => {
        let trimmed = number.trim();
        if (trimmed.startsWith("+91")) return trimmed;
        if (trimmed.startsWith("0")) trimmed = trimmed.substring(1);
        return `+91${trimmed}`;
    };

    const sendOtp = async () => {
        const formattedNumber = formatPhoneNumber(phoneNumber);

        if (!/^\+91[6-9]\d{9}$/.test(formattedNumber)) {
            Alert.alert("Invalid Number", "Please enter a valid Indian mobile number starting with 6,7,8 or 9.");
            return;
        }


        try {
            setLoading(true);
            const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, recaptchaVerifier.current);
            setVerificationId(confirmationResult.verificationId);
            Alert.alert("OTP Sent", `OTP sent to ${formattedNumber}`);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!verificationId) {
            Alert.alert("Error", "Please request an OTP first.");
            return;
        }

        try {
            setLoading(true);
            const credential = PhoneAuthProvider.credential(verificationId, otp);
            const userCredential = await signInWithCredential(auth, credential);
            const firebaseToken = await userCredential.user.getIdToken();

            // Send Firebase token to your backend
            const response = await fetch(`${BASE_URL}/auth/login/otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firebaseToken }),
            });

            if (!response.ok) throw new Error("Backend login failed");

            const data = await response.json();
            Alert.alert("Success", `Welcome back, ${data.userName || "User"}!`);
            console.log("JWT:", data.jwt);
        } catch (error) {
            console.error(error);
            Alert.alert("Verification failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={auth.app.options} />
            <View style={styles.container}>
                <Text style={styles.heading}>Login with Phone Number</Text>

                <Text style={styles.countryPrefix}>+91</Text>
                <TextInput
                    style={styles.input}
                    placeholder="5XXXXXXXX"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    maxLength={10}
                />

                {!verificationId ? (
                    <Button title="Send OTP" onPress={sendOtp} color="#007BFF" disabled={loading} />
                ) : (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter OTP"
                            keyboardType="numeric"
                            value={otp}
                            onChangeText={setOtp}
                            maxLength={6}
                        />
                        <Button title="Verify OTP" onPress={verifyOtp} color="#28A745" disabled={loading} />
                    </>
                )}

                {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#fff" },
    container: { flex: 1, justifyContent: "center", padding: 20 },
    heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
    countryPrefix: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
        backgroundColor: "#fff",
    },
});

export default LoginScreen;
