import { useCallback } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export function useMarkChatAsRead() {
    const markAsRead = useCallback(async (roomId, userEmail) => {
        const roomRef = doc(db, 'chatRooms', roomId);
        await updateDoc(roomRef, {
            [`lastRead.${userEmail}`]: serverTimestamp(),
        });
    }, []);

    return markAsRead;
}
