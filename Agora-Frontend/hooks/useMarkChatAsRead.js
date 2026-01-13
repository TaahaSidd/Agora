import {useCallback} from 'react';
import {doc, updateDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '../firebase/firebaseConfig';

export function useMarkChatAsRead() {
    const markAsRead = useCallback(async (roomId, userEmail) => {
        console.log('🔵 Attempting to mark as read:', {roomId, userEmail});

        try {
            const roomRef = doc(db, 'chatRooms', roomId);
            await updateDoc(roomRef, {
                [`lastRead.${userEmail}`]: serverTimestamp(),
            });
            console.log('✅ Successfully marked as read');
        } catch (error) {
            console.error('❌ Failed to mark as read:', error);
            throw error;
        }
    }, []);

    return markAsRead;
}