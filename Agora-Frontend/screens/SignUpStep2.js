// import React, { useContext, useState } from 'react';
// import {
//     View,
//     StyleSheet,
//     Dimensions,
//     KeyboardAvoidingView,
//     Platform,
//     Text,
//     ScrollView
// } from 'react-native';
// import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { SignUpContext } from '../context/SignUpContext';
// import { apiGet } from '../services/api';

// import { COLORS } from '../utils/colors';

// import Button from '../components/Button';
// import InputField from '../components/InputField';

// const { width } = Dimensions.get('window');

// export default function SignUpStep2({ navigation }) {
//     const { form, updateForm } = useContext(SignUpContext);
//     const [mobileError, setMobileError] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [checking, setChecking] = useState(false);

//     const checkMobileExists = async (number) => {
//         if (!number) return false;
//         if (number.length < 10) {
//             setMobileError('Mobile number must be 10 digits');
//             return false;
//         }

//         try {
//             setChecking(true);
//             const data = await apiGet('/auth/check', { mobileNumber: number });
//             setMobileError(data.exists ? 'This mobile number is already registered.' : '');
//             setChecking(false);
//             return !data.exists;
//         } catch (err) {
//             console.log('Mobile check error:', err);
//             setChecking(false);
//             return false;
//         }
//     };

//     const checkEmailExists = async (email) => {
//         if (!email) return false;
//         if (!email || !/\S+@\S+\.\S+/.test(email)) return false;

//         try {
//             setChecking(true);
//             const data = await apiGet('/auth/check', { email });
//             setEmailError(data.exists ? 'This email is already registered.' : '');
//             setChecking(false);
//             return !data.exists;
//         } catch (err) {
//             console.log('Email check error:', err);
//             setChecking(false);
//             return false;
//         }
//     };

//     const onNext = async () => {
//         if (!form.userEmail?.trim() || !form.mobileNumber?.trim()) {
//             alert('Please fill all fields.');
//             return;
//         }

//         const emailValid = await checkEmailExists(form.userEmail);
//         const mobileValid = await checkMobileExists(form.mobileNumber);

//         if (!emailValid || !mobileValid) {
//             alert('Credentials already exists.');
//             return;
//         }

//         navigation.navigate('SignUpStep3');
//     };

//     return (
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//             {/* Enhanced Background with Gradient and Decorative Elements */}
//             <Svg
//                 height="450"
//                 width={width}
//                 viewBox={`0 0 ${width} 450`}
//                 style={styles.wavyBackground}
//             >
//                 <Defs>
//                     <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
//                         <Stop offset="0" stopColor={COLORS.primary} stopOpacity="1" />
//                         <Stop offset="1" stopColor={COLORS.primary} stopOpacity="0.85" />
//                     </LinearGradient>
//                 </Defs>

//                 {/* Main wavy shape */}
//                 <Path
//                     d={`M0 280 C ${width * 0.25} 380, ${width * 0.75} 180, ${width} 280 L ${width} 0 L0 0 Z`}
//                     fill="url(#grad)"
//                 />

//                 {/* Decorative circles */}
//                 <Circle cx={width * 0.15} cy="80" r="60" fill={COLORS.white} opacity="0.1" />
//                 <Circle cx={width * 0.85} cy="150" r="80" fill={COLORS.white} opacity="0.08" />
//                 <Circle cx={width * 0.5} cy="50" r="40" fill={COLORS.white} opacity="0.12" />
//             </Svg>

//             <ScrollView
//                 contentContainerStyle={styles.inner}
//                 showsVerticalScrollIndicator={false}
//             >
//                 {/* Welcome Section */}
//                 <View style={styles.headerContainer}>
//                     <Text style={styles.welcomeText}>Step 2 of 3</Text>
//                     <Text style={styles.title}>Contact Details</Text>
//                     <Text style={styles.subtitle}>How can we reach you?</Text>
//                 </View>

//                 {/* Form Card */}
//                 <View style={styles.formCard}>
//                     <InputField
//                         label="Email"
//                         placeholder="Enter your email"
//                         value={form.userEmail}
//                         onChangeText={text => {
//                             updateForm('userEmail', text);
//                             if (/\S+@\S+\.\S+/.test(text)) checkEmailExists(text);
//                         }}
//                         onBlur={() => checkEmailExists(form.userEmail)}
//                         keyboardType="email-address"
//                         autoCapitalize="none"
//                         error={emailError}
//                     />

//                     <InputField
//                         label="Mobile Number"
//                         placeholder="Enter your mobile number"
//                         value={form.mobileNumber}
//                         onChangeText={text => {
//                             const cleaned = text.replace(/\D/g, '').slice(0, 10);
//                             updateForm('mobileNumber', cleaned);
//                             if (cleaned.length === 10) {
//                                 checkMobileExists(String(cleaned));
//                             } else {
//                                 setMobileError('');
//                             }
//                         }}
//                         keyboardType="phone-pad"
//                         error={mobileError}
//                     />

//                     <View style={styles.buttonsRow}>
//                         <Button
//                             title="Back"
//                             onPress={() => navigation.goBack()}
//                             variant="secondary"
//                             style={styles.backButton}
//                             textStyle={{ color: COLORS.primary }}
//                         />
//                         <Button
//                             title="Next"
//                             onPress={onNext}
//                             variant="primary"
//                             style={styles.nextButton}
//                         />
//                     </View>
//                 </View>

//                 {/* Step Indicator */}
//                 <View style={styles.stepIndicator}>
//                     <View style={styles.stepDot} />
//                     <View style={[styles.stepDot, styles.stepDotActive]} />
//                     <View style={styles.stepDot} />
//                     <View style={styles.stepDot} />
//                 </View>
//             </ScrollView>
//         </KeyboardAvoidingView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F8F9FA',
//     },
//     wavyBackground: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//     },
//     inner: {
//         flexGrow: 1,
//         padding: 20,
//         paddingTop: Platform.OS === 'ios' ? 60 : 40,
//     },
//     headerContainer: {
//         marginTop: 40,
//         marginBottom: 30,
//         alignItems: 'center',
//     },
//     welcomeText: {
//         fontSize: 18,
//         color: COLORS.white,
//         opacity: 0.95,
//         marginBottom: 5,
//         fontWeight: '500',
//     },
//     title: {
//         fontSize: 42,
//         fontWeight: 'bold',
//         color: COLORS.white,
//         marginBottom: 8,
//         letterSpacing: 1,
//     },
//     subtitle: {
//         fontSize: 15,
//         color: COLORS.white,
//         opacity: 0.9,
//         textAlign: 'center',
//         paddingHorizontal: 20,
//     },
//     formCard: {
//         backgroundColor: COLORS.white,
//         borderRadius: 24,
//         padding: 24,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 4,
//         },
//         shadowOpacity: 0.1,
//         shadowRadius: 12,
//         elevation: 5,
//         marginBottom: 20,
//     },
//     buttonsRow: {
//         flexDirection: 'row',
//         marginTop: 30,
//         gap: 12,
//     },
//     backButton: {
//         flex: 1,
//     },
//     nextButton: {
//         flex: 1,
//     },
//     stepIndicator: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         gap: 10,
//         marginVertical: 20,
//     },
//     stepDot: {
//         width: 10,
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: '#D0D0D0',
//     },
//     stepDotActive: {
//         backgroundColor: COLORS.primary,
//         width: 30,
//         borderRadius: 5,
//     },
// });

import React, { useContext, useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SignUpContext } from '../context/SignUpContext';
import { apiGet } from '../services/api';

import { COLORS } from '../utils/colors';

import Button from '../components/Button';
import InputField from '../components/InputField';

export default function SignUpStep2({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [mobileError, setMobileError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [checking, setChecking] = useState(false);

    const checkMobileExists = async (number) => {
        if (!number) return false;
        if (number.length < 10) {
            setMobileError('Mobile number must be 10 digits');
            return false;
        }

        try {
            setChecking(true);
            const data = await apiGet('/auth/check', { mobileNumber: number });
            setMobileError(data.exists ? 'This mobile number is already registered.' : '');
            setChecking(false);
            return !data.exists;
        } catch (err) {
            console.log('Mobile check error:', err);
            setChecking(false);
            return false;
        }
    };

    const checkEmailExists = async (email) => {
        if (!email) return false;
        if (!email || !/\S+@\S+\.\S+/.test(email)) return false;

        try {
            setChecking(true);
            const data = await apiGet('/auth/check', { email });
            setEmailError(data.exists ? 'This email is already registered.' : '');
            setChecking(false);
            return !data.exists;
        } catch (err) {
            console.log('Email check error:', err);
            setChecking(false);
            return false;
        }
    };

    const onNext = async () => {
        if (!form.userEmail?.trim() || !form.mobileNumber?.trim()) {
            alert('Please fill all fields.');
            return;
        }

        const emailValid = await checkEmailExists(form.userEmail);
        const mobileValid = await checkMobileExists(form.mobileNumber);

        if (!emailValid || !mobileValid) {
            alert('Credentials already exists.');
            return;
        }

        navigation.navigate('SignUpStep3');
    };

    return (
        <LinearGradient
            colors={['#EFF6FF', '#DBEAFE', '#BFDBFE']}
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.inner}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.mainHeader}>Contact Details</Text>
                        <Text style={styles.subHeader}>How can we reach you?</Text>
                    </View>

                    {/* Form */}
                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        value={form.userEmail}
                        onChangeText={text => {
                            updateForm('userEmail', text);
                            if (/\S+@\S+\.\S+/.test(text)) checkEmailExists(text);
                        }}
                        onBlur={() => checkEmailExists(form.userEmail)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={emailError}
                        leftIcon="email-outline"
                    />

                    <InputField
                        label="Mobile Number"
                        placeholder="Enter your mobile number"
                        value={form.mobileNumber}
                        onChangeText={text => {
                            const cleaned = text.replace(/\D/g, '').slice(0, 10);
                            updateForm('mobileNumber', cleaned);
                            if (cleaned.length === 10) {
                                checkMobileExists(String(cleaned));
                            } else {
                                setMobileError('');
                            }
                        }}
                        keyboardType="phone-pad"
                        error={mobileError}
                        leftIcon="phone-outline"
                    />

                    {/* Step Indicator */}
                    <View style={styles.stepIndicator}>
                        <View style={styles.stepDot} />
                        <View style={[styles.stepDot, styles.stepDotActive]} />
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonsRow}>
                        <Button
                            title="Back"
                            onPress={() => navigation.goBack()}
                            variant="secondary"
                            style={styles.backButton}
                            size="large"
                        />
                        <Button
                            title="Next"
                            onPress={onNext}
                            variant="primary"
                            style={styles.nextButton}
                            size="large"
                            loading={checking}
                            disabled={checking}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    inner: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    headerSection: {
        marginBottom: 30,
    },
    mainHeader: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 2,
    },
    subHeader: {
        fontSize: 20,
        color: COLORS.gray,
        marginBottom: 10,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginVertical: 20,
    },
    stepDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#edf5ffff',
    },
    stepDotActive: {
        backgroundColor: COLORS.primary,
        width: 30,
        borderRadius: 5,
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    backButton: {
        flex: 1,
    },
    nextButton: {
        flex: 1,
    },
});