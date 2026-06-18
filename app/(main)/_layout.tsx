import { View } from "react-native";
import { Stack } from "expo-router";
import MainHeader from "@/components/layouts/main/MainHeader";
import MainFooter from "@/components/layouts/main/MainFooter";
import React from "react";
import { cssInterop } from "react-native-css-interop";
import { Ionicons } from "@expo/vector-icons";

cssInterop(Ionicons, {
    className: {
        target: "style",
        nativeStyleToProp: { color: true },
    },
});

function MainLayout() {
    return (
        // flex-1을 주어 전체 화면을 꽉 채웁니다.
        <View className="flex-1">
            {/* Stack에 flex-1을 주어 남은 공간을 모두 차지하게 합니다. */}
            <MainHeader />
            <View className="flex-1">
                <Stack screenOptions={{ headerShown: false }} />
            </View>

            {/* 화면 밖 맨 밑에 푸터를 고정합니다. */}
            <MainFooter />
        </View>
    );
}

export default MainLayout;
