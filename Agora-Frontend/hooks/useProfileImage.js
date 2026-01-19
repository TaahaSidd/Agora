import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';
import {useUserStore} from "../stores/userStore";

export const useProfileImage = () => {
    const { user } = useUserStore();
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const refreshToken = await SecureStore.getItemAsync('refreshToken');
                if (!refreshToken || user?.isGuest) {
                    setLoading(false);
                    return;
                }
                const res = await apiGet('/profile/image');
                let imgUrl = res?.imageUrl || res?.profileImage || res?.data?.imageUrl || null;
                if (imgUrl?.includes('localhost')) {
                    imgUrl = imgUrl.replace('localhost', '192.168.8.15');
                }

                setProfileImage(imgUrl);
            } catch (err) {
                console.error('Error fetching profile image:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileImage();
    }, [user]);

    return { profileImage, loading };
};
