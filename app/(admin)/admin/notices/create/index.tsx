import React from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import adminNoticeApi from "@/api/admin/adminNoticeApi";
import { AdminNoticeInputType, adminNoticeSchema } from "@/schemas/notice/adminNoticeSchema";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";

function AdminNoticeCreatePage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminNoticeInputType>({
        resolver: zodResolver(adminNoticeSchema),
        defaultValues: {
            title: "",
            content: "",
        },
        mode: "onTouched",
    });

    const onSubmit = async (data: AdminNoticeInputType) => {
        try {
            await adminNoticeApi.createNotice(data);

            if (Platform.OS === "web") {
                window.alert("공지사항이 성공적으로 등록되었습니다.");
                router.back();
            } else {
                Alert.alert("등록 완료", "공지사항이 성공적으로 등록되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            console.error(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                setError("root", {
                    message: errorMessage || "공지사항 등록 중 서버 오류가 발생했습니다.",
                });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="공지사항 등록" description="서비스에 새로운 공지사항을 등록합니다." />

            <ScrollView className="flex-1 bg-background-paper p-6 rounded-xl border border-divider">
                <View className="pb-10">
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

                    {/* 💡 내용 입력 (다중 행) */}
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
                                // 내용을 길게 쓸 수 있도록 최소 높이를 넉넉하게 보장
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
                            {isSubmitting ? "등록 중..." : "공지 등록"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeCreatePage;
