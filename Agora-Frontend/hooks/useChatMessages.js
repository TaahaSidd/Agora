import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    doc,
    orderBy,
    onSnapshot,
    updateDoc
} from 'firebase/firestore';

export const useChatMessages = (roomId) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (!roomId) return;

        const messagesRef = collection(db, `chatRooms/${roomId}/messages`);
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [roomId]);

    return messages;
};