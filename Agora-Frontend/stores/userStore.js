import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGet } from '../services/api';

export const useUserStore = create((set) => ({
    currentUser: null,
    loading: true,

    fetchUser: async () => {
        set({ loading: true });
        try {
            const cached = await AsyncStorage.getItem('currentUser');
            if (cached) {
                set({ currentUser: JSON.parse(cached), loading: false });
            }

            const data = await apiGet('/profile/myProfile');

            const mappedUser = {
                id: data.id,
                name: data.username || 'User',
                email: data.userEmail || data.email || 'email@example.com',
                avatar: data.profileImage || 'https://your-default-url.com/default.png',
            };

            set({ currentUser: mappedUser, loading: false });
            await AsyncStorage.setItem('currentUser', JSON.stringify(mappedUser));
        } catch (err) {
            console.error('Failed to fetch user:', err);
            set({ loading: false });
        }
    },

    updateAvatar: async (newUrl) => {
        set((state) => {
            const updated = { ...state.currentUser, avatar: newUrl };
            AsyncStorage.setItem('currentUser', JSON.stringify(updated));
            return { currentUser: updated };
        });
    },
}));
