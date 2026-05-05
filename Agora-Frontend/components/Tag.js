import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {COLORS} from '../utils/colors';

const CONDITION_STYLES = {
    New:        {bg: `${COLORS.success}12`,  text: COLORS.success,  border: `${COLORS.success}25`},
    'Like New': {bg: `${COLORS.success}12`,  text: COLORS.success,  border: `${COLORS.success}25`},
    Used:       {bg: `${COLORS.info}12`,     text: COLORS.info,     border: `${COLORS.info}25`},
    'Well Used':{bg: `${COLORS.warning}12`,  text: COLORS.warning,  border: `${COLORS.warning}25`},
    Bad:        {bg: `${COLORS.error}12`,    text: COLORS.error,    border: `${COLORS.error}25`},
    Default:    {bg: COLORS.gray100,         text: COLORS.gray400,  border: COLORS.gray100},
};

const TYPE_STYLES = {
    info:     {bg: COLORS.gray100,              text: COLORS.gray400,  border: COLORS.gray100},
    verified: {bg: `${COLORS.success}12`,       text: COLORS.success,  border: `${COLORS.success}25`},
    location: {bg: COLORS.gray100,              text: COLORS.gray400,  border: COLORS.gray100},
    college:  {bg: `${COLORS.primary}10`,       text: COLORS.primary,  border: `${COLORS.primary}25`},
    time:     {bg: COLORS.gray100,              text: COLORS.gray400,  border: COLORS.gray100},
};

const Tag = ({
    label,
    type = 'category',
    icon,
    onPress,
    active = false,
}) => {
    let tagStyle;

    if (type === 'condition') {
        tagStyle = CONDITION_STYLES[label] || CONDITION_STYLES.Default;
    } else if (type === 'category') {
        tagStyle = active
            ? {bg: `${COLORS.primary}12`, text: COLORS.primary, border: `${COLORS.primary}30`}
            : {bg: COLORS.white, text: COLORS.light.text, border: COLORS.gray100};
    } else {
        tagStyle = TYPE_STYLES[type] || TYPE_STYLES.info;
    }

    const isCategory = type === 'category';
    const isCondition = type === 'condition';

    return (
        <TouchableOpacity
            style={[
                styles.tag,
                {backgroundColor: tagStyle.bg, borderColor: tagStyle.border},
                isCategory && styles.categoryTag,
                isCondition && styles.conditionTag,
                active && styles.activeTag,
            ]}
            onPress={onPress}
            activeOpacity={onPress ? 0.6 : 1}
            disabled={!onPress}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={isCategory ? 14 : 12}
                    color={tagStyle.text}
                    style={styles.icon}
                />
            )}
            <Text
                style={[
                    styles.text,
                    {color: tagStyle.text},
                    isCategory && styles.categoryText,
                    isCondition && styles.conditionText,
                ]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        marginRight: 6,
        marginBottom: 6,
        alignSelf: 'flex-start',
        maxWidth: 200,
    },
    categoryTag: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 10,
    },
    conditionTag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    activeTag: {
        shadowColor: COLORS.primary,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    text: {
        fontSize: 11,
        fontWeight: '500',
        flexShrink: 1,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
    },
    conditionText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
});

export default Tag;