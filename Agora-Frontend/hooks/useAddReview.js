import { useState } from 'react';
import { apiPost } from '../services/api';

export const useAddReview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addReview = async (listingId, { rating, comment }) => {
        setLoading(true);
        setError(null);

        try {
            const res = await apiPost(`/Review/${listingId}`, {
                rating,
                comment,
            });

            return res;
        } catch (err) {
            console.error('Error posting review:', err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { addReview, loading, error };
};
