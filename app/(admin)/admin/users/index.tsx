import { useEffect, useState } from "react";
import { View, ScrollView, Alert, Platform, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import Badge from "@/components/common/badge/Badge";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Pagination from "@/components/common/pagination/Pagination";
import { User } from "@/types/user";
import adminUserApi from "@/api/admin/adminUserApi";

function AdminUserListPage() {
    const router = useRouter();
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();

    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20;

    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPage, setTotalPage] = useState(1);

    const fetchUsers = async (targetPage: number, targetSize: number) => {
        try {
            setIsLoading(true);
            const data = await adminUserApi.getUserList(targetPage, targetSize);

            setUsers(data.list);
            setTotalPage(Math.ceil(data.total / data.size) || 1);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                window.alert("유저 목록을 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "유저 목록을 불러오는데 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, pageSize).then(() => {});
    }, [currentPage, pageSize]);

    // 유저 삭제(소프트 삭제) 핸들러
    const handleDeleteUser = async (id: number) => {
        const executeDelete = async () => {
            try {
                await adminUserApi.toggleUser(id);
                fetchUsers(currentPage, pageSize).then(() => {}); // 삭제 후 현재 페이지 새로고침
            } catch (error) {
                console.error(error);
                if (Platform.OS === "web") {
                    window.alert("유저 삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "유저 삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (window.confirm("정말 이 유저를 삭제 처리하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("유저 삭제", "정말 이 유저를 삭제 처리하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="회원 관리" description="서비스에 가입한 유저 목록을 조회하고 관리합니다.">
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onPress={() => router.push("/admin/users/create")}>
                    + 유저 생성
                </Button>
            </Title>

            <View className="flex-1 bg-background-paper rounded-xl border border-divider overflow-hidden flex-col">
                {/* 테이블 헤더 */}
                <View className="flex-row items-center border-b border-divider bg-background-default px-4 py-3">
                    <TextComponent className="w-12 font-bold text-text-secondary text-center">
                        ID
                    </TextComponent>
                    <TextComponent className="flex-1 font-bold text-text-secondary px-2">
                        유저 정보
                    </TextComponent>
                    <TextComponent className="w-16 font-bold text-text-secondary text-center">
                        권한
                    </TextComponent>
                    <TextComponent className="w-24 font-bold text-text-secondary text-center">
                        가입일
                    </TextComponent>
                    <TextComponent className="w-20 font-bold text-text-secondary text-center">
                        관리
                    </TextComponent>
                </View>

                {/* 테이블 바디 */}
                <ScrollView className="flex-1">
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : users.length === 0 ? (
                        <View className="py-10 items-center justify-center">
                            <TextComponent className="text-text-secondary">
                                등록된 유저가 없습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        users.map(user => {
                            const isDeleted = user.deletedAt !== null;

                            return (
                                <View
                                    key={user.id}
                                    className={`flex-row items-center border-b border-divider px-4 py-3 transition-colors ${
                                        isDeleted
                                            ? "bg-background-default opacity-60"
                                            : "hover:bg-background-default"
                                    }`}>
                                    {/* ID */}
                                    <TextComponent className="w-12 text-center text-text-secondary">
                                        {user.id}
                                    </TextComponent>

                                    {/* 유저 정보 (아이디, 이름, 닉네임 통합 - 모바일 최적화) */}
                                    <View className="flex-1 px-2 justify-center">
                                        <View className="flex-row items-center gap-1.5">
                                            <TextComponent className="font-bold" numberOfLines={1}>
                                                {user.username}
                                            </TextComponent>
                                            {isDeleted && (
                                                <Badge
                                                    color="error"
                                                    size="small"
                                                    variant="contained">
                                                    탈퇴됨
                                                </Badge>
                                            )}
                                        </View>
                                        <TextComponent
                                            className="text-xs text-text-secondary mt-0.5"
                                            numberOfLines={1}>
                                            {user.name} ({user.nickname})
                                        </TextComponent>
                                    </View>

                                    {/* 권한 */}
                                    <View className="w-16 items-center">
                                        <Badge
                                            color={user.role === "ADMIN" ? "info" : "secondary"}
                                            size="small">
                                            {user.role}
                                        </Badge>
                                    </View>

                                    {/* 가입일 */}
                                    <TextComponent className="w-24 text-center text-sm text-text-secondary">
                                        {user.createdAt.substring(0, 10)}
                                    </TextComponent>

                                    {/* 관리 버튼 영역 */}
                                    <View className="w-20 flex-row items-center justify-center gap-2">
                                        <Pressable
                                            onPress={() => router.push(`/admin/users/${user.id}`)}
                                            className="p-1.5"
                                            disabled={isDeleted}>
                                            <Feather
                                                name="edit-2"
                                                size={16}
                                                className={
                                                    isDeleted
                                                        ? "text-text-disabled"
                                                        : "text-text-secondary hover:text-primary-main"
                                                }
                                            />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => handleDeleteUser(user.id)}
                                            className="p-1.5"
                                            disabled={isDeleted}>
                                            <Feather
                                                name="trash-2"
                                                size={16}
                                                className={
                                                    isDeleted
                                                        ? "text-text-disabled"
                                                        : "text-error-main hover:opacity-70"
                                                }
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                {/* 하단 페이지네이션 */}
                {!isLoading && users.length > 0 && (
                    <View className="py-4 border-t border-divider bg-background-paper">
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            onPageChange={newPage =>
                                router.setParams({
                                    page: String(newPage),
                                    size: String(pageSize),
                                })
                            }
                            size="medium"
                            color="primary"
                            shape="square"
                        />
                    </View>
                )}
            </View>
        </View>
    );
}

export default AdminUserListPage;
