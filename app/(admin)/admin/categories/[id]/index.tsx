import React, { useEffect, useState } from "react";
import { View, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function AdminCategoryUpdatePage() {
    const router = useRouter();

    const { id } = useLocalSearchParams<{ id: string }>();
    const categoryId = Number(id);

    const [isLoading, setIsLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AdminCategoryInputType>({
        resolver: zodResolver(adminCategorySchema),
        defaultValues: {
            name: "",
        },
        mode: "onTouched",
    });

    useEffect(() => {
        if (isNaN(categoryId)) {
            Alert.alert("오류", "잘못된 접근입니다.");
            router.back();
            return;
        }

        const fetchCategory = async () => {
            try {
                const data = await adminCategoryApi.getCategoryById(categoryId);
                reset({ name: data.name });
            } catch (error) {
                console.error(error);
                Alert.alert("오류", "카테고리 정보를 불러오는데 실패했습니다.");
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategory().then(() => {});
    }, [categoryId, reset]);

    const onSubmit = async (data: AdminCategoryInputType) => {
        try {
            await adminCategoryApi.updateCategory(categoryId, data);

            if (Platform.OS === "web") {
                window.alert("카테고리가 성공적으로 수정되었습니다.");
                router.back();
            } else {
                Alert.alert("수정 완료", "카테고리가 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            console.error(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;

                // 409 (중복 이름), 404 (없는 카테고리) 등 예외 처리
                if (error.response.status === 409) {
                    setError("name", { message: errorMessage });
                    return;
                }

                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "수정 중 알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    if (isLoading) {
        return <LoadingIndicator fullScreen={true} />;
    }

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="카테고리 수정" description="기존 게시판 카테고리의 이름을 변경합니다." />

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
                            onSubmitEditing={handleSubmit(onSubmit)}
                        />
                    )}
                />

                {errors.root?.message && (
                    <ErrorMessage size="medium" className="mt-2 mb-4 text-center">
                        {errors.root.message}
                    </ErrorMessage>
                )}

                <View className="flex-row items-center justify-end gap-3 mt-6">
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
                        {isSubmitting ? "수정 중..." : "수정하기"}
                    </Button>
                </View>
            </View>
        </View>
    );
}

export default AdminCategoryUpdatePage;
