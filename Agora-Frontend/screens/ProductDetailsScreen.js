import React, { useEffect, useRef, useState } from "react";
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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import ImageViewing from 'react-native-image-viewing';

import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from "react-native-vector-icons/Ionicons";

import SellerCard from "../components/SellerCard";
import Button from "../components/Button";
import Card from "../components/Cards";
import FavoriteButton from "../components/FavoriteButton";
import ExpandableText from "../components/ExpandableText";
import ProductDetailItem from "../components/ProductDetailItem";
import SafetyTips from "../components/SafetyTips";
import BottomSheetMenu from "../components/BottomSheetMenu";
import ToastMessage from "../components/ToastMessage";

import { shareItem } from '../services/share';
import { useUserStore } from "../stores/userStore";
import { useListings } from "../hooks/useListings";

import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";
import { formatPrice } from '../utils/formatters';


const { height, width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const product = route.params?.item;
    const { items: allListings } = useListings();
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const showToast = ({ type, title, message }) => {
        setToast({ visible: true, type, title, message });
    };
    const { currentUser, loading, isGuest } = useUserStore();
    const isOwnListing = currentUser?.id === product?.seller?.id;
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const flatListRef = useRef(null);
    const [chatLoading, setChatLoading] = useState(false);

    const relatedListings = allListings.filter((listing) => listing.id !== product.id && listing.category === product.category);

    if (!product) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.light.bg }}>
                <Text style={{ color: COLORS.light.text }}>Product not found!</Text>
            </View>);
    }

    const images = product?.images?.length ? product.images : product?.image ? [{ uri: product.image }] : [require("../assets/no-image.jpg")];

    const productName = product?.title || product?.name || "Product";
    const productPrice = product?.price ? (product.price.includes('₹') ? product.price : `₹ ${product.price}`) : "N/A";
    const productCondition = product?.itemCondition || "Used";
    const productCollege = product?.college?.collegeName || "Unknown College";
    const productDescription = product?.description || "No description provided for this product.";
    const sellerSince = "2025";

    const scrollViewRef = useRef(null);

    useEffect(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, [product?.id]);

    const openChatRoom = async () => {
        if (loading || chatLoading) return;
        if (isGuest || !currentUser?.id) {
            showToast({
                type: 'info', title: 'Login Required', message: 'Please log in to chat with the seller.',
            });
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
                name: product.seller.firstName ? `${product.seller.firstName} ${product.seller.lastName}` : product.seller.userName || 'Seller',
                avatar: product.seller.profileImage || product.seller.avatar || null,
            };

            const listingData = {
                title: product.title || product.name, price: product.price, imageUrl: product.imageUrl || [],
            };

            const roomId = `${product.id}_${buyer.email}_${seller.email}`;

            navigation.navigate('ChatRoomScreen', {
                roomId: roomId,
                listingId: product.id,
                buyer: buyer,
                seller: seller,
                listingData: listingData,
                sellerName: seller.name,
                sellerId: seller.id,
                sellerAvatar: seller.avatar,
            });
        } catch (err) {
            console.error('Failed to open chat room:', err);
            showToast({
                type: 'error', title: 'Error', message: 'Failed to open chat. Please try again.',
            });
        } finally {
            setChatLoading(false);
        }
    };

    const handleNextImage = () => {
        if (currentImageIndex < images.length - 1) {
            const nextIndex = currentImageIndex + 1;
            setCurrentImageIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }
    };

    const handlePreviousImage = () => {
        if (currentImageIndex > 0) {
            const prevIndex = currentImageIndex - 1;
            setCurrentImageIndex(prevIndex);
            flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentImageIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const renderImageItem = ({ item, index }) => (<TouchableOpacity
        onPress={() => {
            setCurrentImageIndex(index);
            setIsViewerVisible(true);
        }}
        style={styles.imageSlide}
        activeOpacity={0.9}
    >
        <Image
            source={typeof item === 'string' ? { uri: item } : item}
            style={styles.productImage}
            resizeMode="cover"
        />
    </TouchableOpacity>);

    return (<View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

        {/* Floating Header */}
        <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.headerActions}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setShowMenu(true)}
                    style={styles.iconBtn}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color="#000" />
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Image Carousel */}
            <View style={styles.imageContainer}>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderImageItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={viewabilityConfig}
                    getItemLayout={(data, index) => ({
                        length: width, offset: width * index, index,
                    })}
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (<>
                    {currentImageIndex > 0 && (<TouchableOpacity
                        style={[styles.arrowButton, styles.leftArrow]}
                        onPress={handlePreviousImage}
                        activeOpacity={0.8}
                    >
                        <Icon name="chevron-back" size={24} color="#fff" />
                    </TouchableOpacity>)}
                    {currentImageIndex < images.length - 1 && (<TouchableOpacity
                        style={[styles.arrowButton, styles.rightArrow]}
                        onPress={handleNextImage}
                        activeOpacity={0.8}
                    >
                        <Icon name="chevron-forward" size={24} color="#fff" />
                    </TouchableOpacity>)}
                </>)}

                {/* Dot Indicators */}
                {images.length > 1 && (<View style={styles.dotContainer}>
                    {images.map((_, index) => (<View
                        key={index}
                        style={[styles.dot, currentImageIndex === index && styles.activeDot]}
                    />))}
                </View>)}

                <ImageViewing
                    images={images.map(img => (typeof img === 'string' ? { uri: img } : img))}
                    imageIndex={currentImageIndex}
                    visible={isViewerVisible}
                    onRequestClose={() => setIsViewerVisible(false)}
                />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.titleSection}>
                    <Text style={styles.productName} numberOfLines={2}>
                        {productName}
                    </Text>
                    <View style={styles.favoriteContainer}>
                        <FavoriteButton listingId={product.id} size={28} />
                    </View>
                </View>

                <Text style={styles.productPrice}>{formatPrice(productPrice)}</Text>

                {/* College Row */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <View style={styles.infoIconCircle}>
                            <Icon name="school" size={16} color={COLORS.primary} />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>College</Text>
                            <Text style={styles.infoValue} numberOfLines={1}>{productCollege}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <ExpandableText text={productDescription || "No description available."} />

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionTitle}>Seller</Text>
                <SellerCard
                    seller={product.seller}
                    sellerSince={sellerSince}
                    currentUser={currentUser}
                    onPress={() => navigation.navigate("ProfileScreen", {
                        sellerId: product.seller.id, profileImage: product.seller.profileImage
                    })}
                />

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionTitle}>Product Details</Text>
                <View style={styles.detailsGrid}>
                    <ProductDetailItem label="Condition" value={productCondition} />
                    <ProductDetailItem
                        label="Category"
                        value={product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'N/A'}
                    />
                    <ProductDetailItem label="Availability" value={product.itemStatus} type="availability" />
                </View>

                <View style={styles.sectionDivider} />

                <View style={styles.relatedHeader}>
                    <Text style={styles.sectionTitle}>Similar Listings</Text>
                </View>

                {relatedListings.length === 0 ? (<View style={styles.emptyRelatedContainer}>
                    <Ionicons name="cube-outline" size={32} color={COLORS.gray400} />
                    <Text style={styles.emptyRelatedText}>
                        No similar listings found.
                    </Text>
                </View>) : (<ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.relatedList}
                >
                    {relatedListings.slice(0, 5).map((item) => (<Card
                        key={item.id}
                        item={item}
                        horizontal
                        onPress={() => navigation.push('ProductDetailsScreen', { item })}
                    />))}
                </ScrollView>)}

                <View style={styles.sectionDivider} />

                <SafetyTips />

            </View>
        </ScrollView>

        {/* Floating Bottom Action Bar */}
        {!isOwnListing && (
            <View style={[
                styles.bottomBar,
                {
                    paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20,
                    paddingTop: 12,
                }
            ]}>
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
                        title={chatLoading ? "Opening..." : "Chat with Seller"}
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

            onAuthRequired={() => {
                setShowMenu(false);
                showToast({
                    type: 'info',
                    title: 'Join Agora',
                    message: 'Sign up to report inappropriate listings and help keep campus safe!'
                });
            }}
            onShare={() => {
                setShowMenu(false);
                shareItem({ type: 'LISTING', title: product.title, id: product.id });
            }}
            onReport={isOwnListing ? null : () => {
                setShowMenu(false);
                navigation.navigate('ReportListingScreen', {
                    listingId: product.id,
                });
            }}
        />

        {toast.visible && (<ToastMessage
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onHide={() => setToast({ ...toast, visible: false })}
        />)}
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: COLORS.light.bg,
    }, headerRow: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + THEME.spacing.xs : 50,
        paddingHorizontal: THEME.spacing.md,
        paddingBottom: THEME.spacing.xs,
        zIndex: THEME.zIndex.fixed,
    }, headerActions: {
        flexDirection: "row", gap: THEME.spacing.sm, alignItems: "center",
    }, iconBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: THEME.borderRadius.full,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    }, scrollView: {
        flex: 1,
    }, imageContainer: {
        height: 380, backgroundColor: COLORS.gray100, position: "relative",
    }, imageSlide: {
        width: width, height: 380,
    }, productImage: {
        width: "100%", height: "100%",
    }, arrowButton: {
        position: "absolute",
        top: "50%",
        marginTop: -20,
        width: 40,
        height: 40,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center",
        zIndex: THEME.zIndex.dropdown,
    }, leftArrow: {
        left: THEME.spacing.md,
    }, rightArrow: {
        right: THEME.spacing.md,
    }, dotContainer: {
        position: "absolute",
        bottom: THEME.spacing.xl,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    }, dot: {
        width: 6, height: 6, borderRadius: 3, backgroundColor: "rgb(239, 234, 234)", marginHorizontal: 3,
    }, activeDot: {
        backgroundColor: COLORS.primary, width: 24,
    }, content: {
        backgroundColor: COLORS.light.bg,
        borderTopLeftRadius: THEME.borderRadius['2xl'],
        borderTopRightRadius: THEME.borderRadius['2xl'],
        marginTop: -THEME.spacing.lg,
        paddingTop: THEME.spacing.lg,
        paddingHorizontal: THEME.spacing.md,
        paddingBottom: 100,
    },
    titleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: THEME.spacing.sm,
    },
    productName: {
        flex: 1,
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.light.text,
        lineHeight: THEME.fontSize['2xl'] * 1.3,
        letterSpacing: -0.5,
        paddingRight: THEME.spacing.sm,
    },
    favoriteContainer: {
        marginLeft: THEME.spacing.xl,
        width: 42,
        alignItems: 'center',
    },
    productPrice: {
        fontSize: THEME.fontSize['3xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.primary,
        letterSpacing: -0.8,
        marginBottom: THEME.spacing.lg,
    }, infoRow: {
        flexDirection: "row",
        backgroundColor: COLORS.light.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    }, infoItem: {
        flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    }, infoIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary + '15',
        alignItems: "center",
        justifyContent: "center",
        marginRight: THEME.spacing[2],
    }, infoTextContainer: {
        flex: 1,
    }, infoLabel: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.light.textTertiary,
        fontWeight: THEME.fontWeight.medium,
        marginBottom: 2,
    }, infoValue: {
        fontSize: THEME.fontSize.sm, color: COLORS.light.text, fontWeight: THEME.fontWeight.semibold,
    }, sectionDivider: {
        height: 1, backgroundColor: COLORS.light.border, marginVertical: THEME.spacing.lg,
    }, sectionTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.light.text,
        marginBottom: THEME.spacing.md,
    }, detailsGrid: {
        gap: THEME.spacing[2],
    }, relatedHeader: {
        marginBottom: THEME.spacing.md,
    }, relatedList: {
        gap: THEME.spacing[1],
    }, emptyRelatedContainer: {
        paddingVertical: THEME.spacing['2xl'], alignItems: 'center', gap: THEME.spacing[2],
    }, emptyRelatedText: {
        fontSize: THEME.fontSize.sm, color: COLORS.light.textSecondary, textAlign: 'center',
    }, bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing[3],
        paddingBottom: Platform.OS === 'ios' ? THEME.spacing['2xl'] : THEME.spacing[3],
        backgroundColor: COLORS.light.bg,
        borderTopWidth: 1,
        borderTopColor: COLORS.light.border,
    },
});