import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';

export const useAverageRating = (type, userId) => {
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchRating = async () => {
            try {
                setLoading(true);
                const endpoint = type === 'seller'
                    ? `/Review/seller/${userId}/avg`
                    : `/Review/user/${userId}/avg`;

                const res = await apiGet(endpoint);
                setRating(res || 0);
            } catch (err) {
                console.error('Failed to fetch rating:', err);
                setRating(0);
            } finally {
                setLoading(false);
            }
        };

        fetchRating();
    }, [userId, type]);

    return { rating, loading };
};