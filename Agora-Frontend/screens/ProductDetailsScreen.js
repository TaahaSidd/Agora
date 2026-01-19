import React, {useEffect, useRef, useState} from "react";
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
import {useNavigation, useRoute} from "@react-navigation/native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Image} from "expo-image";
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

import {shareItem} from '../services/share';
import {useUserStore} from "../stores/userStore";
import {useListings} from "../hooks/useListings";

import {COLORS} from "../utils/colors";
import {THEME} from "../utils/theme";
import { formatPrice } from '../utils/formatters';


const {height, width} = Dimensions.get("window");

export default function ProductDetailsScreen() {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const product = route.params?.item;
    //console.log("PRODUCT", product);
    const {items: allListings} = useListings();
    const [toast, setToast] = useState({visible: false, type: '', title: '', message: ''});
    const showToast = ({type, title, message}) => {
        setToast({visible: true, type, title, message});
    };
    const {currentUser, loading, isGuest} = useUserStore();
    const isOwnListing = currentUser?.id === product?.seller?.id;
    const [isViewerVisible, setIsViewerVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const flatListRef = useRef(null);
    const [chatLoading, setChatLoading] = useState(false);

    const relatedListings = allListings.filter((listing) => listing.id !== product.id && listing.category === product.category);

    if (!product) {
        return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Product not found!</Text>
        </View>);
    }

    const images = product?.images?.length ? product.images : product?.image ? [{uri: product.image}] : [require("../assets/no-image.jpg")];

    const productName = product?.title || product?.name || "Product";
    const productPrice = product?.price ? (product.price.includes('₹') ? product.price : `₹ ${product.price}`) : "N/A";
    const productCondition = product?.itemCondition || "Used";
    const productCollege = product?.college?.collegeName || "Unknown College";
    const productDescription = product?.description || "No description provided for this product.";
    const sellerSince = "2025";

    let sellerAvatar = product.seller?.avatar;
    if (sellerAvatar?.includes('localhost')) {
        sellerAvatar = sellerAvatar.replace('localhost', '192.168.8.15');
    }

    const scrollViewRef = useRef(null);

    //Scroll to top
    useEffect(() => {
        scrollViewRef.current?.scrollTo({y: 0, animated: false});
    }, [product?.id]);

    // const openInMaps = () => {
    //     if (!product?.college?.latitude || !product?.college?.longitude) return;
    //
    //     const lat = Number(product.college.latitude);
    //     const lng = Number(product.college.longitude);
    //     const label = product.college.collegeName || "College";
    //
    //     const scheme = Platform.select({
    //         ios: 'maps://0,0?q=', android: 'geo:0,0?q='
    //     });
    //
    //     const latLng = `${lat},${lng}`;
    //
    //     const url = Platform.select({
    //         ios: `${scheme}${label}@${latLng}`, android: `${scheme}${latLng}(${label})`
    //     });
    //
    //     Linking.openURL(url);
    // };

    const openChatRoom = async () => {
        if (loading || chatLoading) return;
        if (isGuest || !currentUser?.id) {
            showToast({
                type: 'info', title: 'Login Required', message: 'Please log in to chat with the seller.',
            });
            return;
        }

        if (!product?.seller || !product.seller.id) {
            console.warn("Seller data not loaded yet");
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
            flatListRef.current?.scrollToIndex({index: nextIndex, animated: true});
        }
    };

    const handlePreviousImage = () => {
        if (currentImageIndex > 0) {
            const prevIndex = currentImageIndex - 1;
            setCurrentImageIndex(prevIndex);
            flatListRef.current?.scrollToIndex({index: prevIndex, animated: true});
        }
    };

    const onViewableItemsChanged = useRef(({viewableItems}) => {
        if (viewableItems.length > 0) {
            setCurrentImageIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50
    }).current;

    const renderImageItem = ({item, index}) => (<TouchableOpacity
        onPress={() => {
            setCurrentImageIndex(index);
            setIsViewerVisible(true);
        }}
        style={styles.imageSlide}
        activeOpacity={0.9}
    >
        <Image
            source={typeof item === 'string' ? {uri: item} : item}
            style={styles.productImage}
            resizeMode="cover"
        />
    </TouchableOpacity>);

    return (<View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>

            {/* Floating Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Icon name="arrow-back" size={24} color="#fff"/>
                </TouchableOpacity>

                <View style={styles.headerActions}>
                    {/*<FavoriteButton listingId={product.id} size={24}/>*/}
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setShowMenu(true)}
                        style={styles.iconBtn}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color="#fff"/>
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
                            <Icon name="chevron-back" size={24} color="#fff"/>
                        </TouchableOpacity>)}
                        {currentImageIndex < images.length - 1 && (<TouchableOpacity
                            style={[styles.arrowButton, styles.rightArrow]}
                            onPress={handleNextImage}
                            activeOpacity={0.8}
                        >
                            <Icon name="chevron-forward" size={24} color="#fff"/>
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
                        images={images.map(img => (typeof img === 'string' ? {uri: img} : img))}
                        imageIndex={currentImageIndex}
                        visible={isViewerVisible}
                        onRequestClose={() => setIsViewerVisible(false)}
                    />
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Title  */}
                    <View style={styles.titleSection}>
                        <Text style={styles.productName}>{productName}</Text>
                        <FavoriteButton listingId={product.id} size={28}/>
                    </View>

                    {/* Price + Condition Badge */}
                    <Text style={styles.productPrice}>{formatPrice(productPrice)}</Text>

                    {/* College Row */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <View style={styles.infoIconCircle}>
                                <Icon name="school" size={16} color={COLORS.primary}/>
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabel}>College</Text>
                                <Text style={styles.infoValue} numberOfLines={1}>{productCollege}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <ExpandableText text={productDescription || "No description available."}/>

                    <View style={styles.sectionDivider}/>

                    <Text style={styles.sectionTitle}>Seller</Text>
                    <SellerCard
                        seller={product.seller}
                        sellerSince={sellerSince}
                        currentUser={currentUser}
                        onPress={() => navigation.navigate("ProfileScreen", {
                            sellerId: product.seller.id, profileImage: product.seller.profileImage
                        })}
                    />

                    <View style={styles.sectionDivider}/>

                    {/*<Text style={styles.sectionTitle}>Description</Text>*/}
                    {/*<ExpandableText text={productDescription || "No description available."}/>*/}
                    {/*<View style={styles.sectionDivider}/>*/}

                    <Text style={styles.sectionTitle}>Product Details</Text>
                    <View style={styles.detailsGrid}>
                        <ProductDetailItem label="Condition" value={productCondition}/>
                        <ProductDetailItem
                            label="Category"
                            value={product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'N/A'}
                        />
                        <ProductDetailItem label="Availability" value={product.itemStatus} type="availability"/>
                    </View>

                    <View style={styles.sectionDivider}/>

                    {/*/!* Enhanced Map Section *!/*/}
                    {/*<View style={styles.mapHeader}>*/}
                    {/*    <Text style={styles.sectionTitle}>Location</Text>*/}
                    {/*    <TouchableOpacity*/}
                    {/*        style={styles.viewMapButton}*/}
                    {/*        onPress={openInMaps}*/}
                    {/*        activeOpacity={0.7}*/}
                    {/*    >*/}
                    {/*        <Icon name="navigate" size={16} color={COLORS.primary}/>*/}
                    {/*        <Text style={styles.viewMapText}>Directions</Text>*/}
                    {/*    </TouchableOpacity>*/}
                    {/*</View>*/}

                    {/*<View style={styles.mapCard}>*/}
                    {/*    <MapView*/}
                    {/*        style={styles.map}*/}
                    {/*        initialRegion={productCoordinates}*/}
                    {/*        scrollEnabled={false}*/}
                    {/*        zoomEnabled={false}*/}
                    {/*    >*/}
                    {/*        <Marker coordinate={productCoordinates} title={productName}/>*/}
                    {/*    </MapView>*/}
                    {/*</View>*/}

                    {/*<View style={styles.sectionDivider}/>*/}

                    {/* Enhanced Related Listings */}
                    <View style={styles.relatedHeader}>
                        <Text style={styles.sectionTitle}>Similar Listings</Text>
                    </View>

                    {relatedListings.length === 0 ? (<View style={styles.emptyRelatedContainer}>
                        <Ionicons name="cube-outline" size={32} color={COLORS.gray500}/>
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
                            onPress={() => navigation.push('ProductDetailsScreen', {item})}
                        />))}
                    </ScrollView>)}

                    <View style={styles.sectionDivider}/>

                    {/* Safety Tips */}
                    <SafetyTips/>

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

            {/* Bottom Sheet Menu */}
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
                    shareItem({type: 'LISTING', title: product.title, id: product.id});
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
                onHide={() => setToast({...toast, visible: false})}
            />)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: COLORS.dark.bg,
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
        backgroundColor: COLORS.transparentBlack50,
        borderRadius: THEME.borderRadius.full,
    }, scrollView: {
        flex: 1,
    }, imageContainer: {
        height: 380, backgroundColor: COLORS.black, position: "relative",
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
        backgroundColor: COLORS.transparentBlack70,
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
        width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.transparentWhite30, marginHorizontal: 3,
    }, activeDot: {
        backgroundColor: COLORS.white, width: 24,
    }, content: {
        backgroundColor: COLORS.dark.bg,
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
        color: COLORS.dark.textSecondary,
        lineHeight: THEME.fontSize['2xl'] * 1.3,
        letterSpacing: -0.5,
        paddingRight: THEME.spacing.md,
    },
    productPrice: {
        fontSize: THEME.fontSize['3xl'],
        fontWeight: THEME.fontWeight.extrabold,
        color: COLORS.gray400,
        letterSpacing: -0.8,
        marginBottom: THEME.spacing.lg,
    }, infoRow: {
        flexDirection: "row",
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing.md,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
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
        color: COLORS.dark.textTertiary,
        fontWeight: THEME.fontWeight.medium,
        marginBottom: 2,
    }, infoValue: {
        fontSize: THEME.fontSize.sm, color: COLORS.dark.text, fontWeight: THEME.fontWeight.semibold,
    }, infoSeparator: {
        width: 1, backgroundColor: COLORS.dark.border, marginHorizontal: THEME.spacing.md,
    }, sectionDivider: {
        height: 1, backgroundColor: COLORS.dark.border, marginVertical: THEME.spacing.lg,
    }, sectionTitle: {
        fontSize: THEME.fontSize.lg,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.md,
    }, detailsGrid: {
        gap: THEME.spacing[2],
    }, mapHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: THEME.spacing.md,
    }, viewMapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: THEME.spacing[1],
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: THEME.spacing[3],
        paddingVertical: THEME.spacing[2],
        borderRadius: THEME.borderRadius.lg,
    }, viewMapText: {
        fontSize: THEME.fontSize.sm, fontWeight: THEME.fontWeight.bold, color: COLORS.primary,
    }, mapCard: {
        width: '100%',
        height: 180,
        borderRadius: THEME.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    }, map: {
        flex: 1,
    }, reviewsHeader: {
        marginBottom: THEME.spacing.md,
    }, ratingSummaryCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    }, ratingLeft: {
        alignItems: 'center',
        paddingRight: THEME.spacing.lg,
        borderRightWidth: 1,
        borderRightColor: COLORS.dark.border,
        marginRight: THEME.spacing.lg,
    }, avgRatingNumber: {
        fontSize: 48, fontWeight: THEME.fontWeight.extrabold, color: COLORS.dark.text, lineHeight: 52,
    }, ratingStarsRow: {
        flexDirection: 'row', marginBottom: THEME.spacing[2],
    }, totalReviews: {
        fontSize: THEME.fontSize.sm, color: COLORS.dark.textSecondary, fontWeight: THEME.fontWeight.semibold,
    }, ratingRight: {
        flex: 1, justifyContent: 'center',
    }, ratingBarRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: THEME.spacing[2],
    }, ratingBarLabel: {
        fontSize: THEME.fontSize.xs, fontWeight: THEME.fontWeight.bold, color: COLORS.dark.textSecondary, width: 30,
    }, ratingBarTrack: {
        flex: 1,
        height: 6,
        backgroundColor: COLORS.dark.cardElevated,
        borderRadius: THEME.borderRadius.xs,
        marginHorizontal: THEME.spacing[2],
        overflow: 'hidden',
    }, ratingBarFill: {
        height: '100%', backgroundColor: COLORS.warning, borderRadius: THEME.borderRadius.xs,
    }, ratingBarCount: {
        fontSize: THEME.fontSize.xs,
        fontWeight: THEME.fontWeight.semibold,
        color: COLORS.dark.textTertiary,
        width: 24,
        textAlign: 'right',
    }, reviewsListContainer: {
        marginBottom: THEME.spacing.md,
    }, reviewCard: {
        backgroundColor: COLORS.dark.card,
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.md,
        marginBottom: THEME.spacing[2],
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    }, reviewHeader: {
        marginBottom: THEME.spacing[2],
    }, reviewUserInfo: {
        flexDirection: 'row', alignItems: 'center',
    }, reviewAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: THEME.spacing[3],
    }, reviewAvatarText: {
        fontSize: THEME.fontSize.lg, fontWeight: THEME.fontWeight.extrabold, color: COLORS.white,
    }, reviewUserDetails: {
        flex: 1,
    }, reviewNameRow: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 2,
    }, reviewUser: {
        fontSize: THEME.fontSize.base,
        fontWeight: THEME.fontWeight.bold,
        color: COLORS.dark.text,
        marginRight: THEME.spacing[1],
    }, verifiedBadge: {
        flexDirection: 'row', alignItems: 'center',
    }, // Related Listings Styles
    relatedHeader: {
        marginBottom: THEME.spacing.md,
    }, relatedList: {
        gap: THEME.spacing[3],
    }, emptyRelatedContainer: {
        paddingVertical: THEME.spacing['2xl'], alignItems: 'center', gap: THEME.spacing[2],
    }, emptyRelatedText: {
        fontSize: THEME.fontSize.sm, color: COLORS.dark.textSecondary, textAlign: 'center',
    }, bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: THEME.spacing.md,
        paddingTop: THEME.spacing[3],
        paddingBottom: Platform.OS === 'ios' ? THEME.spacing['2xl'] : THEME.spacing[3],
    },
});
