import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiPost } from '../services/api';

export const useCategoryItems = (category) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryItems = async () => {
            setLoading(true);
            try {
                const response = await apiPost('/listing/search', { category });

                const data = Array.isArray(response) ? response : response.data || [];

                const formattedItems = data.map(item => ({
                    ...item,
                    name: item.title || item.name || 'Untitled',
                    price: item.price ? `₹ ${item.price}` : 'N/A',
                    images: item.imageUrl && item.imageUrl.length > 0
                        ? item.imageUrl.map(url => ({ uri: url }))
                        : [require('../assets/no-image.jpg')],
                    seller: item.seller || {},
                    college: item.college || {},
                    itemCondition: item.itemCondition || 'Used',
                    description: item.description || 'No description provided',
                }));

                setItems(formattedItems);
            } catch (err) {
                console.error("Error fetching category items:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (category) fetchCategoryItems();
    }, [category]);

    return { items, loading, error };
};
