import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

export const useReviews = (listingId) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await apiGet(`/Review/${listingId}`);
                if (isMounted) {
                    const data = Array.isArray(res) ? res : res?.data || [];
                    setReviews(data);
                }
            } catch (err) {
                console.error('Error fetching reviews:', err);
                if (isMounted) setReviews([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (listingId) fetchReviews();
        else {
            setReviews([]);
            setLoading(false);
        }

        return () => { isMounted = false; };
    }, [listingId]);

    return { reviews, loading, setReviews };
};
