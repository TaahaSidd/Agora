import React, {createContext, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiGet} from '../services/api';

const ChatBlockingContext = createContext();

export const ChatBlockingProvider = ({children}) => {
    const [blockedUserIds, setBlockedUserIds] = useState([]);
    const [blockedEmails, setBlockedEmails] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlockedList();
    }, []);

    const fetchBlockedList = async () => {
        try {
            const data = await apiGet('/report/blocked-list');
            // data = { blocked: [...], blockedBy: [...] }

            const blocked = data.blocked || [];
            const blockedBy = data.blockedBy || [];

            // Combine both lists
            const allBlocked = [...blocked, ...blockedBy];

            // Extract IDs
            const ids = allBlocked.map(u => u.id);
            setBlockedUserIds(ids);

            // Cache locally
            await AsyncStorage.setItem('blockedUserIds', JSON.stringify(ids));

            console.log('✅ Blocked users loaded:', ids);
        } catch (error) {
            console.error('Error fetching blocked list:', error);

            // Load from cache
            const cached = await AsyncStorage.getItem('blockedUserIds');
            if (cached) {
                setBlockedUserIds(JSON.parse(cached));
            }
        } finally {
            setLoading(false);
        }
    };

    const isUserBlocked = (userId) => {
        return blockedUserIds.includes(userId);
    };

    const isEmailBlocked = (email) => {
        return blockedEmails.has(email);
    };

    const refreshBlockedList = async () => {
        await fetchBlockedList();
    };

    return (
        <ChatBlockingContext.Provider value={{
            blockedUserIds,
            blockedEmails,
            isUserBlocked,
            isEmailBlocked,
            refreshBlockedList,
            loading
        }}>
            {children}
        </ChatBlockingContext.Provider>
    );
};

export const useChatBlocking = () => {
    const context = useContext(ChatBlockingContext);
    if (!context) {
        throw new Error('useChatBlocking must be used within ChatBlockingProvider');
    }
    return context;
};