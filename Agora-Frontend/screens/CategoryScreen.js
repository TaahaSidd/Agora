import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    StatusBar
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/Cards';
import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import EmptyBoxSvg from '../assets/svg/NoCatSVG.svg';

import { useCategoryItems } from '../hooks/useCategoryItems';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';

const CategoryScreen = ({ route, navigation }) => {
    const { categoryId, categoryName } = route.params;
    const { items, loading, error } = useCategoryItems(categoryId);

    const mappedItems = items.map(i => ({
        ...i,
        images: i.imageUrl && i.imageUrl.length > 0
            ? i.imageUrl.map(url => ({ uri: url }))
            : [require('../assets/no-image.jpg')],
        name: i.title || 'Untitled',
    }));

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
                <AppHeader title={categoryName} onBack={() => navigation.goBack()} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading {categoryName}...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <AppHeader title={categoryName} onBack={() => navigation.goBack()} />
                <View style={styles.errorContainer}>
                    <View style={styles.errorIconCircle}>
                        <Ionicons name="alert-circle" size={48} color={COLORS.error} />
                    </View>
                    <Text style={styles.errorTitle}>Something went wrong</Text>
                    <Text style={styles.errorText}>
                        We couldn't load the items. Please check your connection.
                    </Text>
                    <Button
                        title="Try Again"
                        variant="primary"
                        onPress={() => navigation.replace('CategoryScreen', { categoryId, categoryName })}
                        style={{ width: 200 }}
                    />
                </View>
            </SafeAreaView>
        );
    }

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <EmptyBoxSvg width={200} height={200} />
            <Text style={styles.emptyTitle}>No Items Found</Text>
            <Text style={styles.emptyText}>
                Be the first to list something in this category or check back later!
            </Text>
            {/*<Button*/}
            {/*    title="Go Back"*/}
            {/*    variant="secondary"*/}
            {/*    onPress={() => navigation.goBack()}*/}
            {/*/>*/}
        </View>

    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
            <AppHeader title={categoryName} onBack={() => navigation.goBack()} />
            <View style={styles.container}>
                <FlatList
                    data={mappedItems}
                    renderItem={({ item }) => <Card item={item} />}
                    keyExtractor={item => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    container: {
        flex: 1,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingTop: 16,
        paddingBottom: 40,
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.light.textSecondary,
        fontWeight: '600',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    errorIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.error + '15', // Soft 15% opacity error color
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.light.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 15,
        color: COLORS.light.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        //marginTop: 10,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.light.text,
        marginTop: 20,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.light.textTertiary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
});

export default CategoryScreen;