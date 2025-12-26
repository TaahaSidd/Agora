import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {COLORS} from '../utils/colors';

export default function SettingsOptionList({title, options}) {
    return (
        <View style={styles.section}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            <View style={styles.optionsCard}>
                {options.map((option, index) => {
                    const isLast = index === options.length - 1;

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionItem,
                                isLast && styles.lastItem
                            ]}
                            activeOpacity={0.7}
                            onPress={option.onPress}
                        >
                            <View style={styles.optionLeft}>
                                <LinearGradient
                                    colors={option.gradient || [option.bgColor, option.bgColor]}
                                    style={styles.optionIconCircle}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                >
                                    {option.iconType === 'material' ? (
                                        <MaterialIcons name={option.icon} size={20} color="#fff"/>
                                    ) : (
                                        <Ionicons name={option.icon} size={20} color="#fff"/>
                                    )}
                                </LinearGradient>
                                <View style={styles.optionTextContainer}>
                                    <Text style={styles.optionText}>{option.label}</Text>
                                    {option.description && (
                                        <Text style={styles.optionDescription}>{option.description}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.optionRight}>
                                {option.value && (
                                    <Text style={styles.optionValue} numberOfLines={1}>{option.value}</Text>
                                )}
                                <Ionicons name="chevron-forward" size={18} color={COLORS.dark.textTertiary}/>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.dark.text,
        marginBottom: 14,
        letterSpacing: -0.3,
    },
    optionsCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.dark.text,
        letterSpacing: -0.2,
    },
    optionDescription: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        marginTop: 2,
        fontWeight: '500',
        letterSpacing: -0.1,
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    optionValue: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        fontWeight: '600',
        maxWidth: 100,
        letterSpacing: -0.1,
    },
});