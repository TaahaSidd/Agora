import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://10.0.2.2:9000/Agora";

const api = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (err) {
            console.warn("Error reading token:", err);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Generic POST request
export const apiPost = async (endpoint, body) => {
    try {
        const res = await api.post(endpoint, body);
        return res.data;
    } catch (error) {
        console.error("apiPost error:", error.response?.data || error.message);
        throw error;
    }
};

// Generic GET request
export const apiGet = async (endpoint, params = {}) => {
    try {
        const res = await api.get(endpoint, { params });
        return res.data;
    } catch (error) {
        console.error("apiGet error:", error.response?.data || error.message);
        throw error;
    }
};

// Optional: PUT request
export const apiPut = async (endpoint, body) => {
    try {
        const res = await api.put(endpoint, body);
        return res.data;
    } catch (error) {
        console.error("apiPut error:", error.response?.data || error.message);
        throw error;
    }
};

// Optional: DELETE request
export const apiDelete = async (endpoint) => {
    try {
        const res = await api.delete(endpoint);
        return res.data;
    } catch (error) {
        console.error("apiDelete error:", error.response?.data || error.message);
        throw error;
    }
};
