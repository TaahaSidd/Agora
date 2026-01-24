import React, {useEffect, useRef, useState} from 'react';
import {
    FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {COLORS} from '../utils/colors';

import {useChatMessages} from '../hooks/useChatMessages';
import {getOrCreateChatRoom, sendMessage} from '../services/chatService';
import {useMarkChatAsRead} from "../hooks/useMarkChatAsRead";
import {useUserStore} from "../stores/userStore";
import {useChatBlocking} from '../context/ChatBlockingProvider';

const ChatRoomScreen = ({route, navigation}) => {
    const insets = useSafeAreaInsets();
    const {roomId, sellerId} = route.params;
    const messages = useChatMessages(roomId);
    const {sellerName, productInfo} = route.params || {};
    const [input, setInput] = useState('');
    const {currentUser, loading} = useUserStore();
    const {isUserBlocked} = useChatBlocking();
    const flatListRef = useRef(null);
    const {sellerAvatar} = route.params;
    const markChatAsRead = useMarkChatAsRead();

    const isOtherUserBlocked = isUserBlocked(sellerId);

    let avatarUri = sellerAvatar;

    if (typeof avatarUri === 'string' && avatarUri.includes('localhost')) {
        avatarUri = avatarUri.replace('localhost', '192.168.8.15');
    }

    if (!avatarUri) {
        avatarUri = require('../assets/defaultProfile.png');
    }

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({animated: true});
                }, 100);
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({animated: false});
                }, 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const markAsRead = async () => {
            if (!roomId || !currentUser?.email) return;

            if (messages && messages.length > 0) {
                try {
                    const sanitizedEmail = currentUser.email.replace(/\./g, '_');
                    await markChatAsRead(roomId, sanitizedEmail);
                } catch (err) {
                    console.error('❌ ChatRoom mark failed:', err);
                }
            }
        };

        markAsRead();
    }, [messages.length, roomId, currentUser?.email]);


    if (loading) return null;

    const handleSend = async () => {
        if (isOtherUserBlocked) {
            Alert.alert(
                'Cannot Send Message',
                'You cannot message this user.',
                [{text: 'OK'}]
            );
            return;
        }

        if (!input.trim()) return;
        const text = input.trim();
        setInput('');

        try {
            const {listingId, buyer, seller, listingData} = route.params;

            if (listingId && buyer && seller) {
                const roomRef = await getOrCreateChatRoom(listingId, buyer, seller, listingData);
                await sendMessage(roomRef.id, currentUser.email, text);
            } else {
                await sendMessage(roomId, currentUser.email, text);
            }

            requestAnimationFrame(() => {
                flatListRef.current?.scrollToEnd({animated: true});
            });

        } catch (e) {
            console.error('Error sending message:', e);
            setInput(text);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return '';
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
        } else {
            return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
        }
    };

    const shouldShowDateSeparator = (currentMsg, prevMsg) => {
        if (!prevMsg || !currentMsg.createdAt || !prevMsg.createdAt) return true;
        const current = new Date(currentMsg.createdAt.seconds * 1000);
        const prev = new Date(prevMsg.createdAt.seconds * 1000);
        return current.toDateString() !== prev.toDateString();
    };

    const formatDateSeparator = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return '';
        const date = new Date(timestamp.seconds * 1000);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
        }
    };

    const renderMessage = ({item, index}) => {
        if (!item.createdAt) return null;

        const isSent = item.senderId === currentUser.email;
        const prevMsg = index > 0 ? messages[index - 1] : null;

        const isFirstInGroup = !prevMsg || prevMsg.senderId !== item.senderId;
        const showDateSeparator = shouldShowDateSeparator(item, prevMsg);

        return (
            <>
                {showDateSeparator && (
                    <View style={styles.dateSeparator}>
                        <View style={styles.dateLine}/>
                        <Text style={styles.dateText}>{formatDateSeparator(item.createdAt)}</Text>
                        <View style={styles.dateLine}/>
                    </View>
                )}

                <View
                    style={[
                        styles.messageRow,
                        isSent ? styles.rowSent : styles.rowReceived,
                    ]}
                >
                    <View style={styles.messageContainer}>
                        <View
                            style={[
                                styles.messageBubble,
                                isSent ? styles.bubbleSent : styles.bubbleReceived,
                                isFirstInGroup && (isSent ? styles.bubbleSentFirst : styles.bubbleReceivedFirst),
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    isSent ? styles.textSent : styles.textReceived,
                                ]}
                            >
                                {item.text}
                            </Text>

                            <View style={styles.messageFooter}>
                                <Text style={[styles.timeText, isSent && styles.timeTextSent]}>
                                    {formatTime(item.createdAt)}
                                </Text>
                                {isSent && (
                                    <Ionicons
                                        name={item.read ? "checkmark-done" : "checkmark"}
                                        size={14}
                                        color={item.read ? COLORS.success : COLORS.gray400}
                                        style={{marginLeft: 4}}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar backgroundColor={COLORS.white} barStyle="dark-content"/>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.light.text}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerCenter}
                    onPress={() => {}}
                    activeOpacity={0.8}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={typeof avatarUri === 'string' ? {uri: avatarUri} : avatarUri}
                            style={styles.headerAvatar}
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{sellerName || 'Chat'}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* BLOCKED USER BANNER */}
            {isOtherUserBlocked && (
                <View style={styles.blockedBanner}>
                    <Ionicons name="ban" size={16} color="#EF4444"/>
                    <Text style={styles.blockedText}>
                        You cannot message this user
                    </Text>
                </View>
            )}

            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={[
                        styles.messagesContent,
                        messages.length === 0 && styles.messagesContentEmpty
                    ]}
                    style={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => {
                        flatListRef.current?.scrollToEnd({animated: true});
                    }}
                />

                {messages.length === 0 && (
                    <View style={styles.quickRepliesContainer}>
                        <Text style={styles.quickRepliesTitle}>Quick messages:</Text>
                        <View style={styles.quickReplies}>
                            {['Is this available?', 'What\'s the condition?', 'Can we meet?'].map((reply, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.quickReply}
                                    onPress={() => {
                                        setInput(reply);
                                        setTimeout(handleSend, 100);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.quickReplyText}>{reply}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Input Bar - FIXED */}
                <View style={[
                    styles.inputBar,
                    isOtherUserBlocked && styles.inputBarDisabled,
                ]}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder={isOtherUserBlocked ? "Cannot send messages" : "Message..."}
                            placeholderTextColor={COLORS.light.textTertiary}
                            value={input}
                            onChangeText={setInput}
                            multiline
                            maxLength={1000}
                            editable={!isOtherUserBlocked}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSend}
                        style={[
                            styles.sendButton,
                            (!input.trim() || isOtherUserBlocked) && styles.sendButtonDisabled
                        ]}
                        activeOpacity={0.8}
                        disabled={!input.trim() || isOtherUserBlocked}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={(input.trim() && !isOtherUserBlocked) ? COLORS.white : COLORS.light.textTertiary}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardAvoiding: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light.border,
        marginTop:30,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    headerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    headerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    headerName: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.light.text,
        marginBottom: 2,
    },
    messageList: {
        flex: 1,
        backgroundColor: COLORS.light.bg,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 8,
    },
    messagesContentEmpty: {
        flexGrow: 1,
    },
    dateSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.light.border,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.light.textTertiary,
        marginHorizontal: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    messageRow: {
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    rowSent: {
        justifyContent: 'flex-end',
    },
    rowReceived: {
        justifyContent: 'flex-start',
    },
    messageContainer: {
        maxWidth: '75%',
    },
    messageBubble: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
    },
    bubbleSent: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    bubbleReceived: {
        backgroundColor: '#F3F4F6',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    bubbleSentFirst: {
        borderTopRightRadius: 20,
    },
    bubbleReceivedFirst: {
        borderTopLeftRadius: 20,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    textSent: {
        color: COLORS.white,
    },
    textReceived: {
        color: COLORS.light.text,
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        justifyContent: 'flex-end',
    },
    timeText: {
        fontSize: 10,
        color: COLORS.light.textTertiary,
        fontWeight: '500',
    },
    timeTextSent: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    quickRepliesContainer: {
        padding: 16,
        paddingTop: 8,
        paddingBottom: 16,
        backgroundColor: COLORS.light.bg,
    },
    quickRepliesTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.light.textSecondary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    quickReplies: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    quickReply: {
        backgroundColor: COLORS.white,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    quickReplyText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.light.text,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 12 : 16,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.light.border,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        minHeight: 44,
        maxHeight: 120,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.light.border,
    },
    input: {
        fontSize: 15,
        color: COLORS.light.text,
        maxHeight: 100,
        paddingTop: 0,
        paddingBottom: 0,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    blockedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        backgroundColor: '#FEE2E2',
        borderBottomWidth: 1,
        borderBottomColor: '#FECACA',
        gap: 8,
    },
    blockedText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#DC2626',
    },
    inputBarDisabled: {
        opacity: 0.5,
    },
});

export default ChatRoomScreen;