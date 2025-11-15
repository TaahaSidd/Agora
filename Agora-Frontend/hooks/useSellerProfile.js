import { useState, useEffect } from 'react';
import { apiGet } from '../services/api';

export const useSellerProfile = (sellerId) => {
    const [seller, setSeller] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!sellerId) return;

        const loadSellerData = async () => {
            try {
                setLoading(true);
                const response = await apiGet(`/profile/seller/${sellerId}`);

                const sellerData = response?.seller || response?.data?.seller || null;
                const listingsData = response?.listing || response?.data?.listing || [];
                
                const formattedListings = listingsData.map(item => ({
                    ...item,
                    images: item.imageUrl && item.imageUrl.length > 0
                        ? item.imageUrl.map(url => ({ uri: url }))
                        : [require('../assets/LW.jpg')],
                    name: item.title || 'Untitled',
                    price: item.price ? `₹ ${item.price}` : 'N/A',
                }));

                setSeller(sellerData);
                setListings(formattedListings);
            } catch (err) {
                console.error("Failed to load seller profile:", err);
            } finally {
                setLoading(false);
            }
        };

        loadSellerData();
    }, [sellerId]);

    return { seller, listings, loading };
};