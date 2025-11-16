import { db } from '../firebase/firebaseConfig';
import { doc, collection, getDoc, setDoc, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

export const getOrCreateChatRoom = async (listingId, buyer, seller) => {
    const roomId = `${listingId}_${buyer.email}_${seller.email}`;
    const roomRef = doc(db, 'chatRooms', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        await setDoc(roomRef, {
            listingId,
            buyerId: String(buyer.email),
            sellerId: String(seller.email),
            participants: [String(buyer.email), String(seller.email)],
            participantsInfo: [
                { id: String(buyer.email), name: buyer.name, avatar: buyer.avatar },
                { id: String(seller.email), name: seller.name, avatar: seller.avatar },
            ],
            lastRead: {
                [buyer.email]: null,
                [seller.email]: null,
            },
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            lastMessage: null,
        });
    }

    return roomRef;
};

export const sendMessage = async (roomId, senderId, text, messageType = 'text', mediaUrl = '') => {
    if (!text.trim()) return;

    const roomRef = doc(db, 'chatRooms', roomId);
    const messagesRef = collection(roomRef, 'messages');

    await addDoc(messagesRef, {
        senderId,
        text,
        messageType,
        mediaUrl,
        createdAt: serverTimestamp(),
    });

    await updateDoc(roomRef, {
        lastMessage: { text, senderId },
        lastUpdated: serverTimestamp(),
        [`lastRead.${senderId}`]: serverTimestamp(),
    });
};