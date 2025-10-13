import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';

const Banner = ({
    source,
    style,
    onPress,
    resizeMode = 'cover',
    borderRadius = THEME.borderRadius.md,
    height = 150,
    width = '100%'
}) => {
    const bannerStyle = [
        styles.banner,
        {
            borderRadius,
            height,
            width,
        },
        style
    ];

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                <Image
                    source={source}
                    style={bannerStyle}
                    resizeMode={resizeMode}
                />
            </TouchableOpacity>
        );
    }

    return (
        <Image
            source={source}
            style={bannerStyle}
            resizeMode={resizeMode}
        />
    );
};

const styles = StyleSheet.create({
    banner: {
        marginBottom: 20,
    },
});

export default Banner;
