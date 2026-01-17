import React, {createContext, useContext, useState, useEffect} from 'react';
import {apiGet, apiPost, apiDelete} from '../services/api';

const FavoritesContext = createContext();

export const FavoritesProvider = ({children}) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const data = await apiGet('/favorites');
            //  console.log('🔍 API returned favorites:', JSON.stringify(data, null, 2));

            if (!data || !Array.isArray(data)) {
                console.log('Invalid favorites data, using empty array');
                setFavorites([]);
                return;
            }

            setFavorites(data);

            // console.log('✅ Stored in context:', data.length, 'favorites');
            // console.log('IDs:', data.map(f => f.id));
        } catch (err) {
            console.error('Failed to load favorites', err);
            setFavorites([]);
        }
    };

    const toggleFavorite = async (listingId) => {
        if (!Array.isArray(favorites)) {
            console.error('Favorites is not an array!');
            setFavorites([]);
            return;
        }

        const isFav = favorites.some(f => f.id === listingId);

        try {
            if (!isFav) await apiPost(`/favorites/${listingId}`);
            else await apiDelete(`/favorites/${listingId}`);

            setFavorites(prev => {
                if (!Array.isArray(prev)) return [];

                if (isFav) return prev.filter(f => f.id !== listingId);
                else return [...prev, {id: listingId}];
            });
        } catch (err) {
            console.error('Favorite toggle error:', err);
        }
    };

    return (
        <FavoritesContext.Provider value={{favorites, toggleFavorite, loadFavorites}}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }

    return context;
};