import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const isAndroid = Platform.OS === 'android';

const initialMessages = [
    { id: '1', text: 'Hey, is the laptop still available?', sent: false },
    { id: '2', text: 'Yes! Do you want to check it out?', sent: true },
    { id: '3', text: 'Sure, what time works for you?', sent: false },
];

const ChatRoomScreen = ({ navigation }) => {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {
            id: Date.now().toString(),
            text: input,
            sent: true,
        };
        setMessages([newMessage, ...messages]);
        setInput('');
    };

    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageBubble,
                item.sent ? styles.sentBubble : styles.receivedBubble,
            ]}
        >
            <Text
                style={[
                    styles.messageText,
                    item.sent ? styles.sentText : styles.receivedText,
                ]}
            >
                {item.text}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={90}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.darkBlue}
                        onPress={() => navigation.goBack()}
                    />
                    <Image
                        source={require('../assets/manavatar.jpg')}
                        style={styles.headerAvatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>Alice Johnson</Text>
                        <Text style={styles.headerStatus}>Online</Text>
                    </View>
                </View>

                {/* Messages */}
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={{ padding: 16 }}
                    inverted
                />

                {/* Input Bar */}
                <View style={styles.inputBar}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="send" size={20} color={COLORS.white} />
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
        paddingTop: isAndroid ? StatusBar.currentHeight : 0,
    },
    container: { flex: 1, backgroundColor: COLORS.white },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerAvatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 12 },
    headerInfo: { marginLeft: 8 },
    headerName: { fontSize: 16, fontWeight: '600', color: COLORS.darkBlue },
    headerStatus: { fontSize: 12, color: '#666' },

    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 16,
        marginBottom: 10,
    },
    sentBubble: {
        alignSelf: 'flex-end',
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 4,
    },
    receivedBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 4,
    },
    messageText: { fontSize: 15 },
    sentText: { color: COLORS.white },
    receivedText: { color: '#000' },

    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 10,
    },
});

export default ChatRoomScreen;
