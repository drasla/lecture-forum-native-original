import axios from "axios";
import useAuthStore from "@/stores/auth/useAuthStore";

// Expo 환경에서는 VITE_ 대신 EXPO_PUBLIC_ 접두사가 붙은 환경 변수를 사용합니다.
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    withCredentials: true,
});

api.interceptors.request.use(
    config => {
        const { token } = useAuthStore.getState();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // 추후 토큰 만료(401) 등 전역 에러 처리가 필요할 때 여기에 작성합니다.
        return Promise.reject(error);
    },
);

export default api;
