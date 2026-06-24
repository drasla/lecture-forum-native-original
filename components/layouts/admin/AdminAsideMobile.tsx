import { useEffect, useState } from "react";
import { View, Text, Pressable, Modal, useWindowDimensions } from "react-native";
import { Link, router, usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import useAuthStore from "@/stores/auth/useAuthStore";
import Button from "@/components/common/button/Button";
import { ADMIN_NAV_LIST } from "@/constants/menu";

function AdminAsideMobile() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();
    const [isMenuOpen, setMenuOpen] = useState(false);

    // useWindowDimensions : 현재 화면의 너비를 실시간으로 가져옴
    const { width } = useWindowDimensions();
    useEffect(() => {
        if (width >= 768 && isMenuOpen) {
            setMenuOpen(false);
        }
    }, [width, isMenuOpen]);

    return (
        <>
            {/* 1. 모바일 상단 고정 헤더 */}
            <View className="h-14 bg-background-paper border-b border-divider flex-row justify-between items-center px-4">
                <Link href="/admin" asChild>
                    <Pressable>
                        <Text className="text-lg font-extrabold text-primary-main">
                            관리자 센터
                        </Text>
                    </Pressable>
                </Link>
                <Pressable onPress={() => setMenuOpen(true)} className="p-2">
                    <Feather name="menu" size={24} className="text-text-default" />
                </Pressable>
            </View>

            {/* 2. 햄버거 메뉴 모달 (풀스크린) */}
            {isMenuOpen && (
                <Modal visible={isMenuOpen} transparent={true} animationType="slide">
                    <View className="flex-1 bg-background-paper flex-col justify-between pt-safe-top">
                        <View>
                            {/* 모달 닫기 버튼 및 헤더 */}
                            <View className="h-14 border-b border-divider flex-row justify-between items-center px-4">
                                <Text className="text-lg font-extrabold text-text-default">
                                    메뉴
                                </Text>
                                <Pressable onPress={() => setMenuOpen(false)} className="p-2">
                                    <Feather name="x" size={24} className="text-text-default" />
                                </Pressable>
                            </View>

                            {/* 네비게이션 리스트 */}
                            <View className="px-3 py-4 gap-1">
                                {ADMIN_NAV_LIST.map(item => {
                                    const isActive =
                                        item.path === "/"
                                            ? pathname === "/" // 메인 홈은 정확히 일치할 때만
                                            : pathname === item.path ||
                                              pathname.startsWith(`${item.path}/`);
                                    return (
                                        <Link
                                            href={item.path}
                                            key={item.path}
                                            asChild
                                            // 💡 링크 이동 시 모달을 닫아줍니다.
                                            onPress={() => setMenuOpen(false)}>
                                            <Pressable
                                                className={twMerge(
                                                    "flex-row items-center gap-3 px-4 py-4 rounded-xl",
                                                    isActive
                                                        ? "bg-primary-main/10"
                                                        : "active:bg-background-default",
                                                )}>
                                                <Feather
                                                    name={item.icon as any}
                                                    size={20}
                                                    className={
                                                        isActive
                                                            ? "text-primary-main"
                                                            : "text-text-secondary"
                                                    }
                                                />
                                                <Text
                                                    className={twMerge(
                                                        "font-bold text-base",
                                                        isActive
                                                            ? "text-primary-main"
                                                            : "text-text-default",
                                                    )}>
                                                    {item.label}
                                                </Text>
                                            </Pressable>
                                        </Link>
                                    );
                                })}
                            </View>
                        </View>

                        {/* 모달 하단 프로필 영역 */}
                        <View className="p-4 border-t border-divider pb-safe">
                            <View className="flex-row items-center gap-3 mb-4">
                                <View className="w-12 h-12 rounded-full bg-primary-main items-center justify-center">
                                    <Feather name="shield" size={20} color="white" />
                                </View>
                                <View>
                                    <Text className="text-base font-bold text-text-default">
                                        {user?.name}
                                    </Text>
                                    <Text className="text-sm text-text-secondary">
                                        {user?.email}
                                    </Text>
                                </View>
                            </View>
                            <Button
                                variant={"outlined"}
                                color={"error"}
                                fullWidth={true}
                                size="large"
                                onPress={() => {
                                    setMenuOpen(false);
                                    logout();
                                    setTimeout(() => {
                                        router.replace("/");
                                    }, 100);
                                }}>
                                로그아웃
                            </Button>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
}

export default AdminAsideMobile;
