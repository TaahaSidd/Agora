import React, { useRef, useMemo } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";

import Button from "../components/Button";
import Tag from "../components/Tag";
import { COLORS } from "../utils/colors";

const { height, width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item: product } = route.params;

    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["60%", "80%"], []);

    const images = product?.images?.length ? product.images : [product?.image];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent />

            {/* Overlay Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.iconBtn}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerText}>{product?.heading || "Details"}</Text>

                <TouchableOpacity style={styles.iconBtn}>
                    <Entypo name="dots-three-vertical" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Image Carousel */}
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
            >
                {images.map((img, idx) => (
                    <Image
                        key={idx}
                        source={
                            typeof img === "string"
                                ? { uri: img }
                                : img || require("../assets/adaptive-icon.png")
                        }
                        style={styles.image}
                        resizeMode="cover"
                    />
                ))}
            </ScrollView>

            {/* Bottom Sheet */}
            <BottomSheet
                ref={sheetRef}
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                style={styles.bottomSheet}
            >
                <View style={styles.sheetInner}>
                    <ScrollView contentContainerStyle={styles.content}>
                        {/* College Tag */}
                        {product?.college && <Tag label={product.college} />}

                        {/* Product Name & Price */}
                        <Text style={styles.name}>{product.name}</Text>
                        <Text style={styles.price}>{product.price}</Text>

                        {/* Metadata */}
                        <View style={styles.metaRow}>
                            <Ionicons name="location-outline" size={16} color="#555" />
                            <Text style={styles.metaText}>
                                {product.location || "City Name"}
                            </Text>
                            <Ionicons
                                name="pricetag-outline"
                                size={16}
                                color="#555"
                                style={{ marginLeft: 20 }}
                            />
                            <Text style={styles.metaText}>
                                {product.condition || "Used"}
                            </Text>
                        </View>

                        {/* Tags */}
                        <View style={styles.tagsRow}>
                            {(product.tags || ["Negotiable", "Brand New"]).map((tag, idx) => (
                                <Tag key={idx} label={tag} />
                            ))}
                        </View>

                        {/* Description */}
                        <View style={{ marginTop: 16 }}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>
                                {product.description ||
                                    "No description provided for this product."}
                            </Text>
                        </View>

                        {/* Seller Info */}
                        <TouchableOpacity
                            style={styles.sellerCard}
                            onPress={() =>
                                navigation.navigate("Profile", { seller: product.seller })
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
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                {/* Name + Verified Tag */}
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <Text style={styles.sellerName}>
                                        {product.seller?.name || "Seller Name"}
                                    </Text>
                                    {product.seller?.verified && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={16}
                                            color={COLORS.primary}
                                            style={{ marginLeft: 6 }}
                                        />
                                    )}
                                </View>

                                <Text style={styles.sellerInfo}>
                                    Member since {product.seller?.memberSince || "2023"}
                                </Text>
                            </View>

                            {/* Small Chat Button */}
                            <Button
                                onPress={() => { }}
                                variant="primary"
                                style={styles.chatButtonSmall}
                                textStyle={{ fontSize: 14 }}
                                title="Chat"
                            />
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Sticky Buttons */}
                    <View style={styles.buttons}>
                        <Button
                            variant="secondary"
                            style={styles.chatButton}
                            title={<Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />}
                        />
                        <Button
                            variant="primary"
                            style={styles.offerButton}
                            title="Make Offer"
                        />
                    </View>
                </View>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
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
    iconBtn: { padding: 8, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 20 },
    headerText: { fontSize: 18, fontWeight: "600", color: "#fff" },
    image: { width, height: height * 0.4 },
    bottomSheet: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
    sheetInner: { flex: 1, paddingHorizontal: 20, paddingBottom: 120 },
    content: { paddingBottom: 20 },
    name: { fontSize: 24, fontWeight: "700", color: "#000", marginTop: 12, marginBottom: 6 },
    price: { fontSize: 20, fontWeight: "600", color: "#000", marginBottom: 12 },
    metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    metaText: { fontSize: 14, color: "#555", marginLeft: 4 },
    tagsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: "700", color: "#000", marginBottom: 6 },
    description: { fontSize: 14, color: "#444", lineHeight: 22, marginBottom: 16 },
    sellerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 12,
    },
    sellerAvatar: { width: 50, height: 50, borderRadius: 25 },
    sellerName: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 2 },
    sellerInfo: { fontSize: 12, color: "#555" },
    chatButtonSmall: { width: 70, height: 36, borderRadius: 8 },
    buttons: {
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    chatButton: { width: 60, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    offerButton: { flex: 1, marginLeft: 12, height: 48, borderRadius: 12 },
});
