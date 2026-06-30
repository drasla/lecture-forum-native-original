import React, { useState } from "react";
import { View, ScrollView, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import postApi from "@/api/user/postApi";
import { postSchema, PostInputType } from "@/schemas/post/postSchema";

function PostCreatePage() {
    const router = useRouter();
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
    const parsedCategoryId = Number(categoryId);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PostInputType>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            categoryId: parsedCategoryId,
            title: "",
            content: "",
            option1Text: "",
            option2Text: "",
        },
    });

    const onSubmit = async (data: PostInputType) => {
        try {
            setIsSubmitting(true);
            const newPost = await postApi.createPost(data);

            if (Platform.OS === "web") {
                window.alert("게시글이 성공적으로 등록되었습니다.");
            } else {
                Alert.alert("성공", "게시글이 성공적으로 등록되었습니다.");
            }

            router.replace(`/posts/${newPost.id}`);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                window.alert("게시글 작성에 실패했습니다.");
            } else {
                Alert.alert("오류", "게시글 작성에 실패했습니다.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isNaN(parsedCategoryId)) {
        return (
            <View className="flex-1 items-center justify-center bg-background-default">
                <TextComponent className="text-error-main mb-4 font-medium">
                    잘못된 접근입니다. (카테고리 정보 없음)
                </TextComponent>
                <Button variant="contained" color="primary" onPress={() => router.back()}>
                    뒤로 가기
                </Button>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 w-full bg-background-default"
            showsVerticalScrollIndicator={false}>
            <Title
                title="게시글 작성"
                description="새로운 토론 주제를 등록하고 사람들의 의견을 들어보세요."
            />

            <Card className="p-6 md:p-8 flex-col mb-10">
                {/* 1. 제목 입력 (InputGroup 사용) */}
                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputGroup
                            label="제목"
                            required={true}
                            placeholder="제목을 입력해주세요 (최대 255자)"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.title?.message}
                        />
                    )}
                />

                {/* 2. 본문 입력 (TextareaGroup 사용) */}
                    <Controller
                        control={control}
                        name="content"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextareaGroup
                                label="내용"
                                placeholder="토론하고 싶은 내용을 자유롭게 작성해주세요."
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorMessage={errors.content?.message}
                                className="mb-8"
                            />
                        )}
                    />

                {/* 3. 투표 옵션 설정 (선택사항) */}
                <View className="mb-8 p-5 bg-red-50 rounded-xl border border-red-400 border-dashed">
                    <TextComponent className="text-base font-bold text-text-default mb-1">
                        투표 선택지 (선택사항)
                    </TextComponent>
                    <TextComponent className="text-xs text-text-secondary mb-4">
                        투표를 진행하려면 두 개의 선택지를 모두 입력해주세요.
                    </TextComponent>

                    <View className="gap-4 md:flex-row md:gap-6">
                        <View className="flex-1">
                            <Controller
                                control={control}
                                name="option1Text"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        placeholder="선택지 1 (예: 찬성, A)"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        errorMessage={errors.option1Text?.message}
                                    />
                                )}
                            />
                        </View>

                        <View className="flex-1">
                            <Controller
                                control={control}
                                name="option2Text"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        placeholder="선택지 2 (예: 반대, B)"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        errorMessage={errors.option2Text?.message}
                                    />
                                )}
                            />
                        </View>
                    </View>
                </View>

                {/* 4. 등록 / 취소 버튼 */}
                <View className="flex-row items-center justify-end gap-3 pt-6 border-t border-divider">
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
                        {isSubmitting ? "등록 중..." : "등록하기"}
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
}

export default PostCreatePage;
