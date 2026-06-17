import { Slot } from "expo-router";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../styles/global.css";
import { View } from "react-native";
import React from "react";

function RootLayout() {
    const { theme } = useThemeStore();

    return (
        <SafeAreaProvider>
            <View className={`${theme} flex-1 bg-background-default`}>
                <Slot />
            </View>
        </SafeAreaProvider>
    );
}

export default RootLayout;
