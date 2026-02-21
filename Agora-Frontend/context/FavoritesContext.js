import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiGet, apiPost, apiDelete } from '../services/api';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const data = await apiGet('/favorites');
            if (!data || !Array.isArray(data)) {
                setFavorites([]);
                return;
            }
            setFavorites(data);
        } catch (err) {
            console.error('Failed to load favorites', err);
            setFavorites([]);
        }
    };

    const toggleFavorite = async (listingId) => {
        const previousFavorites = [...favorites];
        const isFav = favorites.some(f => f.id === listingId);

        setFavorites(prev => {
            if (isFav) {
                return prev.filter(f => f.id !== listingId);
            } else {
                return [...prev, { id: listingId }];
            }
        });

        try {
            if (!isFav) {
                await apiPost(`/favorites/${listingId}`);
            } else {
                await apiDelete(`/favorites/${listingId}`);
            }
        } catch (err) {
            console.error('Favorite toggle error, rolling back:', err);


            setFavorites(previousFavorites);

        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, loadFavorites }}>
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