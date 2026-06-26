import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

import adminNoticeApi from "@/api/admin/adminNoticeApi";
import noticeApi from "@/api/user/noticeApi";
import { AdminNoticeInputType, adminNoticeSchema } from "@/schemas/notice/adminNoticeSchema";

function AdminNoticeUpdatePage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const noticeId = Number(id);

    const [isFetching, setIsFetching] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AdminNoticeInputType>({
        resolver: zodResolver(adminNoticeSchema),
        defaultValues: {
            title: "",
            content: "",
        },
        mode: "onTouched",
    });

    // 1. 렌더링 시 기존 공지사항 정보를 불러와 폼에 채워넣습니다.
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const noticeData = await noticeApi.getNoticeById(noticeId);

                reset({
                    title: noticeData.title,
                    content: noticeData.content,
                });
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
                setIsFetching(false);
            }
        };

        if (noticeId) fetchNotice();
    }, [noticeId, reset, router]);

    // 2. 수정 폼 전송
    const onSubmit = async (data: AdminNoticeInputType) => {
        try {
            await adminNoticeApi.updateNotice(noticeId, data);

            if (Platform.OS === "web") {
                window.alert("공지사항이 성공적으로 수정되었습니다.");
                router.back(); // 성공 시 상세 페이지로 복귀
            } else {
                Alert.alert("수정 완료", "공지사항이 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            console.error(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                setError("root", {
                    message: errorMessage || "공지사항 수정 중 서버 오류가 발생했습니다.",
                });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    if (isFetching) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="공지사항 수정" description="기존에 등록된 공지사항을 수정합니다." />

            <ScrollView className="flex-1 bg-background-paper p-6 rounded-xl border border-divider">
                {/* 제목 입력 */}
                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputGroup
                            label="제목"
                            placeholder="공지사항 제목을 입력해주세요"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.title?.message}
                        />
                    )}
                />

                {/* 내용 입력 */}
                <Controller
                    control={control}
                    name="content"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextareaGroup
                            label="내용"
                            placeholder="공지사항의 상세 내용을 입력해주세요. 여러 줄 입력이 가능합니다."
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.content?.message}
                            style={{ minHeight: 200 }}
                        />
                    )}
                />

                {/* 최상위 에러 출력 */}
                {errors.root?.message && (
                    <ErrorMessage size="medium" className="mt-2 text-center">
                        {errors.root.message}
                    </ErrorMessage>
                )}

                {/* 하단 버튼 영역 */}
                <View className="flex-row items-center justify-end gap-3 mt-10">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onPress={() => router.back()}
                        disabled={isSubmitting}>
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "수정 중..." : "공지 수정"}
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeUpdatePage;
