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
    // UPDATED: Now using Light Theme constants
    const backgroundColor = COLORS.light.bgElevated; // Pure White
    const textColor = COLORS.light.text;            // Dark Charcoal
    const borderColor = COLORS.light.border;        // Soft Gray

    return (
        // edges={['top']} prevents extra padding at the bottom of the header
        <SafeAreaView edges={['top']} style={{ backgroundColor }}>
            <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>

                {/* Back Button */}
                {onBack ? (
                    <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.iconArea}>
                        <Ionicons name="arrow-back" size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
                )}

                {/* Center Area */}
                <View style={styles.centerArea}>
                    {centerComponent ? (
                        centerComponent
                    ) : (
                        <Text style={[styles.headerTitle, { color: textColor }]} numberOfLines={1}>
                            {title}
                        </Text>
                    )}
                </View>

                {/* Right Side */}
                {rightComponent ? (
                    rightComponent
                ) : rightIcon ? (
                    <TouchableOpacity onPress={onRightPress} style={styles.iconArea} activeOpacity={0.7}>
                        <Ionicons name={rightIcon} size={24} color={textColor} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.placeholder} />
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
        borderBottomWidth: 1, // Subtle separation from the gray body
    },
    centerArea: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    headerTitle: {
        fontSize: 18, // Slightly more compact for a modern look
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    iconArea: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        width: 40, // Match iconArea to keep title perfectly centered
    },
});