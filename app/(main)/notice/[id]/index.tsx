import { useEffect, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Card from "@/components/common/card/Card";
import noticeApi from "@/api/user/noticeApi";
import { Notice } from "@/types/notice";

function NoticeDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const noticeId = Number(id);

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const data = await noticeApi.getNoticeById(noticeId);
                setNotice(data);
            } catch (error) {
                console.error(error);
                if (Platform.OS === "web") {
                    window.alert("공지사항 정보를 불러오는데 실패했습니다.");
                    router.back();
                } else {
                    Alert.alert("오류", "공지사항 정보를 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (noticeId) fetchNotice();
    }, [noticeId, router]);

    if (isLoading || !notice) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <ScrollView
            className="flex-1 w-full bg-background-default"
            showsVerticalScrollIndicator={false}>
            <Title title="공지사항" description="서비스의 주요 소식 및 안내 사항입니다." />

            <Card className="p-6 md:p-8 flex-col mb-10">
                {/* 1. 글 헤더 영역 (제목 & 등록일) */}
                <View className="border-b border-divider pb-4 mb-6">
                    <TextComponent className="text-xl md:text-2xl font-bold text-text-default mb-3">
                        {notice.title}
                    </TextComponent>
                    <View className="flex-row items-center justify-between">
                        <TextComponent className="text-sm font-medium text-text-secondary">
                            관리자
                        </TextComponent>
                        <TextComponent className="text-sm text-text-secondary">
                            등록일: {notice.createdAt.substring(0, 10)}
                        </TextComponent>
                    </View>
                </View>

                {/* 2. 글 본문 영역 */}
                {/* 💡 최소 높이를 주어 내용이 짧아도 UI가 너무 찌그러지지 않도록 방어 */}
                <View className="min-h-[300px]">
                    <TextComponent className="text-base text-text-default leading-relaxed">
                        {notice.content}
                    </TextComponent>
                </View>

                {/* 3. 하단 버튼 영역 */}
                <View className="flex-row items-center justify-end mt-10 border-t border-divider pt-6">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onPress={() => router.push("/notice")}>
                        목록으로
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
}

export default NoticeDetailPage;
