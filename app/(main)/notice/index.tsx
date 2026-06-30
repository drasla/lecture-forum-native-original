import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import noticeApi from "@/api/user/noticeApi";
import { Notice } from "@/types/notice";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import Pagination from "@/components/common/pagination/Pagination";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function NoticeListPage() {
    const router = useRouter();
    const [list, setList] = useState<Notice[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const loadNotices = async (targetPage: number, targetSize: number) => {
        try {
            setIsLoading(true);
            const result = await noticeApi.getNoticeList(targetPage, targetSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                window.alert("공지사항 목록을 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "공지사항 목록을 불러오는데 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadNotices(currentPage, pageSize).then(() => {});
    }, [currentPage, pageSize]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <ScrollView
            className="flex-1 w-full bg-background-default"
            showsVerticalScrollIndicator={false}>
            <Title
                title={"공지사항"}
                description={"서비스의 주요 소식 및 안내 사항을 확인하세요."}
            />

            <Card className="p-0 overflow-hidden flex-col">
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
                        번호
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["font-bold", "text-text-secondary", "px-2"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        등록일
                    </TextComponent>
                </View>

                {/* 테이블 바디 */}
                {/* 💡 4. 내부의 스크롤바(ScrollView)를 일반 View로 변경하여 내용만큼만 높이가 늘어나게 설정 */}
                <View>
                    {isLoading ? (
                        <View className="py-20">
                            <LoadingIndicator />
                        </View>
                    ) : list.length === 0 ? (
                        <View className={twMerge("pt-20", "justify-center", "items-center")}>
                            <TextComponent className={"text-text-secondary"}>
                                등록된 공지사항이 없습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        list.map((item, index) => {
                            const isLast = index === list.length - 1;

                            return (
                                <View
                                    key={item.id}
                                    className={twMerge(
                                        [
                                            "flex-row",
                                            "items-center",
                                            "px-4",
                                            "py-4",
                                            "transition-colors",
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

                                    <Pressable
                                        className={twMerge(["flex-1"], ["px-2", "justify-center"])}
                                        onPress={() => router.push(`/notice/${item.id}`)}>
                                        <TextComponent
                                            className={
                                                "text-base font-medium hover:text-primary-main transition-colors"
                                            }
                                            numberOfLines={1}>
                                            {item.title}
                                        </TextComponent>
                                    </Pressable>

                                    <TextComponent
                                        className={twMerge(
                                            ["w-24"],
                                            ["text-sm", "text-text-secondary", "text-center"],
                                        )}>
                                        {item.createdAt.substring(0, 10)}
                                    </TextComponent>
                                </View>
                            );
                        })
                    )}
                </View>
            </Card>

            {/* 페이지네이션 */}
            {!isLoading && list.length > 0 && (
                <View className="py-4">
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
        </ScrollView>
    );
}

export default NoticeListPage;
