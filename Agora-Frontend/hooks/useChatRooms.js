import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export function useChatRooms(userId) {
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        if (!userId) {
            return;
        }
        const chatRoomsRef = collection(db, 'chatRooms');
        const q = query(
            chatRoomsRef,
            where('participants', 'array-contains', String(userId)),
            orderBy('lastUpdated', 'desc')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            snapshot.docs.forEach(doc => {
            });

            const rooms = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setChatRooms(rooms);
        }, err => {
            console.error('[useChatRooms] Error fetching chat rooms:', err);
        });

        return () => unsubscribe();
    }, [userId]);

    return chatRooms;
}

