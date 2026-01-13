import {useState, useEffect} from 'react';
import {apiGet} from '../services/api';

export const useListings = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchListings = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiGet('/listing/all', {page: 0, size: 20});
            const data = response.content || [];

            const formatted = data.map(item => ({
                ...item,
                name: item.title || item.name || 'Unnamed Item',
                price: item.price ? `₹ ${item.price}` : 'N/A',
                images: item.imageUrl && item.imageUrl.length > 0
                    ? item.imageUrl.map(url => ({uri: url}))
                    : [require('../assets/no-image.jpg')],
            }));

            setItems(formatted);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    return {items, loading, error, refetch: fetchListings};
};