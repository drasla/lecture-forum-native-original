import { Slot } from "expo-router";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../styles/global.css";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { cssInterop } from "react-native-css-interop";
import { Ionicons } from "@expo/vector-icons";
import userApi from "@/api/user/userApi";
import useAuthStore from "@/stores/auth/useAuthStore";

cssInterop(Ionicons, {
    className: {
        target: "style",
        nativeStyleToProp: { color: true },
    },
});

function RootLayout() {
    const { token, logout } = useAuthStore();
    const { theme } = useThemeStore();
    const { setColorScheme } = useColorScheme();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setColorScheme(theme);
    }, [theme, setColorScheme]);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                if (token) {
                    const response = await userApi.checkMe();

                    if (response.data) {
                        useAuthStore.setState({ user: response.data });
                    }
                }
            } catch (error) {
                logout();
            } finally {
                setIsReady(true);
            }
        };

        initializeApp().then(() => {});
    }, []);

    if (!isReady) return null;

    return (
        <SafeAreaProvider>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />

            <SafeAreaView className="flex-1 bg-background-default">
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default RootLayout;
