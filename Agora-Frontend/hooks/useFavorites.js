import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const data = await apiGet("/favorites");

                const formatted = data.map(item => ({
                    ...item,
                    isFavorite: true,
                    name: item.title || item.name || 'Untitled',
                    price: item.price ? `₹ ${item.price}` : 'N/A',
                    images:
                        item.imageUrl && item.imageUrl.length > 0
                            ? item.imageUrl.map(url => ({ uri: url }))
                            : [require('../assets/LW.jpg')],
                }));

                setFavorites(formatted);
            } catch (error) {
                console.error('Error fetching favorites:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    return { favorites, loading, setFavorites };
};
