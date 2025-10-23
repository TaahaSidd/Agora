import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const SectionCard = ({
    icon,
    title,
    content,
    list,
    footer,
    onPress,
    isCollapsible = false,
    expanded: expandedProp,
    style,
}) => {
    const [expanded, setExpanded] = useState(expandedProp ?? !isCollapsible);

    const handlePress = () => {
        if (isCollapsible) {
            setExpanded(!expanded);
        }
        if (onPress) onPress();
    };

    return (
        <TouchableOpacity
            activeOpacity={onPress || isCollapsible ? 0.7 : 1}
            onPress={handlePress}
            style={[styles.card, style]}
        >
            {/* Header Row */}
            <View style={styles.headerRow}>
                {icon && <View style={styles.iconCircle}>{icon}</View>}
                <Text style={styles.title}>{title}</Text>
                {isCollapsible && (
                    <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#9CA3AF"
                    />
                )}
            </View>

            {/* Content */}
            {expanded && (
                <View style={styles.contentContainer}>
                    {typeof content === 'string' ? (
                        <Text style={styles.contentText}>{content}</Text>
                    ) : (
                        content
                    )}

                    {/* Bullet list */}
                    {list && (
                        <View style={styles.listContainer}>
                            {list.map((item, idx) => (
                                <View key={idx} style={styles.listItem}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.listText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Footer */}
                    {footer && <View style={styles.footer}>{footer}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    contentContainer: {
        marginTop: 0,
    },
    contentText: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        fontWeight: '500',
    },
    listContainer: {
        marginTop: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        paddingLeft: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginTop: 8,
        marginRight: 12,
    },
    listText: {
        flex: 1,
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        fontWeight: '500',
    },
    footer: {
        marginTop: 12,
    },
});

export default SectionCard;
