import {useState} from 'react';
import {Alert} from 'react-native';
import {apiDelete, apiGet, apiPost} from '../services/api';

export const useModeration = () => {
    const [loading, setLoading] = useState(false);

    // Block User
    const blockUser = async (userId, onSuccess) => {
        setLoading(true);
        try {
            await apiPost(`/report/block/${userId}`);
            if (onSuccess) onSuccess();
        } catch (error) {
            Alert.alert("Error", "Failed to block user. Try again.");
        } finally {
            setLoading(false);
        }
    };

    //Unblock
    const unblockUser = async (userId, onSuccess) => {
        setLoading(true);
        try {
            await apiDelete(`/report/unblock/${userId}`);
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Unblock error:", error);
            Alert.alert("Error", "Failed to unblock user.");
        } finally {
            setLoading(false);
        }
    };

    //Get Blocked List
    const fetchBlockedUsers = async () => {
        setLoading(true);
        try {
            const data = await apiGet('/report/blocked-list');
            return data;
        } catch (error) {
            console.error("Fetch blocked users error:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    return {blockUser, unblockUser, fetchBlockedUsers, loading};
};