import React, { useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { THEME } from '../utils/theme';
import { COLORS } from '../utils/colors';

const MyListingRowCard = ({ item, onEdit, onDelete }) => {
    const navigation = useNavigation();
    const translateX = useRef(new Animated.Value(0)).current;
    const [isSwipeOpen, setIsSwipeOpen] = useState(false);

    if (!item) {
        return null;
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dx < 0) {
                    translateX.setValue(Math.max(gestureState.dx, -120));
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dx < -100) {
                    setIsSwipeOpen(true);
                    Animated.timing(translateX, {
                        toValue: -120,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                } else {
                    setIsSwipeOpen(false);
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handlePress = () => {
        if (isSwipeOpen) {
            setIsSwipeOpen(false);
            Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            navigation.navigate('ProductDetailsScreen', { item });
        }
    };

    const handleEdit = () => {
        setIsSwipeOpen(false);
        Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        onEdit && onEdit(item);
    };

    const handleDelete = () => {
        setIsSwipeOpen(false);
        Animated.timing(translateX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
        onDelete && onDelete(item);
    };

    return (
        <View style={styles.container}>
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={handleEdit}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="edit" size={20} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                    activeOpacity={0.8}
                >
                    <Icon name="trash-outline" size={20} color={COLORS.white} />
                </TouchableOpacity>
            </View>
            <Animated.View
                style={[
                    styles.card,
                    { transform: [{ translateX }] }
                ]}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity
                    style={styles.cardContent}
                    onPress={handlePress}
                    activeOpacity={0.95}
                >
                    <View style={styles.imageContainer}>
                        <Image
                            source={item.images ? item.images[0] : item.image || require('../assets/adaptive-icon.png')}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>

                    <View style={styles.content}>
                        <View style={styles.textContent}>
                            <Text style={styles.title} numberOfLines={2}>
                                {String(item.name || item.title || 'Untitled')}
                            </Text>
                            <Text style={styles.price}>
                                {(() => {
                                    if (typeof item.price === 'string') {
                                        return item.price;
                                    } else if (typeof item.price === 'number') {
                                        return `₹ ${item.price}`;
                                    } else if (item.price && typeof item.price === 'object') {
                                        return 'Price not available';
                                    } else {
                                        return 'Price not available';
                                    }
                                })()}
                            </Text>
                            {item.college && (
                                <Text style={styles.college} numberOfLines={1}>
                                    {typeof item.college === 'object' && item.college.collegeName
                                        ? item.college.collegeName
                                        : String(item.college)}
                                </Text>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginBottom: THEME.spacing.md,
    },
    actionContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: THEME.spacing.sm,
        zIndex: 1,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: THEME.borderRadius.md,
        elevation: 4,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        overflow: 'hidden',
        zIndex: 2,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: THEME.spacing.sm,
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: THEME.borderRadius.sm,
        overflow: 'hidden',
        marginRight: THEME.spacing.sm,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingRight: 120,
        paddingTop: 8,
    },
    textContent: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 4,
        lineHeight: 20,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 2,
    },
    college: {
        fontSize: 12,
        color: COLORS.gray,
        marginTop: 2,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        elevation: 3,
        shadowColor: COLORS.black,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },
    editButton: {
        backgroundColor: COLORS.primary,
    },
    deleteButton: {
        backgroundColor: COLORS.red,
    },
});

export default MyListingRowCard;
