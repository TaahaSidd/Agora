import React, {useState} from 'react';
import {Image, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {COLORS} from '../utils/colors';
import {formatPrice} from '../utils/formatters';
import FavoriteButton from './FavoriteButton';

const Card = ({item, horizontal = false, showToast, onEdit, onDelete}) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [isFavorite, setIsFavorite] = useState(item.isFavorite || false);
    const [showActions, setShowActions] = useState(false);

    const isManageable = !!(onEdit || onDelete);

    const handlePress = () => navigation.navigate('ProductDetailsScreen', {item});

    const handleGuestFavorite = () => {
        showToast?.({
            type: 'info',
            title: 'Save for later?',
            message: 'Sign up to keep track of your favorite items!',
        });
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.card, horizontal ? styles.horizontalCard : styles.gridCard]}
                onPress={handlePress}
                onLongPress={() => isManageable && setShowActions(true)}
                delayLongPress={400}
                activeOpacity={0.7}
            >
                {/* Image */}
                <View style={[styles.imageWrapper, horizontal && styles.horizontalImageWrapper]}>
                    <Image
                        source={item.images?.length ? item.images[0] : require('../assets/no-image.jpg')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    {item.itemStatus === 'SOLD' && (
                        <View style={styles.soldBadge}>
                            <Text style={styles.soldText}>SOLD</Text>
                        </View>
                    )}
                    <FavoriteButton
                        listingId={item.id}
                        isFavorite={isFavorite}
                        onToggle={setIsFavorite}
                        size={18}
                        onGuestPress={handleGuestFavorite}
                    />
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.price}>{formatPrice(item.price)}</Text>
                </View>
            </TouchableOpacity>

            {/* Actions bottom sheet — only renders when manageable */}
            {isManageable && (
                <Modal
                    visible={showActions}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowActions(false)}
                >
                    <TouchableOpacity
                        style={styles.overlay}
                        activeOpacity={1}
                        onPress={() => setShowActions(false)}
                    >
                        <View style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, 24)}]}>
                            <View style={styles.handle}/>

                            {/* Listing preview */}
                            <View style={styles.preview}>
                                <Image
                                    source={item.images?.length ? item.images[0] : require('../assets/no-image.jpg')}
                                    style={styles.previewImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.previewInfo}>
                                    <Text style={styles.previewTitle} numberOfLines={1}>
                                        {item.name || item.title}
                                    </Text>
                                    <Text style={styles.previewPrice}>{formatPrice(item.price)}</Text>
                                </View>
                            </View>

                            <View style={styles.divider}/>

                            {/* Actions */}
                            {onEdit && (
                                <TouchableOpacity
                                    style={styles.actionRow}
                                    onPress={() => {setShowActions(false); onEdit();}}
                                    activeOpacity={0.6}
                                >
                                    <View style={[styles.actionIcon, {backgroundColor: `${COLORS.info}12`}]}>
                                        <Ionicons name="create-outline" size={18} color={COLORS.info}/>
                                    </View>
                                    <View style={styles.actionText}>
                                        <Text style={styles.actionLabel}>Edit Listing</Text>
                                        <Text style={styles.actionDesc}>Update details, price or photos</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={14} color={COLORS.gray300}/>
                                </TouchableOpacity>
                            )}

                            {onEdit && onDelete && <View style={styles.divider}/>}

                            {onDelete && (
                                <TouchableOpacity
                                    style={styles.actionRow}
                                    onPress={() => {setShowActions(false); onDelete();}}
                                    activeOpacity={0.6}
                                >
                                    <View style={[styles.actionIcon, {backgroundColor: `${COLORS.error}12`}]}>
                                        <Ionicons name="trash-outline" size={18} color={COLORS.error}/>
                                    </View>
                                    <View style={styles.actionText}>
                                        <Text style={[styles.actionLabel, {color: COLORS.error}]}>Delete Listing</Text>
                                        <Text style={styles.actionDesc}>Permanently remove this item</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={14} color={COLORS.gray300}/>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    gridCard: {
        width: '48.5%',
    },
    horizontalCard: {
        width: 160,
        marginRight: 12,
    },

    // Image
    imageWrapper: {
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: COLORS.gray100,
        height: 175,
    },
    horizontalImageWrapper: {
        height: 150,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    soldBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        zIndex: 2,
    },
    soldText: {
        color: COLORS.white,
        fontSize: 9,
        fontWeight: '700',
        letterSpacing: 0.5,
    },

    // Info
    info: {
        paddingTop: 8,
        paddingHorizontal: 2,
    },
    name: {
        fontSize: 13,
        color: COLORS.light.text,
        fontWeight: '500',
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.3,
    },

    // Bottom sheet
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    handle: {
        width: 36,
        height: 4,
        backgroundColor: COLORS.gray200,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 16,
    },

    // Preview
    preview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    previewImage: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: COLORS.gray100,
    },
    previewInfo: {
        flex: 1,
        gap: 3,
    },
    previewTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
    },
    previewPrice: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.primary,
    },

    // Actions
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.gray100,
        marginHorizontal: 16,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
    },
    actionIcon: {
        width: 38,
        height: 38,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        flex: 1,
        gap: 2,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.light.text,
    },
    actionDesc: {
        fontSize: 11,
        color: COLORS.gray400,
    },
});

export default Card;