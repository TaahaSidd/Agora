import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    StatusBar,
    Platform,
    FlatList,
    Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import MapView, { Marker } from 'react-native-maps';
import ImageViewing from 'react-native-image-viewing';
import Icon from "react-native-vector-icons/Ionicons";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Tag from "../components/Tag";
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
import { getOrCreateChatRoom } from '../services/chatService';

import { getTimeAgo } from '../utils/dateUtils';
import { COLORS } from "../utils/colors";
import { THEME } from "../utils/theme";
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useReviews } from "../hooks/useReviews";
import { useListings } from "../hooks/useListings";

const { height, width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const product = route.params?.item;
    const { items: allListings } = useListings();
    const { reviews = [], setReviews } = useReviews(product?.id ?? null);
    const [toast, setToast] = useState({ visible: false, type: '', title: '', message: '' });
    const showToast = ({ type, title, message }) => {
        setToast({ visible: true, type, title, message });
    };
    const { user: currentUser, loading, isGuest } = useCurrentUser();
    const isOwnListing = currentUser?.id === product?.seller?.id;
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const flatListRef = useRef(null);

    const relatedListings = allListings.filter(
        (listing) =>
            listing.id !== product.id &&
            listing.category === product.category
    );

    if (!product) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Product not found!</Text>
            </View>
        );
    }

    const images = product?.images?.length
        ? product.images
        : product?.image
            ? [{ uri: product.image }]
            : [require("../assets/no-image.jpg")];

    const productName = product?.title || product?.name || "Product";
    const productPrice = product?.price ? (product.price.includes('₹') ? product.price : `₹ ${product.price}`) : "N/A";
    const productCondition = product?.itemCondition || "Used";
    const productCollege = product?.college?.collegeName || "Unknown College";
    const productLocation = product?.college?.city || "City Name";
    const productDescription = product?.description || "No description provided for this product.";
    const sellerSince = "2025";

    let sellerAvatar = product.seller?.avatar;
    if (sellerAvatar?.includes('localhost')) {
        sellerAvatar = sellerAvatar.replace('localhost', '192.168.8.15');
    }

    const productCoordinates = product?.college?.latitude && product?.college?.longitude
        ? {
            latitude: Number(product.college.latitude),
            longitude: Number(product.college.longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }
        : {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };

    const openInMaps = () => {
        if (!product?.college?.latitude || !product?.college?.longitude) return;

        const lat = Number(product.college.latitude);
        const lng = Number(product.college.longitude);
        const label = product.college.collegeName || "College";

        const scheme = Platform.select({
            ios: 'maps://0,0?q=',
            android: 'geo:0,0?q='
        });

        const latLng = `${lat},${lng}`;

        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url);
    };

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1))
        : 0;

    const ratingBreakdown = [5, 4, 3, 2, 1].map(star => {
        const count = reviews.filter(r => Number(r.rating) === star).length;
        const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
        return { star, count, percentage };
    });

    const openChatRoom = async () => {
        if (loading) return;
        if (isGuest || !currentUser?.id) {
            showToast({
                type: 'info',
                title: 'Login Required',
                message: 'Please log in to chat with the seller.',
            });
            return;
        }

        if (!product?.seller || !product.seller.id) {
            console.warn("Seller data not loaded yet");
            return;
        }

        try {
            const buyer = {
                id: currentUser.id,
                email: currentUser.email,
                name: currentUser.name,
                avatar: currentUser.avatar || null,
            };

            const seller = {
                id: product.seller.id,
                email: product.seller.userEmail || product.seller.email || String(product.seller.id),
                name: product.seller.firstName
                    ? `${product.seller.firstName} ${product.seller.lastName}`
                    : product.seller.userName || 'Seller',
                avatar: product.seller.avatar || null,
            };

            const roomRef = await getOrCreateChatRoom(product.id, buyer, seller);

            navigation.navigate('ChatRoomScreen', {
                roomId: roomRef.id,
                listing: product,
                sellerName: seller.name,
                sellerId: seller.id,
                sellerAvatar: product.seller.profileImage || product.seller.avatar || null,
            });
        } catch (err) {
            console.error('Failed to open chat room:', err);
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

    const renderImageItem = ({ item, index }) => (
        <TouchableOpacity
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
        </TouchableOpacity>
    );

    const renderReviewItem = ({ item, index }) => {
        const reviewerName = item?.reviewerName || item?.user || item?.userName || 'Unknown';
        const rating = Number(item?.rating) || 0;
        const comment = item?.comment || '';
        const createdAt = item?.createdAt || item?.date || item?.createdAtIso || null;
        const reviewerInitial = reviewerName ? String(reviewerName).charAt(0) : '?';

        return (
            <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                        <View style={styles.reviewAvatar}>
                            <Text style={styles.reviewAvatarText}>{reviewerInitial}</Text>
                        </View>
                        <View style={styles.reviewUserDetails}>
                            <View style={styles.reviewNameRow}>
                                <Text style={styles.reviewUser}>{reviewerName}</Text>
                                {/* if you have a verified flag in DTO */}
                                {item?.verified && (
                                    <View style={styles.verifiedBadge}>
                                        <Icon name="checkmark-circle" size={14} color="#10B981" />
                                    </View>
                                )}
                            </View>
                            {createdAt && (
                                <Text style={styles.reviewDate}>
                                    {new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.reviewRatingRow}>
                    {[...Array(5)].map((_, i) => (
                        <Icon key={i} name={i < rating ? 'star' : 'star-outline'} size={14} color="#FCD34D" />
                    ))}
                </View>

                <Text style={styles.reviewComment}>{comment}</Text>
            </View>
        );
    };

    const displayedReviews = showAllReviews ? reviews : (reviews || []).slice(0, 2);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Floating Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowMenu(true)}
                        style={styles.iconBtn}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
                    </TouchableOpacity>
                    <FavoriteButton listingId={product.id} size={28} style={{ position: 'absolute', top: 2, right: 54 }} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                            length: width,
                            offset: width * index,
                            index,
                        })}
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            {currentImageIndex > 0 && (
                                <TouchableOpacity
                                    style={[styles.arrowButton, styles.leftArrow]}
                                    onPress={handlePreviousImage}
                                    activeOpacity={0.8}
                                >
                                    <Icon name="chevron-back" size={24} color="#fff" />
                                </TouchableOpacity>
                            )}
                            {currentImageIndex < images.length - 1 && (
                                <TouchableOpacity
                                    style={[styles.arrowButton, styles.rightArrow]}
                                    onPress={handleNextImage}
                                    activeOpacity={0.8}
                                >
                                    <Icon name="chevron-forward" size={24} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </>
                    )}

                    {/* Dot Indicators */}
                    {images.length > 1 && (
                        <View style={styles.dotContainer}>
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentImageIndex === index && styles.activeDot
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    <ImageViewing
                        images={images.map(img => (typeof img === 'string' ? { uri: img } : img))}
                        imageIndex={currentImageIndex}
                        visible={isViewerVisible}
                        onRequestClose={() => setIsViewerVisible(false)}
                    />
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    <View style={styles.priceRow}>
                        <Text style={styles.productName}>{productName}</Text>
                        {/* <Tag label={productCondition} type="condition" /> */}
                    </View>

                    <Text style={styles.productPrice}>{productPrice}</Text>

                    <View style={styles.locationSection}>
                        <Tag
                            label={productLocation}
                            type="location"
                            icon={{ library: "Ionicons", name: "location", color: COLORS.primary }}
                        />
                        <View style={styles.divider} />
                        <Tag
                            label={productCollege}
                            type="college"
                            icon={{ library: "MaterialCommunityIcons", name: "school", color: COLORS.primary }}
                        />
                    </View>

                    <View style={styles.quickInfoPills}>
                        <Tag
                            label={product.postDate ? `Posted ${getTimeAgo(product.postDate)}` : "Posted recently"}
                            type="time"
                            icon={{ library: "Ionicons", name: "time-outline", color: "#6B7280" }}
                        />
                    </View>

                    <View style={styles.sectionDivider} />

                    <Text style={styles.sectionTitle}>Seller</Text>
                    <SellerCard
                        seller={product.seller}
                        sellerSince={sellerSince}
                        currentUser={currentUser}
                        onPress={() => navigation.navigate("ProfileScreen", {
                            sellerId: product.seller.id,
                            profileImage: product.seller.profileImage
                        })}
                    />

                    <View style={styles.sectionDivider} />

                    <Text style={styles.sectionTitle}>Description</Text>
                    <ExpandableText text={productDescription || "No description available."} />

                    <View style={styles.sectionDivider} />

                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <ProductDetailItem label="Condition" value={productCondition} />
                    <ProductDetailItem
                        label="Category"
                        value={product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'N/A'}
                    />
                    <ProductDetailItem label="Availability" value={product.itemStatus} type="availability" />

                    <View style={styles.sectionDivider} />

                    {/* Enhanced Map Section */}
                    <View style={styles.mapHeader}>
                        <Text style={styles.sectionTitle}>Location</Text>
                        <TouchableOpacity
                            style={styles.viewMapButton}
                            onPress={openInMaps}
                            activeOpacity={0.7}
                        >
                            <Icon name="map" size={16} color={COLORS.primary} />
                            <Text style={styles.viewMapText}>View in Maps</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.mapCard}>
                        <MapView
                            style={styles.map}
                            initialRegion={productCoordinates}
                            scrollEnabled={false}
                            zoomEnabled={false}
                        >
                            <Marker coordinate={productCoordinates} title={productName} />
                        </MapView>
                        <View style={styles.mapOverlay}>
                            <View style={styles.mapInfoCard}>
                                <View style={styles.mapIconCircle}>
                                    <Icon name="location" size={20} color={COLORS.primary} />
                                </View>
                                <View style={styles.mapInfo}>
                                    <Text style={styles.mapLocation}>{productLocation}</Text>
                                    <Text style={styles.mapCollege}>{productCollege}</Text>
                                    <Text style={styles.mapDistance}>~2.5 km away</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.directionsButton}
                                    onPress={openInMaps}
                                    activeOpacity={0.7}
                                >
                                    <Icon name="navigate" size={18} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.sectionDivider} />

                    {/* Safety Tips */}
                    <SafetyTips />

                    <View style={styles.sectionDivider} />

                    {/* Enhanced Reviews Section */}
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
                    </View>

                    {/* Rating Summary */}
                    <View style={styles.ratingSummaryCard}>
                        <View style={styles.ratingLeft}>
                            <Text style={styles.avgRatingNumber}>{avgRating}</Text>
                            <View style={styles.ratingStarsRow}>
                                {[...Array(5)].map((_, i) => (
                                    <Icon
                                        key={i}
                                        name={i < Math.floor(avgRating) ? "star" : "star-outline"}
                                        size={16}
                                        color="#FCD34D"
                                    />
                                ))}
                            </View>
                            <Text style={styles.totalReviews}>{reviews.length} reviews</Text>
                        </View>

                        <View style={styles.ratingRight}>
                            {ratingBreakdown.map(item => (
                                <View key={item.star} style={styles.ratingBarRow}>
                                    <Text style={styles.ratingBarLabel}>{item.star}★</Text>
                                    <View style={styles.ratingBarTrack}>
                                        <View
                                            style={[
                                                styles.ratingBarFill,
                                                { width: `${item.percentage}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.ratingBarCount}>{item.count}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    {/* Reviews List */}
                    <View style={styles.reviewsListContainer}>
                        {reviews.length === 0 ? (
                            <View style={styles.emptyReviewsContainer}>
                                <View style={styles.emptyReviewsIconCircle}>
                                    <Ionicons name="chatbox-ellipses-outline" size={32} color={COLORS.dark.textTertiary} />
                                </View>
                                <Text style={styles.emptyReviewsTitle}>No reviews yet</Text>
                                <Text style={styles.emptyReviewsSubtitle}>
                                    Be the first to share your experience with this seller
                                </Text>
                                <Button
                                    title="Write a Review"
                                    onPress={() =>
                                        navigation.navigate('AllReviewsScreen', {
                                            reviews,
                                            productName,
                                            productId: product.id,
                                            onAddReview: newReview => {
                                                setReviews(prev => [newReview, ...prev]);
                                            },
                                        })
                                    }
                                    variant="primary"
                                    size="medium"
                                    icon="create-outline"
                                    iconPosition="left"
                                    style={{ marginTop: THEME.spacing.md }}
                                />
                            </View>
                        ) : (
                            <>
                                <FlatList
                                    data={displayedReviews || []}
                                    renderItem={renderReviewItem}
                                    keyExtractor={(item, index) => {
                                        const id = item?.id ?? item?.reviewId ?? item?.reviewerId;
                                        return id ? String(id) : String(index);
                                    }}
                                    scrollEnabled={false}
                                />

                                <Button
                                    title={`View All ${reviews.length} Reviews`}
                                    onPress={() =>
                                        navigation.navigate('AllReviewsScreen', {
                                            reviews,
                                            productName,
                                            productId: product.id,
                                            onAddReview: newReview => {
                                                setReviews(prev => [newReview, ...prev]);
                                            },
                                        })
                                    }
                                    variant="ghost"
                                    size="small"
                                    icon="chevron-forward"
                                    iconPosition="right"
                                    fullWidth
                                    textStyle={{ color: COLORS.primary }}
                                />
                            </>
                        )}
                    </View>

                    <View style={styles.sectionDivider} />

                    {/* Enhanced Related Listings */}
                    <View style={styles.relatedHeader}>
                        <Text style={styles.sectionTitle}>Similar Listings</Text>
                    </View>

                    {relatedListings.length === 0 ? (
                        <View style={styles.emptyRelatedContainer}>
                            <Ionicons name="cube-outline" size={32} color={COLORS.gray500} />
                            <Text style={styles.emptyRelatedText}>
                                No similar listings found.
                            </Text>
                        </View>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.relatedList}
                        >
                            {relatedListings.slice(0, 5).map((item) => (
                                <Card
                                    key={item.id}
                                    item={item}
                                    horizontal
                                    onPress={() => navigation.push('ProductDetailsScreen', { item })}
                                />
                            ))}
                        </ScrollView>
                    )}

                </View>
            </ScrollView>

            {/* Floating Bottom Action Bar */}
            {!isOwnListing && (
                <View style={styles.bottomBar}>
                    <Button
                        title="Chat"
                        variant="primary"
                        size="medium"
                        icon="chatbubble-ellipses"
                        iconPosition="left"
                        onPress={openChatRoom}
                        style={styles.chatButton}
                    />
                </View>
            )}

            {/* Bottom Sheet Menu */}
            <BottomSheetMenu
                visible={showMenu}
                onClose={() => setShowMenu(false)}
                type="listing"
                title="Listing Options"
                onShare={() => {
                    shareItem({ type: 'LISTING', title: product.title, id: product.id });
                }}
                onReport={() => {
                    console.log('Report Listing');
                    navigation.navigate('ReportListingScreen', { listingId: product.id });
                }}
            />

            {
                toast.visible && (
                    <ToastMessage
                        type={toast.type}
                        title={toast.title}
                        message={toast.message}
                        onHide={() => setToast({ ...toast, visible: false })}
                    />
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    headerRow: {
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
    },
    headerActions: {
        flexDirection: "row",
        gap: THEME.spacing[2],
    },
    iconBtn: {
        width: THEME.layout.minTouchTarget - 4,
        height: THEME.layout.minTouchTarget - 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.transparentBlack50,
        borderRadius: THEME.borderRadius.full,
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 380,
        backgroundColor: COLORS.black,
        position: "relative",
    },
    imageSlide: {
        width: width,
        height: 380,
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    arrowButton: {
        position: "absolute",
        top: "50%",
        marginTop: -20,
        width: THEME.layout.minTouchTarget - 4,
        height: THEME.layout.minTouchTarget - 4,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.transparentBlack70,
        alignItems: "center",
        justifyContent: "center",
        zIndex: THEME.zIndex.dropdown,
    },
    leftArrow: {
        left: THEME.spacing.md,
    },
    rightArrow: {
        right: THEME.spacing.md,
    },
    dotContainer: {
        position: "absolute",
        bottom: THEME.spacing.sectionGap,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: THEME.spacing[2],
    },
    dot: {
        width: 8,
        height: 6,
        borderRadius: THEME.borderRadius.xs,
        backgroundColor: COLORS.transparentWhite30,
        marginHorizontal: THEME.spacing[1],
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 20,
        borderRadius: THEME.borderRadius.xs,
    },
    content: {
        backgroundColor: COLORS.dark.card,
        borderTopLeftRadius: THEME.borderRadius['2xl'],
        borderTopRightRadius: THEME.borderRadius['2xl'],
        marginTop: -THEME.spacing.sectionGap,
        paddingTop: THEME.spacing.sectionGap,
        paddingHorizontal: THEME.spacing.sectionGap,
        paddingBottom: 100,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    productPrice: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.primary,
        letterSpacing: THEME.letterSpacing.tight,
        marginBottom: THEME.spacing.itemGap,
    },
    productName: {
        fontSize: THEME.fontSize['2xl'],
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.itemGap,
        lineHeight: THEME.fontSize['2xl'] * THEME.lineHeight.snug,
    },
    quickInfoPills: {
        flexDirection: "row",
        marginTop: THEME.spacing.itemGap,
        gap: THEME.spacing[2],
    },
    locationSection: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: THEME.spacing.itemGap,
        borderTopWidth: THEME.borderWidth.hairline,
        borderBottomWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    divider: {
        width: THEME.borderWidth.hairline,
        height: 16,
        backgroundColor: COLORS.dark.border,
        marginHorizontal: THEME.spacing.itemGap,
    },
    sectionDivider: {
        height: THEME.borderWidth.hairline,
        backgroundColor: COLORS.dark.border,
        marginVertical: THEME.spacing.sectionGap,
    },
    sectionTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.md,
    },

    // Map Styles
    mapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    viewMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: THEME.spacing[1] + 2,
        backgroundColor: COLORS.primaryLightest,
        paddingHorizontal: THEME.spacing.itemGap,
        paddingVertical: THEME.spacing[1] + 2,
        borderRadius: THEME.borderRadius.sm,
    },
    viewMapText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.primary,
    },
    mapCard: {
        width: '100%',
        height: 200,
        borderRadius: THEME.borderRadius.card,
        overflow: 'hidden',
        marginBottom: THEME.spacing.itemGap,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    map: {
        flex: 1,
    },
    mapOverlay: {
        position: 'absolute',
        bottom: THEME.spacing.itemGap,
        left: THEME.spacing.itemGap,
        right: THEME.spacing.itemGap,
    },
    mapInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.md,
        padding: THEME.spacing.itemGap,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
        ...THEME.shadows.lg,
    },
    mapIconCircle: {
        width: THEME.layout.minTouchTarget - 4,
        height: THEME.layout.minTouchTarget - 4,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.primaryLightest,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: THEME.spacing.itemGap,
    },
    mapInfo: {
        flex: 1,
    },
    mapLocation: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing[0] + 2,
    },
    mapCollege: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.medium,
        marginBottom: THEME.spacing[0] + 2,
    },
    mapDistance: {
        fontSize: THEME.fontSize.xs - 1,
        color: COLORS.primary,
        fontWeight: THEME.fontWeight.bold,
    },
    directionsButton: {
        width: THEME.layout.minTouchTarget - 4,
        height: THEME.layout.minTouchTarget - 4,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: THEME.spacing[2],
    },

    // Reviews Styles
    reviewsHeader: {
        marginBottom: THEME.spacing.md,
    },
    ratingSummaryCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.bgElevated,
        borderRadius: THEME.borderRadius.card,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    ratingLeft: {
        alignItems: 'center',
        paddingRight: THEME.spacing.lg,
        borderRightWidth: THEME.borderWidth.hairline,
        borderRightColor: COLORS.dark.border,
        marginRight: THEME.spacing.lg,
    },
    avgRatingNumber: {
        fontSize: THEME.fontSize['6xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.dark.text,
        lineHeight: THEME.fontSize['6xl'] + 8,
    },
    ratingStarsRow: {
        flexDirection: 'row',
        marginBottom: THEME.spacing[2],
    },
    totalReviews: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        fontWeight: THEME.fontWeight.semibold,
    },
    ratingRight: {
        flex: 1,
        justifyContent: 'center',
    },
    ratingBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing[2],
    },
    ratingBarLabel: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.textSecondary,
        width: 30,
    },
    ratingBarTrack: {
        flex: 1,
        height: 6,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginHorizontal: THEME.spacing[2],
        overflow: 'hidden',
    },
    ratingBarFill: {
        height: '100%',
        backgroundColor: COLORS.warning,
        borderRadius: THEME.borderRadius.xs,
    },
    ratingBarCount: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textTertiary,
        width: 24,
        textAlign: 'right',
    },
    reviewsListContainer: {
        marginBottom: THEME.spacing.itemGap,
    },
    reviewCard: {
        backgroundColor: COLORS.dark.bgElevated,
        borderRadius: THEME.borderRadius.card,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.itemGap,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    reviewHeader: {
        marginBottom: THEME.spacing.itemGap,
    },
    reviewUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewAvatar: {
        width: THEME.layout.minTouchTarget,
        height: THEME.layout.minTouchTarget,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: THEME.spacing.itemGap,
    },
    reviewAvatarText: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.white,
    },
    reviewUserDetails: {
        flex: 1,
    },
    reviewNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: THEME.spacing[0] + 2,
    },
    reviewUser: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginRight: THEME.spacing[1] + 2,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reviewDate: {
        fontSize: THEME.fontSize.xs,
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
    },
    reviewRatingRow: {
        flexDirection: 'row',
        marginBottom: THEME.spacing[2] + 2,
    },
    reviewComment: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
        fontWeight: THEME.fontWeight.medium,
        marginBottom: THEME.spacing.itemGap,
    },
    viewAllReviewsText: {
        fontSize: THEME.fontSize.sm,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.primary,
    },
    emptyReviewsContainer: {
        alignItems: 'center',
        paddingVertical: THEME.spacing['2xl'],
        backgroundColor: COLORS.dark.bgElevated,
        borderRadius: THEME.borderRadius.card,
        borderWidth: THEME.borderWidth.hairline,
        borderColor: COLORS.dark.border,
    },
    emptyReviewsIconCircle: {
        width: 64,
        height: 64,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.md,
    },
    emptyReviewsTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.xs,
    },
    emptyReviewsSubtitle: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        paddingHorizontal: THEME.spacing.lg,
        lineHeight: THEME.fontSize.sm * THEME.lineHeight.relaxed,
    },

    // Related Listings Styles
    relatedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: THEME.spacing.md,
    },
    relatedList: {
        gap: THEME.spacing.itemGap,
    },
    emptyRelatedContainer: {
        paddingVertical: THEME.spacing['2xl'],
        alignItems: 'center',
        justifyContent: 'center',
        gap: THEME.spacing[2],
    },
    emptyRelatedText: {
        fontSize: THEME.fontSize.sm,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
    },

    // Bottom Bar Styles
    bottomWrapper: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        borderTopLeftRadius: THEME.borderRadius.xl,
        borderTopRightRadius: THEME.borderRadius.xl,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.itemGap,
        paddingBottom: Platform.OS === 'ios' ? THEME.spacing['2xl'] - 4 : THEME.spacing.itemGap,
    },
    chatButton: {
        flexDirection: "row",
        flex: 1,
        gap: THEME.spacing.itemGap,
    },
}); 