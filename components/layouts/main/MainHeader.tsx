import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/theme/useThemeStore";

export default function MainHeader() {
    const { theme, onChangeTheme } = useThemeStore();

    return (
        <View className="bg-background-paper w-full min-h-[64px] border-b border-divider justify-center">
            <View className="flex-row items-center justify-between w-full max-w-[1000px] self-center px-4 gap-3">
                <Link href="/" asChild>
                    <Pressable className="flex-row items-center gap-1.5">
                        <Ionicons name="chatbubbles" size={24} className="text-primary-main" />
                        <Text className="text-lg font-extrabold text-primary-main">토론대난투</Text>
                    </Pressable>
                </Link>

                <View className="flex-row items-center gap-2">
                    <Pressable onPress={onChangeTheme} className="p-1.5">
                        <Ionicons
                            name={theme === "light" ? "sunny" : "moon"}
                            size={20}
                            className="text-text-default"
                        />
                    </Pressable>

                    <Link href="/auth/register" asChild>
                        <Pressable className="bg-primary-main px-3.5 py-2 rounded-md">
                            <Text className="text-sm font-bold text-primary-contrastText">
                                회원가입
                            </Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </View>
    );
}
