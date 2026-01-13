import {useEffect, useState} from "react";
import {db} from "../firebase/firebaseConfig";
import {collection, query, where, onSnapshot, orderBy} from "firebase/firestore";

export function useChatRooms(userEmail) {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userEmail) {
            //console.log('❌ No userEmail provided');
            setChatRooms([]);
            setLoading(false);
            return;
        }

        //console.log('🔍 Fetching chat rooms for userEmail:', userEmail);

        const chatRoomsRef = collection(db, 'chatRooms');

        const q = query(
            chatRoomsRef,
            where('participants', 'array-contains', userEmail),
            orderBy('lastUpdated', 'desc')
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                //console.log('📊 Firebase snapshot received:', snapshot.size, 'chat rooms');

                const rooms = [];

                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    const deletedFor = data.deletedFor || [];

                    if (!deletedFor.includes(userEmail)) {
                        rooms.push({
                            id: doc.id,
                            ...data,
                        });
                        // console.log('✅ Including chat:', doc.id);
                    } else {
                        console.log('🚫 Excluding deleted chat:', doc.id, '| deletedFor:', deletedFor);
                    }
                });

                //console.log('📱 Final filtered chats:', rooms.length, 'out of', snapshot.size);
                setChatRooms(rooms);
                setLoading(false);
                setError(null);
            },
            (err) => {
                console.error('❌ [useChatRooms] Error fetching chat rooms:', err);
                setError(err.message);
                setLoading(false);
                setChatRooms([]);
            }
        );

        return () => unsubscribe();
    }, [userEmail]);

    return {chatRooms, loading, error};
}