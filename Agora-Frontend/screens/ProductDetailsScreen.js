import React, { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import ImageViewing from 'react-native-image-viewing';
import { Ionicons } from '@expo/vector-icons';

import SellerCard from '../components/SellerCard';
import Button from '../components/Button';
import Card from '../components/Cards';
import FavoriteButton from '../components/FavoriteButton';
import ExpandableText from '../components/ExpandableText';
import ProductDetailItem from '../components/ProductDetailItem';
import SafetyTips from '../components/SafetyTips';
import BottomSheetMenu from '../components/BottomSheetMenu';
import ToastMessage from '../components/ToastMessage';

import { shareItem } from '../services/share';
import { useUserStore } from '../stores/userStore';
import { useListings } from '../hooks/useListings';
import { COLORS } from '../utils/colors';
import { formatPrice } from '../utils/formatters';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const product = route.params?.item;
    const { items: allListings } = useListings();
    const { currentUser, loading, isGuest } = useUserStore();

    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);

    const flatListRef = useRef(null);
    const scrollViewRef = useRef(null);

    const showToast = (type, title, message) => setToast({ visible: true, type, title, message });

    useEffect(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [product?.id]);

    if (!product) {
        return (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>Product not found.</Text>
            </View>
        );
    }

    const images = product?.images?.length
        ? product.images
        : product?.image
            ? [{ uri: product.image }]
            : [require('../assets/no-image.jpg')];

    const productName = product?.title || product?.name || 'Product';
    const productPrice = product?.price ? (product.price.includes('₹') ? product.price : `₹ ${product.price}`) : 'N/A';
    const productCondition = product?.itemCondition || 'Used';
    const productCollege = product?.college?.collegeName || 'Unknown College';
    const productDesc = product?.description || 'No description provided.';
    const isOwnListing = currentUser?.id === product?.seller?.id;

    const relatedListings = allListings.filter(
        l => l.id !== product.id && l.category === product.category
    );

    const openChatRoom = async () => {
        if (loading || chatLoading) return;
        if (isGuest || !currentUser?.id) {
            showToast('info', 'Login Required', 'Please log in to chat with the seller.');
            return;
        }
        try {
            setChatLoading(true);
            const buyer = {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                avatar: currentUser.profileImage || currentUser.avatar || null,
            };
            const seller = {
                id: product.seller.id,
                email: product.seller.userEmail || product.seller.email || String(product.seller.id),
                name: product.seller.firstName
                    ? `${product.seller.firstName} ${product.seller.lastName}`
                    : product.seller.userName || 'Seller',
                avatar: product.seller.profileImage || product.seller.avatar || null,
            };
            const roomId = `${product.id}_${buyer.email}_${seller.email}`;
            navigation.navigate('ChatRoomScreen', {
                roomId,
                listingId: product.id,
                buyer,
                seller,
                listingData: { title: product.title || product.name, price: product.price, imageUrl: product.imageUrl || [] },
                sellerName: seller.name,
                sellerId: seller.id,
                sellerAvatar: seller.avatar,
            });
        } catch (err) {
            console.error('Failed to open chat room:', err);
            showToast('error', 'Error', 'Failed to open chat. Please try again.');
        } finally {
            setChatLoading(false);
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < images.length - 1) {
            const next = currentImageIndex + 1;
            setCurrentImageIndex(next);
            flatListRef.current?.scrollToIndex({ index: next, animated: true });
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            const prev = currentImageIndex - 1;
            setCurrentImageIndex(prev);
            flatListRef.current?.scrollToIndex({ index: prev, animated: true });
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) setCurrentImageIndex(viewableItems[0].index);
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    const renderImage = ({ item, index }) => (
        <TouchableOpacity
            style={styles.imageSlide}
            onPress={() => { setCurrentImageIndex(index); setIsViewerVisible(true); }}
            activeOpacity={0.9}
        >
            <Image
                source={typeof item === 'string' ? { uri: item } : item}
                style={styles.productImage}
                contentFit="cover"
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

            {/* Floating header */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.headerBtn} activeOpacity={0.7}>
                    <Ionicons name="ellipsis-vertical" size={18} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>

                {/* Image carousel */}
                <View style={styles.imageContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={images}
                        renderItem={renderImage}
                        keyExtractor={(_, i) => i.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
                    />

                    {images.length > 1 && (
                        <>
                            {currentImageIndex > 0 && (
                                <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={handlePrevImage} activeOpacity={0.8}>
                                    <Ionicons name="chevron-back" size={20} color={COLORS.white} />
                                </TouchableOpacity>
                            )}
                            {currentImageIndex < images.length - 1 && (
                                <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={handleNextImage} activeOpacity={0.8}>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
                                </TouchableOpacity>
                            )}
                            <View style={styles.dots}>
                                {images.map((_, i) => (
                                    <View key={i} style={[styles.dot, i === currentImageIndex && styles.dotActive]} />
                                ))}
                            </View>
                        </>
                    )}

                    <ImageViewing
                        images={images.map(img => typeof img === 'string' ? { uri: img } : img)}
                        imageIndex={currentImageIndex}
                        visible={isViewerVisible}
                        onRequestClose={() => setIsViewerVisible(false)}
                    />
                </View>

                {/* Content */}
                <View style={styles.content}>

                    {/* Title + Favorite */}
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={2}>{productName}</Text>
                        <FavoriteButton listingId={product.id} size={26} />
                    </View>

                    <Text style={styles.price}>{formatPrice(productPrice)}</Text>

                    {/* College */}
                    <View style={styles.collegeRow}>
                        <View style={styles.collegeIconWrapper}>
                            <Ionicons name="school-outline" size={14} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.collegeLabel}>College</Text>
                            <Text style={styles.collegeValue} numberOfLines={1}>{productCollege}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <ExpandableText text={productDesc} />

                    <View style={styles.divider} />

                    {/* Seller */}
                    <Text style={styles.sectionTitle}>Seller</Text>
                    <SellerCard
                        seller={product.seller}
                        onPress={() => navigation.navigate('ProfileScreen', {
                            sellerId: product.seller.id,
                            profileImage: product.seller.profileImage,
                        })}
                    />

                    <View style={styles.divider} />

                    {/* Product details */}
                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <View style={styles.detailsGrid}>
                        <ProductDetailItem label="Condition" value={productCondition} />
                        <ProductDetailItem
                            label="Category"
                            value={product.category
                                ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
                                : 'N/A'}
                        />
                        <ProductDetailItem label="Availability" value={product.itemStatus} type="availability" />
                    </View>

                    <View style={styles.divider} />

                    {/* Similar listings */}
                    <Text style={styles.sectionTitle}>Similar Listings</Text>
                    {relatedListings.length === 0 ? (
                        <View style={styles.emptyRelated}>
                            <View style={styles.emptyIconWrapper}>
                                <Ionicons name="cube-outline" size={24} color={COLORS.gray400} />
                            </View>
                            <Text style={styles.emptyText}>No similar listings found.</Text>
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 8 }}
                        >
                            {relatedListings.slice(0, 5).map(item => (
                                <Card
                                    key={item.id}
                                    item={item}
                                    horizontal
                                    onPress={() => navigation.push('ProductDetailsScreen', { item })}
                                />
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.divider} />
                    <SafetyTips />
                </View>
            </ScrollView>

            {/* Bottom action bar */}
            {!isOwnListing && (
                <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    {isGuest ? (
                        <Button
                            title="Log In to Chat"
                            variant="primary"
                            size="large"
                            icon="log-in-outline"
                            iconPosition="left"
                            onPress={() => navigation.navigate('Login')}
                            fullWidth
                        />
                    ) : (
                        <Button
                            title={chatLoading ? 'Opening...' : 'Chat with Seller'}
                            variant="primary"
                            size="large"
                            icon="chatbubble-ellipses"
                            iconPosition="left"
                            onPress={openChatRoom}
                            fullWidth
                            loading={chatLoading}
                            disabled={chatLoading}
                        />
                    )}
                </View>
            )}

            <BottomSheetMenu
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                type="listing"
                title="Listing Options"
                isGuest={isGuest}
                onAuthRequired={() => showToast('info', 'Join Agora', 'Sign up to report listings and keep campus safe!')}
                onShare={() => {
                    setShowMenu(false);
                    shareItem({ type: 'LISTING', title: product.title, id: product.id });
                }}
                onReport={isOwnListing ? null : () => {
                    setShowMenu(false);
                    navigation.navigate('ReportListingScreen', { listingId: product.id });
                }}
            />

            {toast.visible && (
                <ToastMessage
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    onHide={() => setToast(p => ({ ...p, visible: false }))}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    notFound: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.light.bg,
    },
    notFoundText: {
        fontSize: 14,
        color: COLORS.gray400,
    },

    // Header
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
        zIndex: 10,
    },
    headerBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
            },
            android: { elevation: 2 },
        }),
    },

    // Image carousel
    imageContainer: {
        height: 360,
        backgroundColor: COLORS.gray100,
        position: 'relative',
    },
    imageSlide: {
        width,
        height: 360,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -18,
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowLeft: { left: 12 },
    arrowRight: { right: 12 },
    dots: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    dotActive: {
        backgroundColor: COLORS.white,
        width: 20,
        borderRadius: 3,
    },

    // Content
    content: {
        backgroundColor: COLORS.light.bg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -16,
        paddingTop: 20,
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
        gap: 12,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.light.text,
        letterSpacing: -0.5,
        lineHeight: 26,
    },
    price: {
        fontSize: 26,
        fontWeight: '700',
        color: COLORS.primary,
        letterSpacing: -0.5,
        marginBottom: 16,
    },

    // College
    collegeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.gray100,
    },
    collegeIconWrapper: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: `${COLORS.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    collegeLabel: {
        fontSize: 10,
        color: COLORS.gray400,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
    },
    collegeValue: {
        fontSize: 13,
        color: COLORS.light.text,
        fontWeight: '600',
    },

    // Sections
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.gray400,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.gray100,
        marginVertical: 20,
    },
    detailsGrid: {
        gap: 8,
    },

    // Empty related
    emptyRelated: {
        alignItems: 'center',
        paddingVertical: 24,
        gap: 8,
    },
    emptyIconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.gray100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 12,
        color: COLORS.gray400,
    },

    // Bottom bar
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: COLORS.light.bg,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.gray100,
    },
});