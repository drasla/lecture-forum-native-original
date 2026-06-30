import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import postApi from "@/api/user/postApi";
import { PostListItem } from "@/types/post";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import Pagination from "@/components/common/pagination/Pagination";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function PostListPage() {
    const router = useRouter();
    // 💡 동적 라우팅 파라미터에서 categoryId를 가져옵니다.
    const { id, page, size } = useLocalSearchParams<{
        id: string;
        page: string;
        size: string;
    }>();

    const categoryId = Number(id);
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 20; // 백엔드 기본값인 20과 동기화

    const [list, setList] = useState<PostListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const loadPosts = async (catId: number, targetPage: number, targetSize: number) => {
        try {
            setIsLoading(true);
            const result = await postApi.getPostsByCategory(catId, targetPage, targetSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                window.alert("게시글 목록을 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "게시글 목록을 불러오는데 실패했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isNaN(categoryId)) {
            loadPosts(categoryId, currentPage, pageSize).then(() => {});
        }
    }, [categoryId, currentPage, pageSize]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    // 잘못된 카테고리 ID 접근 방어 로직
    if (isNaN(categoryId)) {
        return (
            <View className="flex-1 items-center justify-center bg-background-default">
                <TextComponent className="text-error-main mb-4">
                    올바르지 않은 카테고리 접근입니다.
                </TextComponent>
                <Button variant="contained" color="primary" onPress={() => router.back()}>
                    뒤로 가기
                </Button>
            </View>
        );
    }

    return (
        // 💡 최상단 ScrollView로 전체 스크롤을 유도하고, 내부 패딩만 가볍게 지정
        <ScrollView
            className="flex-1 w-full bg-background-default"
            showsVerticalScrollIndicator={false}>
            {/* 상단 헤더 및 글쓰기 버튼 영역 */}
            <Title
                title="토론 게시판"
                description="다양한 주제에 대해 의견을 나누고 투표에 참여해보세요.">
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onPress={() => router.push(`/posts/create?categoryId=${categoryId}`)}>
                    글쓰기
                </Button>
            </Title>

            {/* 💡 레이아웃단에서 정렬을 잡았으므로 mx, my, max-w 클래스를 완전히 배제한 Card 구조 */}
            <Card className="p-0 overflow-hidden flex-col">
                {/* 테이블 헤더 (💡 모바일에서는 아예 숨김 처리) */}
                <View
                    className={twMerge(
                        ["hidden md:flex"], // md 이상에서만 노출
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-b", "border-divider", "bg-background-default"],
                    )}>
                    <TextComponent className="w-16 font-bold text-text-secondary text-center">
                        번호
                    </TextComponent>
                    <TextComponent className="flex-1 font-bold text-text-secondary px-2">
                        제목
                    </TextComponent>
                    <TextComponent className="w-28 font-bold text-text-secondary text-center">
                        작성자
                    </TextComponent>
                    <TextComponent className="w-20 font-bold text-text-secondary text-center">
                        조회수
                    </TextComponent>
                    <TextComponent className="w-24 font-bold text-text-secondary text-center">
                        등록일
                    </TextComponent>
                </View>

                {/* 테이블 바디 */}
                <View>
                    {isLoading ? (
                        <View className="py-20">
                            <LoadingIndicator />
                        </View>
                    ) : list.length === 0 ? (
                        <View className="py-20 justify-center items-center">
                            <TextComponent className="text-text-secondary">
                                등록된 토론 게시글이 없습니다. 첫 번째 주인공이 되어보세요!
                            </TextComponent>
                        </View>
                    ) : (
                        list.map((item, index) => {
                            const isLast = index === list.length - 1;

                            return (
                                <View
                                    key={item.id}
                                    className={twMerge(
                                        // 💡 모바일은 세로(col), PC는 가로(row) 배치
                                        "flex-col md:flex-row md:items-center",
                                        "px-4 py-3 md:py-4",
                                        "transition-colors hover:bg-background-default",
                                        !isLast && "border-b border-divider",
                                    )}>
                                    {/* 1. 게시글 번호 (PC에서만 노출) */}
                                    <TextComponent className="hidden md:flex w-16 text-center text-text-secondary">
                                        {item.id}
                                    </TextComponent>

                                    {/* 2. 게시글 제목 */}
                                    <Pressable
                                        className="flex-1 md:px-2 justify-center mb-1.5 md:mb-0"
                                        onPress={() => router.push(`/posts/${item.id}`)}>
                                        <View className="flex-row items-center gap-2">
                                            <TextComponent
                                                className="text-base font-medium hover:text-primary-main transition-colors"
                                                numberOfLines={1}>
                                                {item.title}
                                            </TextComponent>
                                            {/* VOTE 뱃지 */}
                                            {item.option1Text && item.option2Text && (
                                                <View className="bg-primary-main/10 px-1.5 py-0.5 rounded">
                                                    <TextComponent className="text-[10px] font-bold text-primary-main">
                                                        VOTE
                                                    </TextComponent>
                                                </View>
                                            )}
                                        </View>
                                    </Pressable>

                                    {/* 3. 메타 정보 (모바일: 작게 한 줄로 / PC: 각각 고정된 너비로 분리) */}
                                    <View className="flex-row items-center gap-2 md:gap-0">
                                        {/* 작성자 */}
                                        <TextComponent
                                            className="text-xs md:text-sm text-text-secondary md:text-text-default md:w-28 md:text-center"
                                            numberOfLines={1}>
                                            {item.user?.nickname}
                                        </TextComponent>

                                        {/* 모바일 구분자 */}
                                        <TextComponent className="md:hidden text-xs text-divider">
                                            |
                                        </TextComponent>

                                        {/* 조회수 */}
                                        <TextComponent className="text-xs md:text-sm text-text-secondary md:w-20 md:text-center">
                                            {/* 모바일에선 '조회 12' 처럼 표시, PC에선 숫자만 표시 */}
                                            <TextComponent className="md:hidden text-xs text-text-secondary">
                                                조회{" "}
                                            </TextComponent>
                                            {item.views}
                                        </TextComponent>

                                        {/* 모바일 구분자 */}
                                        <TextComponent className="md:hidden text-xs text-divider">
                                            |
                                        </TextComponent>

                                        {/* 등록일 */}
                                        <TextComponent className="text-xs md:text-sm text-text-secondary md:w-24 md:text-center">
                                            {item.createdAt.substring(0, 10)}
                                        </TextComponent>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>
            </Card>

            {/* 페이지네이션 영역 */}
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
                        size="medium"
                        color="primary"
                        shape="square"
                    />
                </View>
            )}
        </ScrollView>
    );
}

export default PostListPage;
