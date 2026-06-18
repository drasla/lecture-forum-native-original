import React from "react";
import { useRouter, Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import Card from "@/components/common/card/Card";
import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import { isAxiosError } from "axios";
import useAuthStore from "@/stores/auth/useAuthStore";
import { LoginInputType, loginSchema } from "@/schemas/user/loginSchema";
import userApi from "@/api/user/userApi";

export default function AuthLoginScreen() {
    const router = useRouter();

    const { login } = useAuthStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginInputType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
        mode: "onTouched",
    });

    const onSubmit = async (data: LoginInputType) => {
        try {
            const result = await userApi.login(data);

            if (result.token && result.user) {
                login(result.user, result.token);
            }

            router.replace("/");
        } catch (error) {
            console.log(error);

            let errorMessage = "로그인 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                // 401(비밀번호 틀림), 404(없는 아이디) 등의 에러 메시지를 백엔드에서 받아옵니다.
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-default">
            {/* flex-grow를 사용해야 콘텐츠가 적을 때도 세로 중앙 정렬이 잘 먹힙니다. */}
            <ScrollView
                contentContainerClassName="flex-grow justify-center items-center p-5"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <Card className="w-full max-w-[450px]">
                    <Text className="text-2xl font-bold text-text-default text-center mb-6">
                        로그인
                    </Text>

                    {/* 아이디 입력 */}
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="아이디"
                                placeholder="아이디를 입력해주세요"
                                autoCapitalize="none"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.username?.message}
                            />
                        )}
                    />

                    {/* 비밀번호 입력 */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="비밀번호"
                                placeholder="비밀번호를 입력해주세요"
                                secureTextEntry
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    {/* 루트 에러(API 통신 실패 등) 출력 영역 */}
                    {errors.root?.message && (
                        <Text className="text-error-main text-sm text-center font-medium mt-2 mb-4">
                            {errors.root.message}
                        </Text>
                    )}

                    {/* 로그인 버튼 */}
                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        className={errors.root?.message ? "" : "mt-4"}
                        onPress={handleSubmit(onSubmit)}>
                        로그인
                    </Button>

                    {/* 하단 회원가입 링크 영역 */}
                    <View className="flex-row justify-center items-center mt-6 gap-2">
                        <Text className="text-text-secondary">계정이 없으신가요?</Text>
                        <Link href="/auth/register" asChild>
                            {/* Link asChild를 사용할 때 Text를 감싸주면 네비게이션이 자연스럽게 작동합니다. */}
                            <Text className="text-primary-main font-bold py-2">회원가입</Text>
                        </Link>
                    </View>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
