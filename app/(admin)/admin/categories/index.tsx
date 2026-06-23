import { useEffect, useState } from "react";
import { View, ScrollView, Alert, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import { Category } from "@/types/category";
import adminCategoryApi from "@/api/admin/adminCategoryApi";
import { Feather } from "@expo/vector-icons";
import Title from "@/components/common/title/Title";
import Badge from "@/components/common/badge/Badge";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function AdminCategoryListPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await adminCategoryApi.getCategoryList();
            setCategories(data);
        } catch (error) {
            Alert.alert("오류", "카테고리 목록을 불러오는데 실패했습니다.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories().then(() => {});
    }, []);

    const handleToggleStatus = async (id: number) => {
        try {
            await adminCategoryApi.toggleCategoryStatusById(id);
            fetchCategories().then(() => {});
        } catch (error) {
            Alert.alert("오류", "상태 변경에 실패했습니다.");
        }
    };

    // React-Native 에는 table 태그와 대응되는 컴포넌트가 없기 때문에 View나, FlatList 등을 통해 구현

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title
                title="카테고리 관리"
                description="서비스의 게시판 카테고리를 관리하고 생성할 수 있습니다.">
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onPress={() => router.push("/admin/categories/create")}>
                    + 카테고리 생성
                </Button>
            </Title>

            <View className="flex-1 bg-background-paper rounded-xl border border-divider overflow-hidden">
                <View className="flex-row items-center border-b border-divider bg-background-default px-4 py-3">
                    <TextComponent className="w-16 font-bold text-text-secondary text-center">
                        ID
                    </TextComponent>
                    <TextComponent className="flex-1 font-bold text-text-secondary px-2">
                        카테고리명
                    </TextComponent>
                    <TextComponent className="w-24 font-bold text-text-secondary text-center">
                        상태
                    </TextComponent>
                    <TextComponent className="w-24 font-bold text-text-secondary text-center">
                        관리
                    </TextComponent>
                </View>

                <ScrollView className="flex-1">
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : categories.length === 0 ? (
                        <View className="py-10 items-center justify-center">
                            <TextComponent className="text-text-secondary">
                                등록된 카테고리가 없습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        categories.map(item => (
                            <View
                                key={item.id}
                                className="flex-row items-center border-b border-divider px-4 py-4 hover:bg-background-default transition-colors">
                                <TextComponent className="w-16 text-center text-text-secondary">
                                    {item.id}
                                </TextComponent>
                                <TextComponent
                                    className="flex-1 font-semibold px-2"
                                    numberOfLines={1} // 💡 1줄이 넘어가면 자동으로 '...' 처리합니다.
                                    ellipsizeMode="tail" // 💡 (옵션) 끝부분을 '...'으로 자릅니다. (기본값이 tail이라 생략 가능합니다)
                                >
                                    {item.name}
                                </TextComponent>

                                {/* 상태 뱃지 */}
                                <View className="w-24 justify-center items-center">
                                    <Badge
                                        color={item.status === "ACTIVE" ? "success" : "error"}
                                        size="medium">
                                        {item.status === "ACTIVE" ? "활성" : "비활성"}
                                    </Badge>
                                </View>

                                {/* 관리 (수정/토글) 버튼들 */}
                                <View className="w-24 flex-row items-center justify-center gap-3">
                                    <Pressable
                                        onPress={() => router.push(`/admin/categories/${item.id}`)}
                                        className="p-1.5">
                                        <Feather
                                            name="edit-2"
                                            size={16}
                                            className="text-text-secondary hover:text-primary-main"
                                        />
                                    </Pressable>
                                    <Pressable
                                        onPress={() => handleToggleStatus(item.id)}
                                        className="p-1.5">
                                        <Feather
                                            name={
                                                item.status === "ACTIVE"
                                                    ? "toggle-right"
                                                    : "toggle-left"
                                            }
                                            size={18}
                                            className={
                                                item.status === "ACTIVE"
                                                    ? "text-success-main"
                                                    : "text-text-secondary"
                                            }
                                        />
                                    </Pressable>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
        </View>
    );
}

export default AdminCategoryListPage;
