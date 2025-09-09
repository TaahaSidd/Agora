import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { SignUpContext } from '../context/SignUpContext';
import { COLORS } from '../utils/colors';

const colleges = [
    'Harvard University',
    'Stanford University',
    'Massachusetts Institute of Technology',
    'University of California, Berkeley',
    'University of Oxford',
    'University of Cambridge',
    'California Institute of Technology',
    'Princeton University',
    'Yale University',
    'Columbia University',
];

export default function SignUpStep3({ navigation }) {
    const { form, updateForm } = useContext(SignUpContext);
    const [query, setQuery] = useState(form.college || '');
    const [filteredColleges, setFilteredColleges] = useState([]);

    useEffect(() => {
        if (query.length > 0) {
            const filtered = colleges.filter(c =>
                c.toLowerCase().includes(query.toLowerCase()),
            );
            setFilteredColleges(filtered);
        } else {
            setFilteredColleges([]);
        }
    }, [query]);

    const onNext = () => {
        if (!query.trim()) {
            Alert.alert('Validation Error', 'Please select your college.');
            return;
        }
        updateForm('college', query);
        navigation.navigate('SignUpStep4');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <Text style={styles.title}>Step 3: College</Text>

            <View style={styles.autocompleteContainer}>
                <Autocomplete
                    data={filteredColleges}
                    defaultValue={query}
                    onChangeText={text => setQuery(text)}
                    placeholder="Type your college name"
                    flatListProps={{
                        keyExtractor: (_, idx) => idx.toString(),
                        renderItem: ({ item }) => (
                            <TouchableOpacity
                                onPress={() => {
                                    setQuery(item);
                                    setFilteredColleges([]);
                                }}
                            >
                                <Text style={styles.itemText}>{item}</Text>
                            </TouchableOpacity>
                        ),
                    }}
                    inputContainerStyle={styles.input}
                    listContainerStyle={styles.listContainer}
                    listStyle={styles.list}
                />
            </View>

            <View style={styles.buttonsRow}>
                <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.darkBlue, padding: 20, justifyContent: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.white, marginBottom: 20, alignSelf: 'center' },
    autocompleteContainer: {
        zIndex: 1,
        marginBottom: 15,
    },
    input: {
        backgroundColor: COLORS.white,
        borderRadius: 6,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    listContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 6,
    },
    list: {
        maxHeight: 120,
    },
    itemText: {
        padding: 10,
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
