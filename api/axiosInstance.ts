import axios from "axios";
import useAuthStore from "@/stores/auth/useAuthStore";
import { Alert, Platform } from "react-native";

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
        if (error.response && error.response.status === 401) {
            // 현재 요청을 보낸 URL이 '/login'인지 확인합니다.
            const isLoginRequest = error.config?.url?.includes("/login");

            // 로그인 요청에서 발생한 401(비밀번호 틀림 등)이 '아닐 때'만 로그아웃 처리
            if (!isLoginRequest) {
                const { logout } = useAuthStore.getState();

                // 1. 스토어의 토큰과 유저 정보를 날려서 즉시 비로그인 상태로 만듭니다.
                logout();

                // 2. 사용자에게 알림을 띄웁니다. (웹/앱 분기 처리)
                if (Platform.OS === "web") {
                    window.alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                } else {
                    Alert.alert("인증 만료", "로그인이 만료되었습니다. 다시 로그인해주세요.", [
                        { text: "확인" },
                    ]);
                }
            }
        }
        return Promise.reject(error);
    },
);

export default api;
