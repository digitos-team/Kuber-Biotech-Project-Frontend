import axios from "axios";

const axiosInstance = axios.create({
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        console.log('=== AXIOS REQUEST INTERCEPTOR ===');
        console.log('Request URL:', config.url);
        console.log('Token from localStorage:', token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Authorization header set:', config.headers.Authorization);
        } else {
            console.warn('⚠️ WARNING: No token found in localStorage!');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;