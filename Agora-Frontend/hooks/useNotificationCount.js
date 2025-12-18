import { useState, useEffect, useCallback } from 'react';
import { apiGet } from '../services/api';

export const useNotificationCount = (
    userId,
    loading,
    isGuest,
    refreshInterval = 60000
) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUnreadCount = useCallback(async () => {
        if (loading || isGuest || !userId) {
            setUnreadCount(0);
            return;
        }

        setIsLoading(true);
        try {
            const data = await apiGet(`/notifications/${userId}`);
            const unread = data.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to fetch notification count:', error);
            setUnreadCount(0);
        } finally {
            setIsLoading(false);
        }
    }, [userId, loading, isGuest]);

    useEffect(() => {
        if (!userId || loading || isGuest) return;

        fetchUnreadCount();

        if (refreshInterval > 0) {
            const interval = setInterval(fetchUnreadCount, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchUnreadCount, refreshInterval]);

    return {
        unreadCount,
        isLoading,
        refresh: fetchUnreadCount,
    };
};
