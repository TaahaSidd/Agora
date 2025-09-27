import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/colors';

const isAndroid = Platform.OS === 'android';

const chats = [
    {
        id: '1',
        name: 'Alice Johnson',
        lastMessage: 'Hey! Is the laptop still available?',
        avatar: require('../assets/manavatar.jpg'),
        sent: false,
        time: '2h',
        unread: true,
    },
    {
        id: '2',
        name: 'Bob Smith',
        lastMessage: 'I’ll let you know by tomorrow.',
        avatar: require('../assets/womenavatar.jpg'),
        sent: true,
        time: '5h',
        unread: false,
    },
    {
        id: '3',
        name: 'Charlie Lee',
        lastMessage: 'Can you lower the price?',
        avatar: require('../assets/manavatar.jpg'),
        sent: false,
        time: '1d',
        unread: true,
    },
    {
        id: '4',
        name: 'Dana White',
        lastMessage: 'Sure, sounds good.',
        avatar: require('../assets/womenavatar.jpg'),
        sent: true,
        time: '3d',
        unread: false,
    },
];

const ChatScreen = () => {
    const navigation = useNavigation();

    const renderChatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
                navigation.navigate('ChatRoomScreen', { // fix the issue with chatroom not opening
                    chatId: item.id,
                    name: item.name,
                    avatar: item.avatar,
                    sent: item.sent,
                    unread: item.unread,
                })
            }
        >
            <Image source={item.avatar} style={styles.avatar} />
            <View style={styles.chatContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text
                    style={[
                        styles.lastMessage,
                        item.sent ? styles.sentMessage : styles.receivedMessage,
                    ]}
                    numberOfLines={1}
                >
                    {item.lastMessage}
                </Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.time}>{item.time}</Text>
                {item.unread && <View style={styles.unreadDot} />}
            </View>
        </TouchableOpacity >
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Chats</Text>
                </View>

                {/* Chats List */}
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChatItem}
                    contentContainerStyle={{ paddingBottom: 16 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: isAndroid ? StatusBar.currentHeight : 0,
    },
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.darkBlue,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
    chatContent: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 2 },
    lastMessage: { fontSize: 14 },
    sentMessage: { color: '#777' }, // lighter for sent
    receivedMessage: { color: '#111' }, // darker for received
    rightSection: { alignItems: 'flex-end', justifyContent: 'center' },
    time: { fontSize: 12, color: '#999', marginBottom: 4 },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
    },
});

export default ChatScreen;
