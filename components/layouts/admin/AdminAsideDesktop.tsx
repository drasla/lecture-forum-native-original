import { View, Text, Pressable } from "react-native";
import { Link, usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import useAuthStore from "@/stores/auth/useAuthStore";
import Button from "@/components/common/button/Button";
import { ADMIN_NAV_LIST } from "@/constants/menu";

function AdminAsideDesktop() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <View className="w-[250px] h-full bg-background-paper border-r border-divider flex-col justify-between">
            <View>
                <Link href="/admin" asChild>
                    <Pressable className="h-16 justify-center px-6 border-b border-divider">
                        <Text className="text-xl font-extrabold text-primary-main">
                            관리자 센터
                        </Text>
                    </Pressable>
                </Link>

                <View className="px-3 py-4 gap-1">
                    {ADMIN_NAV_LIST.map(item => {
                        const isActive = pathname === item.path;
                        return (
                            <Link href={item.path} key={item.path} asChild>
                                <Pressable
                                    className={twMerge(
                                        "flex-row items-center gap-3 px-4 py-3.5 rounded-xl transition-all",
                                        isActive
                                            ? "bg-primary-main/10"
                                            : "hover:bg-background-default",
                                    )}>
                                    <Feather
                                        name={item.icon as any}
                                        size={18}
                                        className={
                                            isActive ? "text-primary-main" : "text-text-secondary"
                                        }
                                    />
                                    <Text
                                        className={twMerge(
                                            "font-bold text-[15px]",
                                            isActive ? "text-primary-main" : "text-text-default",
                                        )}>
                                        {item.label}
                                    </Text>
                                </Pressable>
                            </Link>
                        );
                    })}
                </View>
            </View>

            <View className="p-4 border border-divider m-4 rounded-2xl bg-background-default">
                <View className="flex-row items-center gap-3 mb-3">
                    <View className="w-10 h-10 rounded-full bg-primary-main items-center justify-center">
                        <Feather name="shield" size={18} color="white" />
                    </View>
                    <View>
                        <Text className="text-sm font-bold text-text-default">{user?.name}</Text>
                        <Text className="text-xs text-text-secondary">{user?.email}</Text>
                    </View>
                </View>
                <Button variant={"outlined"} color={"error"} fullWidth={true} onPress={logout}>
                    로그아웃
                </Button>
            </View>
        </View>
    );
}

export default AdminAsideDesktop;
