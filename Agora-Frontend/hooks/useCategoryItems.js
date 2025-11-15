import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCategoryItems = (category) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryItems = async () => {
            setLoading(true);
            try {
                const response = await axios.post(
                    "http://192.168.8.15:9000/Agora/listing/search",
                    { category }
                );

                const formattedItems = response.data.map(item => ({
                    ...item,
                    name: item.title || item.name || 'Untitled',
                    price: item.price ? `₹ ${item.price}` : 'N/A',
                    images: item.imageUrl && item.imageUrl.length > 0
                        ? item.imageUrl.map(url => ({ uri: url }))
                        : [require('../assets/LW.jpg')],
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
