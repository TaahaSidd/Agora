import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, onPress } from 'react-native'; 1
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const Card = ({ item }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate('ProductDetails', { item });
    };

    const handleFavorite = () => {
        // You can implement favorite logic here
        console.log('Favorited:', item.name);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.imageWrapper}>
                <Image source={item.image} style={styles.image} />
                <TouchableOpacity style={styles.heartButton} onPress={handleFavorite}>
                    <Icon name="heart-outline" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.info}>
                <Text style={styles.price}>{item.price}</Text>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    card: {
        width: '47%',
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 16,
        elevation: 3.5,
    },
    imageWrapper: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 120,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 6,
        borderRadius: 20,
    },
    info: {
        padding: 10,
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    name: {
        fontSize: 14,
        color: '#555',
    },
});

export default Card;
