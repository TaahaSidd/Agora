// hooks/useChatNotifications.js
import { useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { apiPost } from '../services/api';

export function useChatNotifications(userEmail, userId) {
    const processedMessages = useRef(new Set());

    useEffect(() => {
        console.log('🔔 useChatNotifications - Starting...', { userEmail, userId });

        if (!userEmail || !userId) {
            console.log('❌ useChatNotifications - Missing userEmail or userId');
            return;
        }

        console.log('✅ useChatNotifications - Setting up listener');

        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(
            chatRoomsRef,
            where('participants', 'array-contains', userEmail)
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                console.log('📊 Firebase snapshot received:', snapshot.size, 'chat rooms');

                snapshot.docChanges().forEach(async (change) => {
                    console.log('🔍 Change detected:', {
                        type: change.type,
                        roomId: change.doc.id,
                    });

                    if (change.type === 'modified') {
                        const chatRoom = change.doc.data();
                        const lastMessage = chatRoom.lastMessage;

                        console.log('💬 Last message:', {
                            exists: !!lastMessage,
                            senderId: lastMessage?.senderId,
                            text: lastMessage?.text,
                            currentUserEmail: userEmail,
                        });

                        if (
                            lastMessage &&
                            lastMessage.senderId !== userEmail &&
                            lastMessage.text
                        ) {
                            const messageId = `${change.doc.id}_${lastMessage.createdAt?.seconds || Date.now()}`;

                            console.log('🆔 Message ID:', messageId);
                            console.log('📝 Processed messages:', Array.from(processedMessages.current));

                            if (processedMessages.current.has(messageId)) {
                                console.log('⏭️ Message already processed, skipping');
                                return;
                            }

                            processedMessages.current.add(messageId);

                            // Get sender info
                            const sender = chatRoom.participantsInfo?.find(
                                p => p.id === lastMessage.senderId
                            );

                            console.log('👤 Sender info:', sender);

                            const payload = {
                                receiverId: userId,
                                senderName: sender?.name || 'Someone',
                                messageText: lastMessage.text,
                                chatRoomId: change.doc.id,
                            };

                            console.log('📤 Sending notification to backend:', payload);

                            try {
                                const response = await apiPost('/notifications/message', payload);
                                console.log('✅ Backend response:', response);
                            } catch (error) {
                                console.error('❌ Backend error:', error);
                                console.error('❌ Error details:', error.response?.data);
                            }
                        } else {
                            console.log('⏭️ Skipping - not a valid new message from another user');
                        }
                    }
                });
            },
            (error) => {
                console.error('❌ Firebase listener error:', error);
            }
        );

        return () => {
            console.log('🔕 Cleaning up chat notification listener');
            unsubscribe();
            processedMessages.current.clear();
        };
    }, [userEmail, userId]);
}