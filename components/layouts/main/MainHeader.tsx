import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import Button from "@/components/common/button/Button";
import useAuthStore from "@/stores/auth/useAuthStore";

export default function MainHeader() {
    const { theme, onChangeTheme } = useThemeStore();
    const { isLoggedIn, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

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
                    <Pressable onPress={onChangeTheme} className="p-1.5 mr-1">
                        <Ionicons
                            name={theme === "light" ? "sunny" : "moon"}
                            size={20}
                            className="text-text-default"
                        />
                    </Pressable>

                    {isLoggedIn ? (
                        <Button
                            variant="contained"
                            color="error"
                            onPress={handleLogout}>
                            로그아웃
                        </Button>
                    ) : (
                        <View className="flex-row items-center gap-1">
                            <Link href="/auth/login" asChild>
                                <Button variant="text" color="primary">
                                    로그인
                                </Button>
                            </Link>

                            <Link href="/auth/register" asChild>
                                <Button variant="contained" color="primary">
                                    회원가입
                                </Button>
                            </Link>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
