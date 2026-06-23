import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import {
    adminCategorySchema,
    AdminCategoryInputType,
} from "@/schemas/category/adminCategorySchema";
import adminCategoryApi from "@/api/admin/adminCategoryApi";
import Title from "@/components/common/title/Title";

function AdminCategoryCreatePage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminCategoryInputType>({
        resolver: zodResolver(adminCategorySchema),
        defaultValues: {
            name: "",
        },
        mode: "onTouched",
    });

    const onSubmit = async (data: AdminCategoryInputType) => {
        try {
            await adminCategoryApi.createCategory(data);
            router.push("/admin/categories");
        } catch (error) {
            console.error(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;

                if (error.response.status === 409) {
                    setError("name", { message: errorMessage });
                    return;
                }

                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "카테고리 생성 중 알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="카테고리 생성" description="새로운 게시판 카테고리를 추가합니다." />

            {/* 폼 입력 영역 (Card 형태의 하얀 박스로 감싸서 깔끔하게 배치) */}
            <View className="bg-background-paper p-6 rounded-xl border border-divider">
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputGroup
                            label="카테고리명"
                            placeholder="카테고리 이름을 입력해주세요 (최대 50자)"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.name?.message}
                            // 엔터키를 눌렀을 때 바로 제출되도록 설정
                            onSubmitEditing={handleSubmit(onSubmit)}
                        />
                    )}
                />

                {/* API 통신 에러 등 최상위 에러 출력 */}
                {errors.root?.message && (
                    <ErrorMessage size="medium" className="mt-2 mb-4 text-center">
                        {errors.root.message}
                    </ErrorMessage>
                )}

                {/* 버튼 영역 */}
                <View className="flex-row items-center justify-end gap-3 mt-6">
                    <Button
                        variant="outlined"
                        color="secondary"
                        onPress={() => router.back()}
                        disabled={isSubmitting} // 제출 중일 때 버튼 비활성화
                    >
                        취소
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "생성 중..." : "생성하기"}
                    </Button>
                </View>
            </View>
        </View>
    );
}

export default AdminCategoryCreatePage;
