import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SignUpContext } from '../context/SignUpContext';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { getColleges } from '../services/api';

export default function SignUpStep3({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [colleges, setColleges] = useState([]);
    const [query, setQuery] = useState(form.collegeName || '');
    const [filteredColleges, setFilteredColleges] = useState([]);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const data = await getColleges();
                const mapped = Array.isArray(data)
                    ? data.map((c) => ({
                        id: String(c.id),
                        collegeName: c.collegeName,
                    }))
                    : [];
                setColleges(mapped);
                console.log("Colleges fetched:", mapped);
            } catch (error) {
                console.error("Error fetching colleges:", error.message || error);
            }
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        if (query.length > 0 && !selected) {
            const filtered = colleges.filter(c =>
                c.collegeName.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredColleges(filtered);
        } else {
            setFilteredColleges([]);
        }
    }, [query, colleges, selected]);

    const onNext = () => {
        if (!form.collegeId) {
            Alert.alert('Validation Error', 'Please select a valid college from the dropdown.');
            return;
        }
        if (!form.idCardNo || form.idCardNo.trim() === '') {
            Alert.alert('Validation Error', 'Please enter your College ID Card Number.');
            return;
        }
        navigation.navigate('SignUpStep4');
    };

    const handleCollegeSelect = (college) => {
        setQuery(college.collegeName);
        updateForm('collegeName', college.collegeName);
        updateForm('collegeId', college.id);
        setSelected(true);
        setFilteredColleges([]);
    };

    return (
        <LinearGradient
            colors={['#EFF6FF', '#DBEAFE', '#BFDBFE']}
            style={{ flex: 1 }}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.inner}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    scrollEnabled={!selected && filteredColleges.length === 0}
                >
                    {/* Header */}
                    <View style={styles.headerSection}>
                        <Text style={styles.mainHeader}>College Info</Text>
                        <Text style={styles.subHeader}>Tell us about your institution</Text>
                    </View>

                    {/* College Search */}
                    <View style={styles.dropdownWrapper}>
                        <InputField
                            label="College"
                            placeholder="Search your college"
                            value={query}
                            onChangeText={text => {
                                setSelected(false);
                                setQuery(text);
                                updateForm('collegeId', null);
                            }}
                            leftIcon="school-outline"
                        />

                        {filteredColleges.length > 0 && (
                            <View style={styles.dropdown}>
                                {/* Header */}
                                <View style={styles.dropdownHeader}>
                                    <Text style={styles.dropdownHeaderText}>
                                        {filteredColleges.length} {filteredColleges.length === 1 ? 'college' : 'colleges'} found
                                    </Text>
                                </View>
                                <FlatList
                                    data={filteredColleges}
                                    keyExtractor={(item) => item.id}
                                    nestedScrollEnabled={true}
                                    scrollEnabled={true}
                                    style={{ maxHeight: 200 }}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.dropdownItem,
                                                index === filteredColleges.length - 1 && styles.dropdownItemLast
                                            ]}
                                            onPress={() => handleCollegeSelect(item)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.dropdownIconContainer}>
                                                <Ionicons name="school" size={18} color={COLORS.primary} />
                                            </View>
                                            <Text style={styles.dropdownText} numberOfLines={2}>
                                                {item.collegeName}
                                            </Text>
                                            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )}

                    </View>

                    {/* College ID */}
                    <InputField
                        label="College ID Card Number"
                        placeholder="Enter your college ID"
                        value={form.idCardNo || ''}
                        onChangeText={value => updateForm('idCardNo', value)}
                        leftIcon="card-outline"
                    />

                    {/* Step Indicator */}
                    <View style={styles.stepIndicator}>
                        <View style={styles.stepDot} />
                        <View style={styles.stepDot} />
                        <View style={[styles.stepDot, styles.stepDotActive]} />
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
                        />
                    </View>
                </ScrollView>
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
        flexGrow: 1,
        padding: 20,
        // paddingTop: 60,
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
    dropdownWrapper: {
        position: 'relative',
        zIndex: 999,
        // marginBottom: 20,
    },
    dropdown: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        maxHeight: 240,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        zIndex: 999,
        borderWidth: 2,
        borderColor: COLORS.primary,
        overflow: 'hidden',
        elevation: 10,
    },
    dropdownHeader: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    dropdownHeaderText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 12,
    },
    dropdownItemLast: {
        borderBottomWidth: 0,
    },
    dropdownIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.black,
        fontWeight: '500',
        lineHeight: 20,
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