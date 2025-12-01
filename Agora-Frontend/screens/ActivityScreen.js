import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import AppHeader from '../components/AppHeader';

const ActivityScreen = ({ scrollY }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const activityData = [
        {
            id: '1',
            type: 'listed',
            itemName: 'MacBook Pro M3',
            description: 'Successfully listed',
            time: '2h ago',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            image: require('../assets/no-image.jpg'),
            price: '$1,299',
            status: 'active',
        },
        {
            id: '2',
            type: 'offer',
            itemName: 'Mountain Bike',
            description: 'New offer received',
            time: '5h ago',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            image: require('../assets/no-image.jpg'),
            price: '$450',
            offerAmount: '$420',
            status: 'pending',
        },
        {
            id: '3',
            type: 'sold',
            itemName: 'Nike Air Max',
            description: 'Item sold',
            time: '1d ago',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            image: require('../assets/no-image.jpg'),
            price: '$120',
            status: 'completed',
        },
        {
            id: '4',
            type: 'message',
            itemName: 'Wireless Headphones',
            description: 'You have 2 new messages',
            time: '1d ago',
            timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000),
            image: require('../assets/no-image.jpg'),
            status: 'unread',
        },
        {
            id: '5',
            type: 'view',
            itemName: 'Gaming Console',
            description: '15 people viewed your item',
            time: '2d ago',
            timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
            image: require('../assets/no-image.jpg'),
            views: 15,
            status: 'info',
        },
        {
            id: '6',
            type: 'listed',
            itemName: 'Leather Jacket',
            description: 'Successfully listed',
            time: '3d ago',
            timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
            image: require('../assets/no-image.jpg'),
            price: '$85',
            status: 'active',
        },
    ];

    const filters = [
        { id: 'all', label: 'All', icon: 'grid-outline' },
        { id: 'listed', label: 'Listed', icon: 'pricetag-outline' },
        { id: 'offer', label: 'Offers', icon: 'cash-outline' },
        { id: 'sold', label: 'Sold', icon: 'checkmark-circle-outline' },
        { id: 'message', label: 'Messages', icon: 'chatbubble-outline' },
    ];

    const getActivityIcon = (type) => {
        switch (type) {
            case 'listed':
                return { name: 'pricetag', color: COLORS.primary, bg: `${COLORS.primary}30` };
            case 'offer':
                return { name: 'cash', color: '#FF9500', bg: '#FF950030' };
            case 'sold':
                return { name: 'checkmark-circle', color: '#34C759', bg: '#34C75930' };
            case 'message':
                return { name: 'chatbubble', color: '#5856D6', bg: '#5856D630' };
            case 'view':
                return { name: 'eye', color: '#007AFF', bg: '#007AFF30' };
            default:
                return { name: 'information-circle', color: COLORS.dark.textTertiary, bg: COLORS.dark.cardElevated };
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return { label: 'Active', color: '#34C759', bg: '#34C75930' };
            case 'pending':
                return { label: 'Pending', color: '#FF9500', bg: '#FF950030' };
            case 'completed':
                return { label: 'Completed', color: COLORS.dark.textSecondary, bg: COLORS.dark.cardElevated };
            case 'unread':
                return { label: 'Unread', color: '#FF3B30', bg: '#FF3B3030' };
            default:
                return null;
        }
    };

    const filteredData = activeFilter === 'all'
        ? activityData
        : activityData.filter(item => item.type === activeFilter);

    const groupByDate = (data) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const groups = {
            today: [],
            yesterday: [],
            older: [],
        };

        data.forEach(item => {
            const itemDate = new Date(item.timestamp);
            itemDate.setHours(0, 0, 0, 0);

            if (itemDate.getTime() === today.getTime()) {
                groups.today.push(item);
            } else if (itemDate.getTime() === yesterday.getTime()) {
                groups.yesterday.push(item);
            } else {
                groups.older.push(item);
            }
        });

        return groups;
    };

    const groupedData = groupByDate(filteredData);

    const renderSectionHeader = (title) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const renderItem = ({ item }) => {
        const icon = getActivityIcon(item.type);
        const badge = getStatusBadge(item.status);

        return (
            <TouchableOpacity activeOpacity={0.7}>
                <View style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.leftSection}>
                            <View style={[styles.iconContainer, { backgroundColor: icon.bg }]}>
                                <Ionicons name={icon.name} size={20} color={icon.color} />
                            </View>
                            <Image source={item.image} style={styles.image} />
                        </View>

                        <View style={styles.info}>
                            <View style={styles.titleRow}>
                                <Text style={styles.itemName} numberOfLines={1}>
                                    {item.itemName}
                                </Text>
                                {badge && (
                                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                                        <Text style={[styles.badgeText, { color: badge.color }]}>
                                            {badge.label}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.description} numberOfLines={1}>
                                {item.description}
                            </Text>

                            <View style={styles.metaRow}>
                                <View style={styles.timeContainer}>
                                    <Ionicons name="time-outline" size={14} color={COLORS.dark.textTertiary} />
                                    <Text style={styles.time}>{item.time}</Text>
                                </View>

                                {item.price && (
                                    <Text style={styles.price}>{item.price}</Text>
                                )}

                                {item.offerAmount && (
                                    <Text style={styles.offerAmount}>Offer: {item.offerAmount}</Text>
                                )}

                                {item.views && (
                                    <View style={styles.viewsContainer}>
                                        <Ionicons name="eye-outline" size={14} color={COLORS.dark.textTertiary} />
                                        <Text style={styles.viewsText}>{item.views} views</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <Ionicons name="chevron-forward" size={20} color={COLORS.dark.textTertiary} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFlatListData = () => {
        const sections = [];

        if (groupedData.today.length > 0) {
            sections.push({ type: 'header', title: 'Today' });
            sections.push(...groupedData.today.map(item => ({ type: 'item', data: item })));
        }

        if (groupedData.yesterday.length > 0) {
            sections.push({ type: 'header', title: 'Yesterday' });
            sections.push(...groupedData.yesterday.map(item => ({ type: 'item', data: item })));
        }

        if (groupedData.older.length > 0) {
            sections.push({ type: 'header', title: 'Older' });
            sections.push(...groupedData.older.map(item => ({ type: 'item', data: item })));
        }

        return sections;
    };

    const flatListData = renderFlatListData();

    return (
        <SafeAreaView style={styles.container} >
            <AppHeader title="Activity" />

            {/* Filter Pills */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={filters}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => setActiveFilter(item.id)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.filterPill,
                                    activeFilter === item.id && styles.filterPillActive,
                                ]}
                            >
                                <Ionicons
                                    name={item.icon}
                                    size={18}
                                    color={activeFilter === item.id ? COLORS.white : COLORS.primary}
                                />
                                <Text
                                    style={[
                                        styles.filterText,
                                        activeFilter === item.id && styles.filterTextActive,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Activity List */}
            {
                flatListData.length > 0 ? (
                    <Animated.FlatList
                        data={flatListData}
                        keyExtractor={(item, index) =>
                            item.type === 'header' ? `header-${item.title}` : `item-${item.data.id}`
                        }
                        renderItem={({ item }) =>
                            item.type === 'header'
                                ? renderSectionHeader(item.title)
                                : renderItem({ item: item.data })
                        }
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                        contentContainerStyle={styles.listContent}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="notifications-off-outline" size={64} color={COLORS.dark.textTertiary} />
                        </View>
                        <Text style={styles.emptyTitle}>No Activity Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            When you list items or receive offers, they'll appear here
                        </Text>
                    </View>
                )
            }
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    filterContainer: {
        backgroundColor: COLORS.dark.bgElevated,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
        paddingVertical: THEME.spacing.sm,
    },
    filterContent: {
        paddingHorizontal: THEME.spacing.md,
        gap: THEME.spacing.sm,
    },
    filterPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: THEME.spacing.sm,
        paddingHorizontal: THEME.spacing.md,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: `${COLORS.primary}20`,
        marginRight: THEME.spacing.sm,
        gap: 6,
    },
    filterPillActive: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    filterTextActive: {
        color: COLORS.white,
    },
    listContent: {
        paddingVertical: THEME.spacing.sm,
    },
    sectionHeader: {
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.sm,
        backgroundColor: COLORS.dark.bg,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark.textSecondary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    card: {
        marginHorizontal: THEME.spacing.md,
        marginVertical: 4,
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: COLORS.dark.card,
        shadowColor: COLORS.black,
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 4,
    },
    cardContent: {
        flexDirection: 'row',
        padding: THEME.spacing.md,
        alignItems: 'center',
    },
    leftSection: {
        position: 'relative',
        marginRight: THEME.spacing.md,
    },
    iconContainer: {
        position: 'absolute',
        top: -6,
        left: -6,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        borderWidth: 2,
        borderColor: COLORS.dark.card,
    },
    image: {
        width: 64,
        height: 64,
        borderRadius: THEME.borderRadius.md,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    itemName: {
        fontWeight: '700',
        fontSize: 16,
        color: COLORS.dark.text,
        flex: 1,
    },
    badge: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: THEME.borderRadius.sm,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 14,
        color: COLORS.dark.textSecondary,
        marginTop: 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 6,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    time: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    offerAmount: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FF9500',
    },
    viewsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewsText: {
        fontSize: 12,
        color: COLORS.dark.textTertiary,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: THEME.spacing.xl,
        paddingBottom: 80,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.dark.cardElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: THEME.spacing.lg,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: THEME.spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        color: COLORS.dark.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default ActivityScreen;