import {useEffect, useState} from 'react';
import {apiGet} from '../services/api';

export const useSellerStats = (sellerId) => {
    const [stats, setStats] = useState({
        averageRating: 0,
        totalReviews: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sellerId) return;

        const fetchStats = async () => {
            try {
                setLoading(true);
                // Calling your new "stats" endpoint
                const res = await apiGet(`/Review/seller/${sellerId}/stats`);

                setStats({
                    averageRating: res.averageRating || 0,
                    totalReviews: res.totalReviews || 0
                });
            } catch (err) {
                console.error('Failed to fetch seller stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [sellerId]);

    return {stats, loading};
};