import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { Inquiry } from "@/types/inquiry";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Badge from "@/components/common/badge/Badge";
import Pagination from "@/components/common/pagination/Pagination";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function AdminInquiryListPage() {
    const router = useRouter();
    const [list, setList] = useState<Inquiry[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20;

    const loadInquiries = async (targetPage: number, targetSize: number) => {
        try {
            setIsLoading(true);
            const result = await adminInquiryApi.getInquiryList(targetPage, targetSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                window.alert("문의 목록을 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "문의 목록을 불러오는데 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadInquiries(currentPage, pageSize).then(() => {});
    }, [currentPage, pageSize]);

    const handleDeleteInquiry = async (id: number) => {
        const executeDelete = async () => {
            try {
                await adminInquiryApi.deleteInquiry(id);
                loadInquiries(currentPage, pageSize).then(() => {});
            } catch (error) {
                console.error(error);
                if (Platform.OS === "web") {
                    window.alert("문의 삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "문의 삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (window.confirm("정말 이 문의글을 삭제하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("문의 삭제", "정말 이 문의글을 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <View className={twMerge("flex-1", "w-full", "bg-background-default")}>
            <Title
                title={"1:1 문의 관리"}
                description={"사용자들이 남긴 1:1 문의를 확인하고 답변을 작성합니다."}
            />

            <Card className={"p-0 overflow-hidden flex-1 flex-col"}>
                {/* 테이블 헤더 */}
                <View
                    className={twMerge(
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-12"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["font-bold", "text-text-secondary", "px-2"],
                        )}>
                        문의 제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        작성자
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-20"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        상태
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        작성일
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-16"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        관리
                    </TextComponent>
                </View>

                {/* 테이블 바디 */}
                <ScrollView className={"flex-1"}>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : list.length === 0 ? (
                        <View className={twMerge("py-10", "justify-center", "items-center")}>
                            <TextComponent className={"text-text-secondary"}>
                                등록된 문의가 없습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        list.map((item, index) => {
                            const isLast = index === list.length - 1;
                            const isAnswered = !!item.answer; // 답변 유무 판단

                            return (
                                <View
                                    key={item.id}
                                    className={twMerge(
                                        [
                                            "flex-row",
                                            "items-center",
                                            "px-4",
                                            "py-3",
                                            "transition-all",
                                            "hover:bg-background-default",
                                        ],
                                        !isLast && ["border-b", "border-divider"],
                                    )}>
                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-12"],
                                            ["text-center", "text-text-secondary"],
                                        )}>
                                        {item.id}
                                    </TextComponent>

                                    <View
                                        className={twMerge(["flex-1"], ["px-2", "justify-center"])}>
                                        <TextComponent className={"font-bold"} numberOfLines={1}>
                                            {item.title}
                                        </TextComponent>
                                        {/* 모바일 환경에서는 작성자 닉네임을 제목 아래에 표시 */}
                                        <TextComponent
                                            className={
                                                "flex md:hidden text-xs text-text-secondary mt-1"
                                            }
                                            numberOfLines={1}>
                                            {item.user.nickname}
                                        </TextComponent>
                                    </View>

                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-24"],
                                            ["text-center", "text-sm", "text-text-default"],
                                        )}
                                        numberOfLines={1}>
                                        {item.user.nickname}
                                    </TextComponent>

                                    <View className={twMerge(["w-20"], ["items-center"])}>
                                        <Badge
                                            color={isAnswered ? "info" : "warning"}
                                            size={"small"}>
                                            {isAnswered ? "답변 완료" : "답변 대기"}
                                        </Badge>
                                    </View>

                                    <TextComponent
                                        className={twMerge(
                                            ["hidden", "md:flex", "w-24"],
                                            ["text-sm", "text-text-secondary", "text-center"],
                                        )}>
                                        {item.createdAt.substring(0, 10)}
                                    </TextComponent>

                                    <View
                                        className={twMerge(
                                            ["w-16"],
                                            ["flex-row", "items-center", "justify-center", "gap-2"],
                                        )}>
                                        {/* 상세/답변 버튼 */}
                                        <Pressable
                                            className={"p-1.5"}
                                            onPress={() =>
                                                router.push(`/admin/inquiries/${item.id}`)
                                            }>
                                            <Feather
                                                name={"edit-3"} // 문의 답변 뉘앙스에 맞는 아이콘
                                                size={16}
                                                className={
                                                    "text-text-secondary hover:text-primary-main"
                                                }
                                            />
                                        </Pressable>
                                        {/* 삭제 버튼 */}
                                        <Pressable
                                            className={"p-1.5"}
                                            onPress={() => handleDeleteInquiry(item.id)}>
                                            <Feather
                                                name={"trash-2"}
                                                size={16}
                                                className={"text-error-main hover:opacity-70"}
                                            />
                                        </Pressable>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>

                {!isLoading && list.length > 0 && (
                    <View className={"py-4 border-t border-divider bg-background-paper"}>
                        <Pagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            onPageChange={newPage => {
                                router.setParams({
                                    page: String(newPage),
                                    size: String(pageSize),
                                });
                            }}
                            size={"medium"}
                            color={"primary"}
                            shape={"square"}
                        />
                    </View>
                )}
            </Card>
        </View>
    );
}

export default AdminInquiryListPage;
