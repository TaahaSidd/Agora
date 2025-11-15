import { useState, useEffect } from 'react';
import { useMyListings } from './useMyListings';
import * as SecureStore from 'expo-secure-store';

export const useUserStats = () => {
    const [listingsCount, setListingsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const { listings } = useMyListings();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const token = await SecureStore.getItemAsync('accessToken');
            if (!token) {
                setListingsCount(0);
            } else {
                setListingsCount(listings.length);
            }
            setLoading(false);
        };
        fetchStats();
    }, [listings]);

    return { listingsCount, loading };
};
