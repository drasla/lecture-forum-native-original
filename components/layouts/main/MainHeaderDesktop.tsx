import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import useAuthStore from "@/stores/auth/useAuthStore";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import Dropdown from "@/components/common/dropdown/Dropdown";
import categoryApi from "@/api/user/categoryApi";
import { Category } from "@/types/category";
import { twMerge } from "tailwind-merge";
import { MYPAGE_NAV_LIST } from "@/constants/menu";

function MainHeaderDesktop() {
    const router = useRouter();
    const { theme, onChangeTheme } = useThemeStore();
    const { isLoggedIn, user, logout } = useAuthStore();

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const list = await categoryApi.getCategoryList();
                setCategories(list);
            } catch (error) {
                console.error("카테고리를 불러오는데 실패했습니다.", error);
            }
        };

        fetchCategories().then(() => {});
    }, []);

    const handleLogout = () => {
        logout();
        router.replace("/");
    };

    return (
        <View className="bg-background-paper w-full h-16 border-b border-divider justify-center z-50">
            <View className="flex-row items-center justify-between w-full max-w-7xl self-center px-4 h-full">
                {/* 1. 로고 영역 */}
                <Link href="/" asChild>
                    <Pressable className="flex-row items-center gap-2">
                        <Ionicons name="chatbubbles" size={26} className="text-primary-main" />
                        <Text className="text-xl font-extrabold text-primary-main tracking-tight">
                            토론대난투
                        </Text>
                    </Pressable>
                </Link>

                {/* 2. 네비게이션 영역 */}
                <View className="flex-1 flex-row items-center justify-start px-8 gap-6">
                    <Dropdown
                        trigger={
                            <View className="flex-row items-center cursor-pointer">
                                <TextComponent className="font-bold hover:text-primary-main transition-colors text-base">
                                    토론장
                                </TextComponent>
                                <Ionicons
                                    name="chevron-down"
                                    size={16}
                                    className="ml-1 text-text-secondary"
                                />
                            </View>
                        }>
                        {close => (
                            <ScrollView
                                className="max-h-[300px] w-48 py-2"
                                showsVerticalScrollIndicator={true}>
                                {categories.length === 0 ? (
                                    <View className="px-4 py-3">
                                        <TextComponent className="text-sm text-text-secondary">
                                            카테고리가 없습니다.
                                        </TextComponent>
                                    </View>
                                ) : (
                                    categories.map((category, index) => (
                                        <Pressable
                                            key={category.id}
                                            onPress={() => {
                                                close();
                                                router.push(`/categories/${category.id}`);
                                            }}
                                            className={twMerge(
                                                ["px-4", "py-3", "transition-colors"],
                                                ["border-b", "border-divider"],
                                                ["hover:bg-primary-main"],
                                                index === categories.length - 1 && "border-b-0",
                                            )}>
                                            <TextComponent
                                                className={twMerge([
                                                    "text-sm",
                                                    "font-medium",
                                                    "hover:text-primary-contrastText",
                                                ])}>
                                                {category.name}
                                            </TextComponent>
                                        </Pressable>
                                    ))
                                )}
                            </ScrollView>
                        )}
                    </Dropdown>

                    <Link href="/notice" asChild>
                        <Pressable>
                            <TextComponent className="font-bold hover:text-primary-main transition-colors text-base">
                                공지사항
                            </TextComponent>
                        </Pressable>
                    </Link>
                </View>

                {/* 3. 우측 컨트롤 영역 */}
                <View className="flex-row items-center gap-1 md:gap-2">
                    <Pressable
                        onPress={onChangeTheme}
                        className="p-2 rounded-full hover:bg-background-default transition-colors">
                        <Ionicons
                            name={theme === "light" ? "sunny" : "moon"}
                            size={22}
                            className="text-text-default"
                        />
                    </Pressable>

                    {isLoggedIn ? (
                        <View className="flex-row items-center gap-1 md:gap-3">
                            {/* 마이페이지 드롭다운 (아이콘으로 변경) */}
                            <Dropdown
                                trigger={
                                    <View className="p-2 rounded-full hover:bg-background-default transition-colors cursor-pointer">
                                        <Ionicons
                                            name="person-outline"
                                            size={22}
                                            className="text-text-default"
                                        />
                                    </View>
                                }>
                                {close => (
                                    <View className="py-2 w-40">
                                        {MYPAGE_NAV_LIST.map((item) => {
                                            return (
                                                <View key={item.path}>
                                                    {/* 회원 탈퇴 위에만 구분선 추가 */}
                                                    {item.isDanger && (
                                                        <View className="h-[1px] bg-divider my-1" />
                                                    )}

                                                    <Pressable
                                                        onPress={() => {
                                                            close();
                                                            router.push(item.path);
                                                        }}
                                                        className={twMerge(
                                                            "px-4 py-2.5 transition-colors",
                                                            item.isDanger
                                                                ? "hover:bg-error-main"
                                                                : "hover:bg-background-default",
                                                        )}>
                                                        <TextComponent
                                                            className={twMerge(
                                                                "text-sm font-medium",
                                                                item.isDanger &&
                                                                    "text-error-main hover:text-error-contrastText",
                                                            )}>
                                                            {item.label}
                                                        </TextComponent>
                                                    </Pressable>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </Dropdown>

                            {user?.role === "ADMIN" && (
                                <Pressable
                                    onPress={() => router.push("/admin")}
                                    className="p-2 rounded-full hover:bg-background-default transition-colors">
                                    <Ionicons
                                        name="shield"
                                        size={22}
                                        className="text-primary-main"
                                    />
                                </Pressable>
                            )}

                            <Button variant="contained" color="error" onPress={handleLogout}>
                                로그아웃
                            </Button>
                        </View>
                    ) : (
                        <View className="flex-row items-center gap-2">
                            <Button
                                variant="text"
                                color="primary"
                                onPress={() => router.push("/auth/login")}>
                                로그인
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onPress={() => router.push("/auth/register")}>
                                회원가입
                            </Button>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

export default MainHeaderDesktop;
