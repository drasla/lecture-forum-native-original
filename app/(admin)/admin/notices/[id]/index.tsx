import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import adminNoticeApi from "@/api/admin/adminNoticeApi";
import noticeApi from "@/api/user/noticeApi";
import { Notice } from "@/types/notice";

function AdminNoticeDetailPage() {
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

        if (noticeId) fetchNotice().then(() => {});
    }, [noticeId, router]);

    const handleDeleteNotice = async () => {
        const executeDelete = async () => {
            try {
                await adminNoticeApi.deleteNotice(noticeId);

                if (Platform.OS === "web") {
                    window.alert("공지사항이 삭제되었습니다.");
                    router.push("/admin/notices");
                } else {
                    Alert.alert("삭제 완료", "공지사항이 삭제되었습니다.", [
                        { text: "확인", onPress: () => router.push("/admin/notices") },
                    ]);
                }
            } catch (error) {
                console.error(error);
                if (Platform.OS === "web") {
                    window.alert("공지사항 삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "공지사항 삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (window.confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("공지사항 삭제", "정말 이 공지사항을 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    if (isLoading || !notice) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="공지사항 상세" description="등록된 공지사항의 내용을 확인합니다." />

            <ScrollView className="flex-1 bg-background-paper p-6 rounded-xl border border-divider">
                {/* 1. 글 헤더 영역 (제목 & 등록일) */}
                <View className="border-b border-divider pb-4 mb-6">
                    <TextComponent className="text-xl font-bold text-text-default mb-2">
                        {notice.title}
                    </TextComponent>
                    <View className="flex-row items-center justify-between">
                        <TextComponent className="text-sm text-text-secondary">
                            관리자
                        </TextComponent>
                        <TextComponent className="text-sm text-text-secondary">
                            등록일: {notice.createdAt.substring(0, 10)}
                        </TextComponent>
                    </View>
                </View>

                {/* 2. 글 본문 영역 */}
                <View className="min-h-[300px]">
                    <TextComponent className="text-base text-text-default leading-relaxed">
                        {notice.content}
                    </TextComponent>
                </View>

                {/* 3. 하단 버튼 영역 */}
                <View className="flex-row items-center justify-between mt-10 border-t border-divider pt-6">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onPress={() => router.push("/admin/notices")}>
                        목록으로
                    </Button>

                    <View className="flex-row gap-3">
                        <Button variant="outlined" color="error" onPress={handleDeleteNotice}>
                            삭제
                        </Button>
                        <Button
                            variant="contained"
                            color="warning"
                            // 💡 이전 턴에서 만든 수정 폼의 경로를 update로 맞췄다고 가정합니다.
                            onPress={() => router.push(`/admin/notices/${notice.id}/update`)}>
                            수정
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeDetailPage;
