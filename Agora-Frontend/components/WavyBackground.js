import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');

const WavyBackground = () => {
    return (
        <Svg
            height="400"
            width={width}
            viewBox={`0 0 ${width} 400`}
            style={styles.background}
        >
            <Path
                d={`
                    M0 300 
                    C ${width * 0.25} 400, ${width * 0.75} 200, ${width} 300 
                    L ${width} 0 
                    L0 0 
                    Z
                `}
                fill={COLORS.primary}
            />
            <Path
                d={`
                    M0 280
                    C ${width * 0.25} 380, ${width * 0.75} 180, ${width} 280
                    L ${width} 0
                    L0 0
                    Z
                `}
                fill={COLORS.primary + '99'}
            />
        </Svg>
    );
};

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

export default WavyBackground;
