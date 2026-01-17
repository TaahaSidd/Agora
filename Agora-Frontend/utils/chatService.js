import {doc, updateDoc, arrayUnion, arrayRemove, getDoc} from 'firebase/firestore';
import {db} from '../firebase/firebaseConfig';

export const deleteChatForMe = async (chatRoomId, userEmail) => {
    try {
        const chatRef = doc(db, 'chatRooms', chatRoomId);

        // Add user to 'deletedFor' array
        await updateDoc(chatRef, {
            deletedFor: arrayUnion(userEmail)
        });

        //console.log('✅ Chat hidden for:', userEmail);
        return {success: true};
    } catch (error) {
        console.error('❌ Error hiding chat:', error);
        throw error;
    }
};

export const clearChatHistory = async (chatRoomId, userEmail) => {
    try {
        const chatRef = doc(db, 'chatRooms', chatRoomId);
        const chatDoc = await getDoc(chatRef);

        if (!chatDoc.exists()) {
            throw new Error('Chat not found');
        }

        const now = new Date();

        // Store the timestamp when user cleared history
        await updateDoc(chatRef, {
            [`clearedAt.${userEmail}`]: now
        });

        //console.log('✅ Chat history cleared for:', userEmail);
        return {success: true};
    } catch (error) {
        console.error('❌ Error clearing chat history:', error);
        throw error;
    }
};
