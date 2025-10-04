import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';


export default function AppHeader({ title, onBack, rightIcon, onRightPress }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                {onBack ? (
                    <TouchableOpacity onPress={onBack}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}

                <Text style={styles.headerTitle}>{title}</Text>

                {rightIcon ? (
                    <TouchableOpacity onPress={onRightPress}>
                        <Ionicons name={rightIcon} size={24} color={COLORS.black} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.black,
    },
});
