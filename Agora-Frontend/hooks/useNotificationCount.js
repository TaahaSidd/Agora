import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';

export const useNotificationCount = (user, loading, isGuest, refreshInterval = 60000) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUnreadCount = async () => {
        if (loading || isGuest || !user?.id) {
            setUnreadCount(0);
            return;
        }

        setIsLoading(true);
        try {
            const data = await apiGet(`/notifications/${user.id}`);
            const unread = data.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to fetch notification count:', error);
            setUnreadCount(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && !isGuest && user?.id) {
            fetchUnreadCount();

            let interval;
            if (refreshInterval > 0) {
                interval = setInterval(fetchUnreadCount, refreshInterval);
            }

            return () => {
                if (interval) clearInterval(interval);
            };
        }
    }, [user?.id, loading, isGuest, refreshInterval]);

    return {
        unreadCount,
        isLoading,
        refresh: fetchUnreadCount,
    };
};