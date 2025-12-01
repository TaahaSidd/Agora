import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/colors';

export default function AppHeader({
    title,
    centerComponent,
    onBack,
    rightIcon,
    rightComponent,
    onRightPress,
}) {
    const backgroundColor = COLORS.dark.bg;
    const textColor = COLORS.dark.text;
    const borderColor = COLORS.dark.border;

    return (
        <SafeAreaView>
            <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>

                {/* Back Button */}
                {onBack ? (
                    <TouchableOpacity onPress={onBack}>
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}

                {/* Center Area */}
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {centerComponent ? (
                        centerComponent
                    ) : (
                        <Text style={[styles.headerTitle, { color: textColor }]}>
                            {title}
                        </Text>
                    )}
                </View>

                {/* Right Side */}
                {rightComponent ? (
                    rightComponent
                ) : rightIcon ? (
                    <TouchableOpacity onPress={onRightPress} style={styles.iconArea}>
                        <Ionicons name={rightIcon} size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 24 }} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    iconArea: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
