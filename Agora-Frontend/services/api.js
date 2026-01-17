import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import {jwtDecode} from 'jwt-decode';
import {Alert} from 'react-native';
import {useUserStore} from "../stores/userStore";

const BASE_URL = "http://192.168.8.15:9000/Agora";
// const BASE_URL = "https://francisca-overjocular-cheryle.ngrok-free.dev";

const authApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// async function refreshJwt() {
//     const refreshToken = await SecureStore.getItemAsync('refreshToken');
//     if (!refreshToken) throw new Error('No refresh token');
//
//     try {
//         const res = await authApi.post('/auth/refresh', {refreshToken});
//         const {jwt: newJwt, refreshToken: newRefresh} = res.data;
//
//         await SecureStore.setItemAsync('accessToken', newJwt);
//         if (newRefresh) await SecureStore.setItemAsync('refreshToken', newRefresh);
//         return newJwt;
//     } catch (err) {
//         await SecureStore.deleteItemAsync('accessToken');
//         await SecureStore.deleteItemAsync('refreshToken');
//         // Only alert if it's not a network error
//         if (err.response) {
//             Alert.alert("Session expired", "Please login again");
//         }
//         throw err;
//     }
// }

async function refreshJwt() {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');

    try {
        const res = await authApi.post('/auth/refresh', { refreshToken });
        const { jwt: newJwt, refreshToken: newRefresh } = res.data;

        await SecureStore.setItemAsync('accessToken', newJwt);
        if (newRefresh) await SecureStore.setItemAsync('refreshToken', newRefresh);
        return newJwt;
    } catch (err) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');

        console.log('🔄 Token refresh failed - Session cleared');

        throw err;
    }
}

const api = axios.create({
    baseURL: BASE_URL,
    // headers: { "Content-Type": "application/json" },
    timeout: 30000,
});

async function isJwtExpired(token) {
    if (!token) return true;
    const {exp} = jwtDecode(token);
    return Date.now() >= exp * 1000;
}

// async function refreshJwt() {
//     const refreshToken = await SecureStore.getItemAsync('refreshToken');
//     if (!refreshToken) throw new Error('No refresh token');
//
//     try {
//         const res = await api.post('/auth/refresh', {refreshToken});
//         const {jwt: newJwt, refreshToken: newRefresh} = res.data;
//
//         await SecureStore.setItemAsync('accessToken', newJwt);
//         if (newRefresh) await SecureStore.setItemAsync('refreshToken', newRefresh);
//         return newJwt;
//     } catch (err) {
//         await SecureStore.deleteItemAsync('accessToken');
//         await SecureStore.deleteItemAsync('refreshToken');
//         Alert.alert("Session expired", "Please login again");
//         throw err;
//     }
// }

//
// api.interceptors.request.use(
//     async (config) => {
//
//         const publicEndpoints = [
//             "/college/colleges",
//             "/auth/login/otp",
//             "/auth/signup/otp",
//             "/auth/check",
//             "/auth/refresh",
//             "/auth/forgot-password",
//             "/auth/reset-password",
//             "/listing/all",
//             "/follow",
//             "/profile/seller/",
//             "/Review/seller/",
//             "/listing/popular-categories",
//         ];
//
//         if (!publicEndpoints.some((url) => config.url.includes(url))) {
//             let token = await SecureStore.getItemAsync("accessToken");
//
//             if (await isJwtExpired(token)) {
//                 token = await refreshJwt();
//             }
//
//             if (token) {
//                 config.headers.Authorization = `Bearer ${token}`;
//             }
//
//             if (config.data instanceof FormData) {
//                 config.headers['Content-Type'] = 'multipart/form-data';
//             }
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

api.interceptors.request.use(
    async (config) => {
        if (config.url.includes("/auth/refresh")) {
            return config;
        }

        const publicEndpoints = [
            "/college/colleges", "/auth/login/otp", "/auth/signup/otp",
            "/auth/check", "/auth/refresh", "/auth/forgot-password",
            "/auth/reset-password", "/listing/all", "/follow",
            "/profile/seller/", "/Review/seller/", "/listing/popular-categories",
        ];

        const isPublic = publicEndpoints.some((url) => config.url.includes(url));
        let token = await SecureStore.getItemAsync("accessToken");

        if (token && await isJwtExpired(token)) {
            try {
                token = await refreshJwt();
            } catch (error) {
                if (!isPublic) throw error;
                token = null;
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const serverMessage = error.response?.data?.message;

        const token = await SecureStore.getItemAsync('accessToken');
        const isActuallyGuest = !token;

        if (status === 403) {
            if (isActuallyGuest) {
                console.log("🔒 Silent 403: Guest hit protected route.");
            } else {
                Alert.alert("Access Denied", "You don't have permission to do this.");
            }
        }
        else if (status === 500) {
            Alert.alert("Server Error", "Something went wrong on our end.");
        }
        else if (serverMessage && status !== 401) {
            Alert.alert("Agora", serverMessage);
        }

        return Promise.reject(error);
    }
);

export const getColleges = async () => {
    const res = await api.get('/college/colleges');
    return res.data;
};

export const apiGet = async (endpoint, params = {}) => {
    const res = await api.get(endpoint, {params});
    return res.data;
};

export const apiPost = async (endpoint, body) => {
    const config = {};
    if (body instanceof FormData) {
        config.headers = {'Content-Type': 'multipart/form-data'};
        config.transformRequest = [(data) => data];
    }
    const res = await api.post(endpoint, body, config);
    return res.data;
};

export const apiPut = async (endpoint, body) => {
    const res = await api.put(endpoint, body);
    return res.data;
};

export const apiDelete = async (endpoint) => {
    const res = await api.delete(endpoint);
    return res.data;
};

export const apiPatch = async (endpoint, body) => {
    const res = await api.patch(endpoint, body);
    return res.data;
};

export const loginWithOtp = async (firebaseToken, expoPushToken) => {
    const payload = {firebaseToken, expoPushToken};
    return await apiPost('/auth/login/otp', payload);
};

export const signupWithOtp = async (firebaseToken, collegeId, expoPushToken) => {
    const payload = {firebaseToken, collegeId, expoPushToken};
    return await apiPost('/auth/signup/otp', payload);
};

export const completeProfile = async (jwt, profileData) => {

    const res = await api.put('/auth/complete-profile', profileData, {
        headers: {'Authorization': `Bearer ${jwt}`}
    });
    return res.data;
};