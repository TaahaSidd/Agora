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
    Dimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { getColleges } from '../services/api';

const { width } = Dimensions.get('window');

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
                    ? data.map((c, index) => ({
                        id: index.toString(),
                        collegeName: c.collegeName,
                    }))
                    : [];

                setColleges(mapped);
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
        if (!query.trim()) {
            Alert.alert('Validation Error', 'Please select your college.');
            return;
        }
        if (!form.collegeId) {
            Alert.alert('Validation Error', 'Please select a valid college from the list.');
            return;
        }
        if (!form.idCardNo || form.idCardNo.trim() === '') {
            Alert.alert('Validation Error', 'Please enter your College ID Card Number.');
            return;
        }
        updateForm('collegeName', query);
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
                <View style={{ marginBottom: 20, position: 'relative', zIndex: 999 }}>
                    <InputField
                        label="College"
                        placeholder="Enter college name"
                        value={query}
                        onChangeText={text => {
                            setSelected(false);
                            setQuery(text);
                        }}
                    />

                    {filteredColleges.length > 0 && (
                        <View style={styles.dropdown}>
                            <FlatList
                                data={filteredColleges}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={() => handleCollegeSelect(item)}
                                    >
                                        <Text style={styles.dropdownText}>{item.collegeName}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>

                <InputField
                    label="College ID Card Number"
                    placeholder="Enter your college ID card number"
                    value={form.idCardNo || ''}
                    onChangeText={value => updateForm('idCardNo', value)}
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
    dropdown: {
        position: 'absolute',
        top: 65,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        maxHeight: 150,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        zIndex: 999,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownText: { fontSize: 16, color: COLORS.black },
    buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});
