import {create} from 'zustand';
import * as SecureStore from 'expo-secure-store';
import {apiGet} from '../services/api';

export const useUserStore = create((set, get) => ({
    currentUser: null,
    loading: true,
    isGuest: true,
    isCelebrationPending: false,
    setCelebrationPending: (value) => set({isCelebrationPending: value}),

    fetchUser: async () => {
        set({loading: true});
        try {
            const cached = await SecureStore.getItemAsync('currentUser');
            if (cached) {
                const parsedUser = JSON.parse(cached);
                set({
                    currentUser: parsedUser,
                    loading: false,
                    isGuest: !parsedUser?.id || parsedUser.id === null
                });
            }
            const token = await SecureStore.getItemAsync('accessToken');
            if (!token) {
                set({
                    currentUser: {
                        id: null,
                        name: 'Guest',
                        email: 'guest@Agora.app',
                        avatar: 'https://i.pravatar.cc/100?img=1',
                        collegeId: null,
                        collegeName: null,
                        collegeEmail: null,
                        mobileNumber: null,
                        firstName: null,
                        lastName: null,
                        idCardNo: null,
                    },
                    loading: false,
                    isGuest: true
                });
                return;
            }

            const data = await apiGet('/profile/myProfile');
            // console.log("DATA =", data);

            const mappedUser = {
                id: data.id,
                name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.userEmail || data.email,
                userEmail: data.userEmail,
                mobileNumber: data.mobileNumber,
                idCardNo: data.idCardNo,
                role: data.role,
                avatar: data.profileImage || 'https://i.pravatar.cc/100',
                profileImage: data.profileImage,
                collegeId: data.college?.id || null,
                collegeName: data.college?.collegeName || null,
                collegeEmail: data.college?.collegeEmail || null,
                verificationStatus: data.verificationStatus,
            };

            set({
                currentUser: mappedUser,
                loading: false,
                isGuest: false
            });
            await SecureStore.setItemAsync('currentUser', JSON.stringify(mappedUser));
            //console.log("Mapped User", mappedUser);

        } catch (err) {
            console.log('UserStore: Fetch user failed (likely unauthorized or network)');
            set({
                currentUser: {
                    id: null,
                    name: 'Guest',
                    email: 'guest@Agora.app',
                    avatar: 'https://i.pravatar.cc/100?img=1',
                    collegeId: null,
                    collegeName: null,
                    collegeEmail: null,
                    mobileNumber: null,
                },
                loading: false,
                isGuest: true
            });
        }
    },

    updateAvatar: async (newUrl) => {
        set((state) => {
            const updated = {
                ...state.currentUser,
                avatar: newUrl,
                profileImage: newUrl
            };
            SecureStore.setItemAsync('currentUser', JSON.stringify(updated));
            return {currentUser: updated};
        });
    },

    updateUser: async (userData) => {
        set((state) => {
            const updated = {
                ...state.currentUser,
                ...userData,
                name: `${userData.firstName || state.currentUser.firstName} ${userData.lastName || state.currentUser.lastName}`.trim()
            };
            SecureStore.setItemAsync('currentUser', JSON.stringify(updated));
            return {currentUser: updated};
        });
    },

    clearAuthData: async () => {
        try {
            await Promise.all([
                SecureStore.deleteItemAsync('accessToken'),
                SecureStore.deleteItemAsync('refreshToken'),
                SecureStore.deleteItemAsync('currentUser')
            ]);

            set({
                currentUser: null,
                isGuest: true,
                loading: false
            });
        } catch (err) {
            console.log('Error clearing auth data:', err);
        }
    },
}));
