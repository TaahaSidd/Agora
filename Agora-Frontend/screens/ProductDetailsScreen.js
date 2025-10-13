import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    StatusBar,
    SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import Button from "../components/Button";
import Tag from "../components/Tag";
import { COLORS } from "../utils/colors";

const { height, width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item: product } = route.params;

    const images = product?.images?.length
        ? product.images
        : product?.image
            ? [{ uri: product.image }]
            : [require("../assets/adaptive-icon.png")];

    const productName = product?.title || product?.name || "Product";
    const productPrice = product?.price ? (product.price.includes('₹') ? product.price : `₹ ${product.price}`) : "N/A";
    const productCondition = product?.itemCondition || "Used";
    const productCollege = product?.college?.collegeName || "Unknown College";
    const productLocation = product?.college?.city || "City Name";
    const productDescription =
        product?.description || "No description provided for this product.";
    const sellerName =
        (product?.seller?.firstName && product?.seller?.lastName
            ? `${product.seller.firstName} ${product.seller.lastName}`
            : product?.seller?.userName) || "Seller Name";
    const sellerSince = "2025";

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent />
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconBtn}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerText}>Details</Text>

                <TouchableOpacity style={styles.iconBtn}>
                    <Entypo name="dots-three-vertical" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={images[0]}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.content}>
                    <View style={styles.productInfoSection}>
                        {productCollege && <Tag label={productCollege} />}
                        <Text style={styles.productName}>{productName}</Text>
                        <Text style={styles.productPrice}>{productPrice}</Text>

                        <View style={styles.metaInfo}>
                            <View style={styles.metaRow}>
                                <Icon name="location-outline" size={18} color={COLORS.gray} />
                                <Text style={styles.metaText}>{productLocation}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Icon name="shield-checkmark-outline" size={18} color="#4CAF50" />
                                <Text style={styles.metaText}>Verified Listing</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{productDescription}</Text>
                    </View>
                    <View style={styles.sellerContactSection}>
                        <Text style={styles.sectionTitle}>Seller Information</Text>
                        <TouchableOpacity
                            style={styles.sellerCard}
                            onPress={() =>
                                navigation.navigate("ProfileScreen", {  sellerId: product.sellerId })
                            }
                        >
                            <Image
                                source={
                                    product.seller?.avatar
                                        ? { uri: product.seller.avatar }
                                        : require("../assets/804948.png")
                                }
                                style={styles.sellerAvatar}
                            />
                            <View style={styles.sellerInfo}>
                                <View style={styles.sellerDetails}>
                                    <Text style={styles.sellerName}>{sellerName}</Text>
                                    <Text style={styles.sellerSince}>Member since {sellerSince}</Text>
                                </View>
                                <View style={styles.sellerRating}>
                                    <Icon name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>4.8</Text>
                                </View>
                                <Icon
                                    name="chevron-forward"
                                    size={20}
                                    color={COLORS.gray}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View style={styles.bottomButtons}>
                <Button
                    variant="secondary"
                    style={styles.chatButton}
                    title={<Icon name="chatbubble-outline" size={20} color={COLORS.primary} />}
                />
                <Button
                    variant="primary"
                    style={styles.offerButton}
                    title="Make Offer"
                    onPress={() => navigation.navigate("MakeOfferScreen", { item: product })}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerRow: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 40,
        paddingHorizontal: 16,
        height: 80,
        zIndex: 10,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff",
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        height: 320,
        backgroundColor: "#f8f8f8",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    content: {
        padding: 24,
        paddingBottom: 120,
        backgroundColor: "#fafafa",
    },
    productInfoSection: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    productName: {
        fontSize: 26,
        fontWeight: "700",
        color: COLORS.black,
        marginTop: 12,
        marginBottom: 8,
        lineHeight: 32,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: "600",
        color: COLORS.primary,
        marginBottom: 16,
    },
    metaInfo: {
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        paddingTop: 16,
        marginTop: 4,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    metaText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 10,
        fontWeight: "500",
    },
    descriptionSection: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sellerContactSection: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: COLORS.black,
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: "#666",
        lineHeight: 24,
    },
    sellerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e9ecef",
    },
    sellerAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    sellerInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: 16,
    },
    sellerDetails: {
        flex: 1,
    },
    sellerName: {
        fontSize: 17,
        fontWeight: "600",
        color: COLORS.black,
        marginBottom: 4,
    },
    sellerSince: {
        fontSize: 13,
        color: COLORS.gray,
    },
    sellerRating: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 12,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.black,
        marginLeft: 4,
    },
    bottomButtons: {
        position: "absolute",
        bottom: 24,
        left: 24,
        right: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    chatButton: {
        width: 64,
        height: 52,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    offerButton: {
        flex: 1,
        marginLeft: 16,
        height: 52,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
});
