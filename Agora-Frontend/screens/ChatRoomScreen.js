import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';
import { THEME } from '../utils/theme';
import { useChatMessages } from '../hooks/useChatMessages';
import { sendMessage } from '../services/chatService';
import { useCurrentUser } from '../hooks/useCurrentUser';

const isAndroid = Platform.OS === 'android';

const ChatRoomScreen = ({ route, navigation }) => {
    const { roomId } = route.params;
    const messages = useChatMessages(roomId);
    const { sellerName, productInfo } = route.params || {};
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { user: currentUser, loading } = useCurrentUser();
    const flatListRef = useRef(null);
    const typingTimeout = useRef(null);
    const { sellerAvatar } = route.params;

    let avatarUri = sellerAvatar;

    if (typeof avatarUri === 'string' && avatarUri.includes('localhost')) {
        avatarUri = avatarUri.replace('localhost', '192.168.8.15');
    }

    if (!avatarUri) {
        avatarUri = require('../assets/defaultProfile.png');
    }

    // Scroll to bottom when keyboard appears
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    if (loading) return null;

    const handleSend = async () => {
        if (!input.trim()) return;
        const text = input.trim();
        setInput('');

        try {
            await sendMessage(roomId, currentUser.email, text);
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (e) {
            console.error('Error sending message:', e);
            setInput(text);
        }
    };

    const handleTyping = (text) => {
        setInput(text);
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            setIsTyping(false);
        }, 1000);
    };

    const formatTime = (timestamp) => {
        if (!timestamp || !timestamp.seconds) return '';
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

    const renderMessage = ({ item, index }) => {
        if (!item.createdAt) return null;

        const isSent = item.senderId === currentUser.email;
        const prevMsg = index > 0 ? messages[index - 1] : null;
        const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;

        const showAvatar = !nextMsg || nextMsg.senderId !== item.senderId;
        const isFirstInGroup = !prevMsg || prevMsg.senderId !== item.senderId;
        const showDateSeparator = shouldShowDateSeparator(item, prevMsg);

        return (
            <>
                {showDateSeparator && (
                    <View style={styles.dateSeparator}>
                        <View style={styles.dateLine} />
                        <Text style={styles.dateText}>{formatDateSeparator(item.createdAt)}</Text>
                        <View style={styles.dateLine} />
                    </View>
                )}

                <View
                    style={[
                        styles.messageRow,
                        isSent ? styles.rowSent : styles.rowReceived,
                        !showAvatar && styles.messageRowGrouped,
                    ]}
                >
                    {!isSent && (
                        <View style={styles.avatarSpace}>
                            {showAvatar ? (
                                <Image
                                    source={require('../assets/defaultProfile.png')}
                                    style={styles.messageAvatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder} />
                            )}
                        </View>
                    )}

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
                                        style={{ marginLeft: 4 }}
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
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={COLORS.dark.bg} barStyle="light-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.dark.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerCenter}
                    onPress={() => {
                        console.log('View seller profile');
                    }}
                    activeOpacity={0.8}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri}
                            style={styles.headerAvatar}
                        />
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{sellerName || 'Chat'}</Text>
                        <View style={styles.statusRow}>
                            <View style={styles.activeDot} />
                            <Text style={styles.headerStatus}>
                                {isTyping ? 'typing...' : 'Active now'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.moreButton}
                    activeOpacity={0.7}
                    onPress={() => {
                        console.log('Show menu');
                    }}
                >
                    <Ionicons name="ellipsis-vertical" size={20} color={COLORS.dark.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Product Context Card (if available) */}
            {productInfo && (
                <View style={styles.productCard}>
                    <Image
                        source={productInfo.image}
                        style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>
                            {productInfo.name}
                        </Text>
                        <Text style={styles.productPrice}>{productInfo.price}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.productViewButton}
                        onPress={() => navigation.navigate('ProductDetailsScreen', { item: productInfo })}
                    >
                        <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>
            )}

            {/* KeyboardAvoidingView wraps messages and input */}
            <KeyboardAvoidingView
                style={styles.keyboardAvoiding}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                {/* Messages */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesContent}
                    style={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => {
                        flatListRef.current?.scrollToEnd({ animated: false });
                    }}
                />

                {/* Quick Replies (Optional) */}
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

                {/* Input Bar */}
                <View style={styles.inputBar}>
                    <TouchableOpacity
                        style={styles.attachButton}
                        activeOpacity={0.7}
                        onPress={() => {
                            console.log('Attach file');
                        }}
                    >
                        <Ionicons name="camera-outline" size={24} color={COLORS.dark.textSecondary} />
                    </TouchableOpacity>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Message..."
                            placeholderTextColor={COLORS.dark.textTertiary}
                            value={input}
                            onChangeText={handleTyping}
                            multiline
                            maxLength={1000}
                        />

                        {input.length > 0 && (
                            <TouchableOpacity
                                style={styles.emojiButton}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="happy-outline" size={22} color={COLORS.dark.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>

                    {input.trim() ? (
                        <TouchableOpacity
                            onPress={handleSend}
                            style={styles.sendButton}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="send" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.voiceButton}
                            activeOpacity={0.7}
                            onPress={() => {
                                console.log('Voice message');
                            }}
                        >
                            <Ionicons name="mic-outline" size={24} color={COLORS.dark.textSecondary} />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
        paddingTop: isAndroid ? StatusBar.currentHeight : 0,
    },
    keyboardAvoiding: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.dark.bgElevated,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.dark.border,
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
        borderWidth: 2,
        borderColor: COLORS.dark.border,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.status.online,
        borderWidth: 2,
        borderColor: COLORS.dark.bgElevated,
    },
    headerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    headerName: {
        fontSize: 17,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 2,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.status.online,
        marginRight: 6,
    },
    headerStatus: {
        fontSize: 13,
        color: COLORS.dark.textSecondary,
        fontWeight: '500',
    },
    moreButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: COLORS.dark.card,
    },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        margin: 12,
        backgroundColor: COLORS.dark.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    productImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: COLORS.dark.cardElevated,
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.dark.text,
        marginBottom: 2,
    },
    productPrice: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.primary,
    },
    productViewButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.transparentWhite10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageList: {
        flex: 1,
        backgroundColor: COLORS.dark.bg,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 20,
    },
    dateSeparator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    dateLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.dark.border,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.dark.textTertiary,
        marginHorizontal: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    messageRow: {
        marginVertical: 8,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    messageRowGrouped: {
        marginTop: 4,
    },
    rowSent: {
        justifyContent: 'flex-end',
    },
    rowReceived: {
        justifyContent: 'flex-start',
    },
    avatarSpace: {
        width: 40,
        alignItems: 'center',
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.dark.card,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
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
        backgroundColor: COLORS.dark.card,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
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
        color: COLORS.dark.text,
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        justifyContent: 'flex-end',
    },
    timeText: {
        fontSize: 10,
        color: COLORS.dark.textTertiary,
        fontWeight: '500',
    },
    timeTextSent: {
        color: COLORS.transparentWhite70,
    },
    quickRepliesContainer: {
        padding: 16,
        paddingTop: 8,
        backgroundColor: COLORS.dark.bg,
    },
    quickRepliesTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.dark.textSecondary,
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
        backgroundColor: COLORS.dark.card,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.dark.border,
    },
    quickReplyText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.dark.text,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 12,
        backgroundColor: COLORS.dark.bgElevated,
        borderTopWidth: 1,
        borderTopColor: COLORS.dark.border,
    },
    attachButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: COLORS.dark.card,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        minHeight: 40,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.dark.text,
        maxHeight: 100,
        paddingTop: 0,
        paddingBottom: 0,
    },
    emojiButton: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 4,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    voiceButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ChatRoomScreen;