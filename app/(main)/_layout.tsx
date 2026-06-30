import { useWindowDimensions, View } from "react-native";
import { Stack } from "expo-router";
import MainFooter from "@/components/layouts/main/MainFooter";
import MainHeaderDesktop from "@/components/layouts/main/MainHeaderDesktop";
import MainHeaderMobile from "@/components/layouts/main/MainHeaderMobile";

function MainLayout() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    return (
        // flex-1을 주어 전체 화면을 꽉 채웁니다.
        <View className="flex-1">
            {/* Stack에 flex-1을 주어 남은 공간을 모두 차지하게 합니다. */}
            {isMobile ? <MainHeaderMobile /> : <MainHeaderDesktop />}

            <View className="flex-1 w-full max-w-7xl self-center p-4">
                <Stack screenOptions={{ headerShown: false }} />
            </View>

            {/* 화면 밖 맨 밑에 푸터를 고정합니다. */}
            <MainFooter />
        </View>
    );
}

export default MainLayout;
