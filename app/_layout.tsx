import { Slot } from "expo-router";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../styles/global.css";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";

function RootLayout() {
    const { theme } = useThemeStore();
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(theme);
    }, [theme]);

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
