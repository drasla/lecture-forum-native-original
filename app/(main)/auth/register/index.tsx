import React from "react";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView, KeyboardAvoidingView, Platform, Text, Alert } from "react-native";
import { registerUserSchema, RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import Card from "@/components/common/card/Card";
import Button from "@/components/common/button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import SelectGroup from "@/components/common/select/SelectGroup";
import { isAxiosError } from "axios";
import userApi from "@/api/user/userApi";

export default function AuthRegisterScreen() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<RegisterUserInputType>({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            username: "",
            password: "",
            passwordConfirm: "",
            name: "",
            nickname: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
            gender: undefined,
        },
        mode: "onTouched",
    });

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            const { passwordConfirm, ...submitData } = data;

            const payload = {
                ...submitData,
                phoneNumber: submitData.phoneNumber === "" ? undefined : submitData.phoneNumber,
                birthdate: submitData.birthdate === "" ? undefined : submitData.birthdate,
            };

            await userApi.createUser(payload);

            if (Platform.OS === "web") {
                // 웹: 표준 브라우저 경고창 띄운 후 바로 이동
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.replace("/auth/login");
            } else {
                // 앱: 네이티브 팝업 띄우고, 확인 버튼을 눌렀을 때 이동
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요.", [
                    {
                        text: "확인",
                        onPress: () => router.replace("/auth/login"),
                    },
                ]);
            }
        } catch (error) {
            console.log(error);

            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };

    // 모바일을 중점으로 하는 React-Native에서는 가상 키보드가 입력창을 가리는 현상을 방지하기 위해
    // KeyboardAvoidingView와 ScrollView 배치가 필수임

    // 웹에서는 input 태그가 존재하여 거기에 register만 등록하면 되었으나
    // 모바일에서는 동작 방식이 다르기 때문에,
    // react-hook-form이 제공하는 Controller 컴포넌트를 사용하여 기능들을 자식에 입히는 방식으로 적용

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-default">
            <ScrollView
                contentContainerClassName="p-5 justify-center items-center"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}>
                <Card className="w-full max-w-[450px] my-8">
                    <Text className="text-2xl font-bold text-text-default text-center mb-6">
                        회원가입
                    </Text>

                    {/* 아이디 */}
                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="아이디"
                                placeholder="4자 이상 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.username?.message}
                            />
                        )}
                    />

                    {/* 비밀번호 */}
                    {/* 비밀번호 마스킹 처리 */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="비밀번호"
                                placeholder="6자 이상 입력해주세요"
                                secureTextEntry
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    {/* 비밀번호 확인 */}
                    <Controller
                        control={control}
                        name="passwordConfirm"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="비밀번호 확인"
                                placeholder="비밀번호를 다시 입력해주세요"
                                secureTextEntry
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.passwordConfirm?.message}
                            />
                        )}
                    />

                    {/* 이름 */}
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="이름"
                                placeholder="이름을 입력해주세요"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    {/* 닉네임 */}
                    <Controller
                        control={control}
                        name="nickname"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="닉네임"
                                placeholder="2자 이상 10자 이하"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.nickname?.message}
                            />
                        )}
                    />

                    {/* 출력되는 가상 키보드 종류 설정 */}
                    {/* 영문 입력 시 첫 자가 자동으로 대문자 되는 기능 해제 */}

                    {/* 이메일 */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="이메일"
                                placeholder="example@email.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    {/* 전화번호 (선택) */}
                    <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="전화번호 (선택)"
                                placeholder="010-0000-0000"
                                keyboardType="phone-pad"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.phoneNumber?.message}
                            />
                        )}
                    />

                    {/* 생년월일 (선택) */}
                    <Controller
                        control={control}
                        name="birthdate"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="생년월일 (선택)"
                                placeholder="YYYYMMDD"
                                keyboardType="number-pad"
                                maxLength={8}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.birthdate?.message}
                            />
                        )}
                    />

                    {/* 성별 (필수 enum 타입 대응) */}
                    <Controller
                        control={control}
                        name="gender"
                        render={({ field: { onChange, value } }) => (
                            <SelectGroup
                                label="성별"
                                placeholder="성별을 선택해주세요"
                                options={[
                                    { label: "남성", value: "MALE" },
                                    { label: "여성", value: "FEMALE" },
                                ]}
                                value={value}
                                onSelect={onChange}
                                errorMessage={errors.gender?.message}
                            />
                        )}
                    />

                    {errors.root?.message && (
                        <Text className="text-error-main text-sm text-center font-medium mt-2 mb-4">
                            {errors.root.message}
                        </Text>
                    )}

                    <Button
                        color="primary"
                        variant="contained"
                        size="large"
                        fullWidth
                        className="mt-4"
                        onPress={handleSubmit(onSubmit)}>
                        회원가입 완료
                    </Button>

                    <Button
                        color="secondary"
                        variant="text"
                        size="medium"
                        fullWidth
                        className="mt-2"
                        onPress={() => router.back()}>
                        뒤로 가기
                    </Button>
                </Card>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
