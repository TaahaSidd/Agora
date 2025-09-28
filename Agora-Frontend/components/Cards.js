import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';
import FavoriteButton from './FavoriteButton';

const Card = ({ item }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('ProductStack', {
            screen: 'ProductDetailsScreen',
            params: { item },
        });
    };


    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.imageWrapper}>
                <Image
                    source={item.images ? item.images[0] : item.image}
                    style={styles.image}
                />
                {/* Use our reusable FavoriteButton */}
                <FavoriteButton size={20} />
            </View>
            <View style={styles.info}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '47%',
        borderRadius: THEME.borderRadius.md,
        backgroundColor: COLORS.white,
        marginBottom: THEME.spacing.md,
        elevation: 3.5,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: THEME.borderRadius.md,
        borderTopRightRadius: THEME.borderRadius.md,
    },
    info: {
        padding: THEME.spacing.sm,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        color: COLORS.black,
    },
    name: {
        fontSize: 14,
        color: COLORS.gray,
    },
});

export default Card;
