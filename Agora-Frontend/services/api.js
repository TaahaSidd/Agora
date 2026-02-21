import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

//const BASE_URL = "http://192.168.8.15:9000/Agora";
// const BASE_URL = "https://francisca-overjocular-cheryle.ngrok-free.dev/Agora";
const BASE_URL = "https://agora-backend-cw64.onrender.com/Agora";

const authApi = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

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
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('currentUser');

        console.log('🔄 Token refresh failed - Session cleared');
        throw err;
    }
}

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
});

async function isJwtExpired(token) {
    if (!token) return true;
    try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000;
    } catch (e) {
        return true;
    }
}

api.interceptors.request.use(
    async (config) => {
        if (config.url.includes("/auth/refresh")) {
            return config;
        }

        const publicEndpoints = [
            "/college/colleges",
            "/college/colleges/search",
            "/auth/login",
            "/auth/signup",
            "/auth/google-signin",
            "/auth/check",
            "/auth/refresh",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/listing/all",
            "/listing/popular-categories",
        ];

        const isPublic = publicEndpoints.some((url) => config.url.includes(url));

        let token = await SecureStore.getItemAsync("accessToken");

        if (!token) {
            console.log('⚠️ INTERCEPTOR - No token found');
            return config;
        }

        if (await isJwtExpired(token)) {
            console.log('⏰ INTERCEPTOR - Token expired, refreshing...');
            try {
                token = await refreshJwt();
                console.log('✅ INTERCEPTOR - Token refreshed successfully');
            } catch (error) {
                console.log('❌ INTERCEPTOR - Refresh failed:', error.message);
                if (!isPublic) throw error;
                token = null;
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('INTERCEPTOR - Auth header set');
        } else {
            console.log('INTERCEPTOR - No token, making public request');
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

        if (status === 401) {
            console.log('🚫 401 Unauthorized - Clearing session');
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('currentUser');
        }

        return Promise.reject(error);
    }
);

// ===== API HELPER FUNCTIONS =====

export const getColleges = async () => {
    const res = await api.get('/college/colleges');
    return res.data;
};

export const searchColleges = async (query) => {
    const res = await api.get('/college/colleges/search', { params: { query } });
    return res.data;
};

export const apiGet = async (endpoint, params = {}) => {
    const res = await api.get(endpoint, { params });
    return res.data;
};

export const apiPost = async (endpoint, body) => {
    const config = {};
    if (body instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
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

// ===== AUTH FUNCTIONS =====

export const sendOtpForLogin = async (email) => {
    return await apiPost('/auth/send-otp/login', { email });
};

export const sendOtpForSignup = async (email) => {
    return await apiPost('/auth/send-otp/signup', { email });
};

export const loginWithOtp = async (email, otp, expoPushToken) => {
    const payload = { email, otp, expoPushToken };
    return await apiPost('/auth/login/otp', payload);
};

export const signupWithOtp = async (email, otp, collegeId, expoPushToken) => {
    const payload = { email, otp, collegeId, expoPushToken };
    return await apiPost('/auth/signup/otp', payload);
};

export const signup = async (payload) => {
    return await apiPost('/auth/signup', payload);
};

export const login = async (payload) => {
    return await apiPost('/auth/login', payload);
};

export const completeProfile = async (token, profileData) => {
    const res = await api.put('/auth/complete-profile', profileData, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.data;
};


// ===== UTILITY FUNCTIONS =====


export const clearAuthData = async () => {
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('currentUser');
    console.log('✅ All auth data cleared');
};