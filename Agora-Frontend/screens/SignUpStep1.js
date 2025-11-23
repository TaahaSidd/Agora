// import React, { useContext } from 'react';

// import {
//     View,
//     Text,
//     StyleSheet,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     Dimensions,
//     TouchableOpacity,
// } from 'react-native';
// import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
// import { SignUpContext } from '../context/SignUpContext';
// import { COLORS } from '../utils/colors';
// import InputField from '../components/InputField';
// import Button from '../components/Button';

// const { width, height } = Dimensions.get('window');

// export default function SignUpStep1({ navigation }) {
//     const { form, updateForm } = useContext(SignUpContext);

//     const onNext = () => {
//         if (!form.firstName.trim() || !form.lastName.trim() || !form.userName.trim()) {
//             alert('Please fill all fields.');
//             return;
//         }
//         navigation.navigate('SignUpStep2');
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
//                     <Text style={styles.welcomeText}>Welcome to</Text>
//                     <Text style={styles.title}>Agora</Text>
//                     <Text style={styles.subtitle}>Create your account to get started</Text>
//                 </View>

//                 {/* Form Card */}
//                 <View style={styles.formCard}>
//                     <InputField
//                         label="First Name"
//                         placeholder="Enter your first name"
//                         value={form.firstName}
//                         onChangeText={(text) => updateForm('firstName', text)}
//                         autoCapitalize="words"
//                     />
//                     <InputField
//                         label="Last Name"
//                         placeholder="Enter your last name"
//                         value={form.lastName}
//                         onChangeText={(text) => updateForm('lastName', text)}
//                         autoCapitalize="words"
//                     />
//                     <InputField
//                         label="Username"
//                         placeholder="Username will be auto-generated"
//                         value={form.userName}
//                         editable={false}
//                     />

//                     <Button
//                         title="Next"
//                         onPress={onNext}
//                         variant="primary"
//                         style={styles.nextButton}
//                     />
//                 </View>

//                 {/* Step Indicator */}
//                 <View style={styles.stepIndicator}>
//                     <View style={[styles.stepDot, styles.stepDotActive]} />
//                     <View style={styles.stepDot} />
//                     <View style={styles.stepDot} />
//                     <View style={styles.stepDot} />
//                 </View>

//                 {/* Already have an account */}
//                 <View style={styles.loginContainer}>
//                     <Text style={styles.loginText}>Already have an account? </Text>
//                     <TouchableOpacity
//                         onPress={() => navigation.navigate('Login')}
//                         activeOpacity={0.7}
//                     >
//                         <Text style={styles.loginLink}>Login</Text>
//                     </TouchableOpacity>
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
//     nextButton: {
//         marginTop: 30,
//         shadowColor: COLORS.primary,
//         shadowOffset: {
//             width: 0,
//             height: 4,
//         },
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//         elevation: 4,
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
//     loginContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         marginTop: 10,
//         marginBottom: 30,
//     },
//     loginText: {
//         color: '#666',
//         fontSize: 15,
//     },
//     loginLink: {
//         color: COLORS.primary,
//         fontSize: 15,
//         fontWeight: '600',
//     },
// });


import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function SignUpStep1({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        const validationErrors = {};
        if (!form.firstName.trim()) validationErrors.firstName = 'First name is required';
        if (!form.lastName.trim()) validationErrors.lastName = 'Last name is required';
        if (!form.userName.trim()) validationErrors.userName = 'Username is required';

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const onNext = () => {
        if (!validateFields()) return;
        navigation.navigate('SignUpStep2');
    };

    return (
        <LinearGradient
            colors={['#EFF6FF', '#DBEAFE', '#BFDBFE']}
            style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.inner}>
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.mainHeader}>Create Account</Text>
                        <Text style={styles.subHeader}>Let's get started with your details</Text>
                    </View>

                    {/* Form */}
                    <InputField
                        label="First Name"
                        placeholder="Enter your first name"
                        value={form.firstName}
                        onChangeText={(text) => {
                            updateForm('firstName', text);
                            setErrors({ ...errors, firstName: null });
                        }}
                        error={errors.firstName}
                        leftIcon="account-outline"
                        autoCapitalize="words"
                    />

                    <InputField
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={form.lastName}
                        onChangeText={(text) => {
                            updateForm('lastName', text);
                            setErrors({ ...errors, lastName: null });
                        }}
                        error={errors.lastName}
                        leftIcon="account-outline"
                        autoCapitalize="words"
                    />

                    <InputField
                        label="Username"
                        placeholder="Auto-generated username"
                        value={form.userName}
                        editable={false}
                        leftIcon="account-outline"
                    />

                    {/* Step Indicator */}
                    <View style={styles.stepIndicator}>
                        <View style={[styles.stepDot, styles.stepDotActive]} />
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                    </View>

                    <Button
                        title="Next"
                        onPress={onNext}
                        variant="primary"
                        fullWidth
                        size="large"
                    />

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginLink}>Login</Text>
                        </TouchableOpacity>
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