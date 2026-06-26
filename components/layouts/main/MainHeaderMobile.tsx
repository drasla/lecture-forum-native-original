import { useEffect, useState } from "react";
import { View, Text, Pressable, Modal, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import useAuthStore from "@/stores/auth/useAuthStore";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import Accordion from "@/components/common/accordion/Accordion";
import categoryApi from "@/api/user/categoryApi";
import { Category } from "@/types/category";
import { MYPAGE_NAV_LIST } from "@/constants/menu";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainHeaderMobile() {
    const router = useRouter();
    const { theme, onChangeTheme } = useThemeStore();
    const { isLoggedIn, user, logout } = useAuthStore();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    // 💡 isCategoryExpanded 상태는 Accordion이 자체 관리하므로 삭제했습니다.

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
        setIsMenuOpen(false);
        router.replace("/");
    };

    const handleNavigate = (path: string) => {
        setIsMenuOpen(false);
        router.push(path);
    };

    return (
        <>
            <View className="bg-background-paper w-full h-16 border-b border-divider justify-center z-50">
                <View className="flex-row items-center justify-between w-full px-4 h-full">
                    {/* 로고 영역 */}
                    <Link href="/" asChild>
                        <Pressable className="flex-row items-center gap-2">
                            <Ionicons name="chatbubbles" size={26} className="text-primary-main" />
                            <Text className="text-xl font-extrabold text-primary-main tracking-tight">
                                토론대난투
                            </Text>
                        </Pressable>
                    </Link>

                    {/* 우측 컨트롤 영역 */}
                    <View className="flex-row items-center gap-2">
                        <Pressable
                            onPress={onChangeTheme}
                            className="p-2 rounded-full hover:bg-background-default transition-colors">
                            <Ionicons
                                name={theme === "light" ? "sunny" : "moon"}
                                size={22}
                                className="text-text-default"
                            />
                        </Pressable>

                        {/* 햄버거 메뉴 버튼 */}
                        <Pressable
                            onPress={() => setIsMenuOpen(true)}
                            className="p-2 rounded-lg bg-background-default active:opacity-70">
                            <Feather name="menu" size={24} className="text-text-default" />
                        </Pressable>
                    </View>
                </View>
            </View>

            {/* 모바일 전용 풀스크린 메뉴 모달 */}
            <Modal
                visible={isMenuOpen}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setIsMenuOpen(false)}>
                <SafeAreaView className="flex-1 bg-background-paper">
                    {/* 모달 헤더 */}
                    <View className="flex-row items-center justify-between px-4 h-16 border-b border-divider">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="chatbubbles" size={22} className="text-primary-main" />
                            <Text className="text-lg font-extrabold text-primary-main">
                                토론대난투
                            </Text>
                        </View>
                        <Pressable
                            onPress={() => setIsMenuOpen(false)}
                            className="p-2 active:opacity-70">
                            <Feather name="x" size={28} className="text-text-default" />
                        </Pressable>
                    </View>

                    {/* 모달 내용 */}
                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: 20,
                            paddingTop: 24,
                            paddingBottom: 40,
                        }}>
                        <View className="flex-1">
                            {/* 1. 메인 메뉴 영역 */}
                            <TextComponent className="font-extrabold text-text-secondary text-sm mb-3">
                                메인 메뉴
                            </TextComponent>
                            <View className="mb-8 bg-background-default rounded-xl border border-divider overflow-hidden">
                                {/* 💡 토론장 (공통 Accordion 컴포넌트 적용) */}
                                <Accordion title="토론장" className="border-b border-divider">
                                    {categories.length === 0 ? (
                                        <TextComponent className="p-4 text-sm text-text-secondary text-center">
                                            카테고리가 없습니다.
                                        </TextComponent>
                                    ) : (
                                        categories.map(category => (
                                            <Pressable
                                                key={category.id}
                                                onPress={() =>
                                                    handleNavigate(`/categories/${category.id}`)
                                                }
                                                className="px-8 py-3 active:bg-background-default transition-colors">
                                                <TextComponent className="text-sm font-medium text-text-secondary">
                                                    - {category.name}
                                                </TextComponent>
                                            </Pressable>
                                        ))
                                    )}
                                </Accordion>

                                {/* 공지사항 */}
                                <Pressable
                                    onPress={() => handleNavigate("/notice")}
                                    className="flex-row items-center justify-between p-4 active:bg-divider transition-colors">
                                    <TextComponent className="text-base font-medium">
                                        공지사항
                                    </TextComponent>
                                    <Feather
                                        name="chevron-right"
                                        size={20}
                                        className="text-text-secondary"
                                    />
                                </Pressable>
                            </View>

                            {/* 2. 마이페이지 영역 (로그인 시) */}
                            {isLoggedIn && (
                                <>
                                    <TextComponent className="font-extrabold text-text-secondary text-sm mb-3">
                                        마이페이지
                                    </TextComponent>
                                    <View className="mb-10 bg-background-default rounded-xl border border-divider overflow-hidden">
                                        {MYPAGE_NAV_LIST.map((item, index) => {
                                            const isLast = index === MYPAGE_NAV_LIST.length - 1;

                                            return (
                                                <View key={item.path}>
                                                    {/* 회원 탈퇴 위에만 구분선 추가 */}
                                                    {item.isDanger && (
                                                        <View className="h-[1px] bg-divider" />
                                                    )}

                                                    <Pressable
                                                        onPress={() => handleNavigate(item.path)}
                                                        className={twMerge(
                                                            "flex-row items-center justify-between p-4 active:bg-divider transition-colors",
                                                            item.isDanger &&
                                                                "active:bg-error-main/10",
                                                            !isLast && "border-b border-divider",
                                                        )}>
                                                        <TextComponent
                                                            className={twMerge(
                                                                "text-base font-medium",
                                                                item.isDanger && "text-error-main",
                                                            )}>
                                                            {item.label}
                                                        </TextComponent>
                                                        <Feather
                                                            name="chevron-right"
                                                            size={20}
                                                            className={
                                                                item.isDanger
                                                                    ? "text-error-main"
                                                                    : "text-text-secondary"
                                                            }
                                                        />
                                                    </Pressable>
                                                </View>
                                            );
                                        })}
                                    </View>
                                </>
                            )}
                        </View>

                        {/* 하단: 유저 정보 영역 */}
                        <View className="mt-4 pt-4 border-t border-divider">
                            {isLoggedIn ? (
                                <View className="p-4 bg-background-default rounded-xl border border-divider">
                                    <View className="flex-row items-center justify-between mb-4">
                                        <View>
                                            <TextComponent className="font-bold text-lg mb-1">
                                                {user?.nickname} 님
                                            </TextComponent>
                                            <TextComponent className="text-sm text-text-secondary">
                                                {user?.email}
                                            </TextComponent>
                                        </View>
                                        {user?.role === "ADMIN" && (
                                            <Pressable
                                                onPress={() => handleNavigate("/admin")}
                                                className="p-2 rounded-full bg-background-paper border border-divider active:opacity-70">
                                                <Ionicons
                                                    name="shield"
                                                    size={20}
                                                    className="text-primary-main"
                                                />
                                            </Pressable>
                                        )}
                                    </View>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="error"
                                        onPress={handleLogout}>
                                        로그아웃
                                    </Button>
                                </View>
                            ) : (
                                <View className="flex-row gap-3">
                                    <Button
                                        className="flex-1"
                                        variant="outlined"
                                        color="primary"
                                        onPress={() => handleNavigate("/auth/login")}>
                                        로그인
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        variant="contained"
                                        color="primary"
                                        onPress={() => handleNavigate("/auth/register")}>
                                        회원가입
                                    </Button>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </>
    );
}
