import { useState } from 'react';
import { apiPost } from '../services/api';

export const useAddSellerReview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addSellerReview = async (sellerId, { rating, comment }) => {
        setLoading(true);
        setError(null);

        try {
            const res = await apiPost(`/Review/seller/${sellerId}`, {
                rating,
                comment,
            });

            return res.data;
        } catch (err) {
            console.error('Error posting seller review:', err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { addSellerReview, loading, error };
};
