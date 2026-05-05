import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const ExpandableText = ({text, numberOfLines = 3, style}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(false);

    if (!text) return null;

    return (
        <View>
            <Text
                style={[styles.text, style]}
                numberOfLines={isExpanded ? 0 : numberOfLines}
                onTextLayout={(e) => {
                    if (e.nativeEvent.lines.length >= numberOfLines) setShouldShowButton(true);
                }}
            >
                {text}
            </Text>
            {shouldShowButton && (
                <TouchableOpacity
                    onPress={() => setIsExpanded(p => !p)}
                    activeOpacity={0.6}
                    style={styles.toggle}
                >
                    <Text style={styles.toggleText}>{isExpanded ? 'Show Less' : 'Read More'}</Text>
                    <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.primary}/>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 13,
        color: COLORS.gray400,
        lineHeight: 20,
        fontWeight: '400',
    },
    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 8,
        gap: 4,
    },
    toggleText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default ExpandableText;