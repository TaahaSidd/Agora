import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';

export const useMyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyListings = async () => {
            setLoading(true);
            try {
                const data = await apiGet('/listing/my-listings');

                const formatted = data.map(item => ({
                    ...item,
                    name: item.title || item.name || 'Untitled',
                    price: item.price ? `₹ ${item.price}` : 'N/A',
                    images: item.imageUrl && item.imageUrl.length > 0
                        ? item.imageUrl.map(url => ({ uri: url }))
                        : [require('../assets/LW.jpg')],
                }));

                setListings(formatted);
            } catch (error) {
                console.error('Error fetching user listings:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyListings();
    }, []);

    return { listings, loading, setListings, setLoading };
};
