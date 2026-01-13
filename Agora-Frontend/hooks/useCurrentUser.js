import {useEffect, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';
import {apiGet} from '../services/api';

export const useCurrentUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = await SecureStore.getItemAsync('accessToken');

                if (!token) {
                    setIsGuest(true);
                    setUser({
                        id: null,
                        name: 'Guest',
                        email: 'guest@Agora.app',
                        mobileNumber: null,
                        profileImage: 'https://i.pravatar.cc/100?img=1',
                    });
                    return;
                }

                const decoded = jwtDecode(token);
                const data = await apiGet('/profile/myProfile');

                const finalUser = {
                    id: data.id,
                    name: decoded.username || data.firstName || 'User',
                    mobileNumber: data.mobileNumber,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    profileImage: data.profileImage || null,
                    collegeId: data.college?.id,
                    collegeName: data.college?.collegeName,
                    collegeEmail: data.college?.collegeEmail,
                    verificationStatus: data.verificationStatus,
                };

                console.log('✅ Final User Object:', finalUser);

                setUser(finalUser);
                setIsGuest(false);

            } catch (error) {
                console.error('Failed to load user:', error);
                setIsGuest(true);
                setUser({
                    id: null,
                    name: 'Guest',
                    email: 'guest@Agora.app',
                    profileImage: 'https://i.pravatar.cc/100?img=1',
                });
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return {user, loading, isGuest};
};
