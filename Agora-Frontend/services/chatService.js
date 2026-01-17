import {db} from '../firebase/firebaseConfig';
import {addDoc, arrayRemove, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc} from 'firebase/firestore';

const sanitizeEmail = (email) => email.replace(/\./g, '_');

export const getOrCreateChatRoom = async (listingId, buyer, seller, listingData = null) => {
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
                {
                    id: String(buyer.email),
                    userId: buyer.id,
                    name: buyer.name,
                    avatar: buyer.avatar
                },
                {
                    id: String(seller.email),
                    userId: seller.id,
                    name: seller.name,
                    avatar: seller.avatar
                },
            ],
            listing: listingData ? {
                title: listingData.title || listingData.name || 'Item',
                price: listingData.price || 0,
                imageUrl: listingData.images || listingData.imageUrl || [],
            } : null,
            lastRead: {
                [sanitizeEmail(buyer.email)]: null,
                [sanitizeEmail(seller.email)]: null,
            },
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            lastMessage: null,
            deletedFor: [],
        });
    } else {
        const chatData = roomSnap.data();
        const deletedFor = chatData.deletedFor || [];

        const updates = {};

        if (deletedFor.includes(buyer.email)) {
            updates.deletedFor = arrayRemove(buyer.email);
        }

        if (listingData && (!chatData.listing || !chatData.listing.imageUrl)) {
            updates.listing = {
                title: listingData.title || listingData.name || 'Item',
                price: listingData.price || 0,
                imageUrl: listingData.images || listingData.imageUrl || [],
            };
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(roomRef, updates);
            console.log('✅ Chat updated:', Object.keys(updates));
        }
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
        lastMessage: {text, senderId, createdAt: serverTimestamp()},
        lastUpdated: serverTimestamp(),
        [`lastRead.${sanitizeEmail(senderId)}`]: serverTimestamp(),  // ✅ Fixed
    });
};