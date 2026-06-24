import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import SelectGroup from "@/components/common/select/SelectGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import adminUserApi from "@/api/admin/adminUserApi";
import {
    AdminUpdateUserInputType,
    adminUpdateUserSchema,
} from "@/schemas/user/adminUpdateUserSchema";

const GENDER_OPTIONS = [
    { label: "남성", value: "MALE" },
    { label: "여성", value: "FEMALE" },
];

const ROLE_OPTIONS = [
    { label: "일반 유저 (USER)", value: "USER" },
    { label: "관리자 (ADMIN)", value: "ADMIN" },
];

function AdminUserUpdatePage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const userId = Number(id);

    const [isFetching, setIsFetching] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AdminUpdateUserInputType>({
        resolver: zodResolver(adminUpdateUserSchema),
        defaultValues: {
            username: "",
            password: "",
            name: "",
            nickname: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
            gender: "MALE",
            role: "USER",
        },
        mode: "onTouched",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await adminUserApi.getUserById(userId);

                // 생년월일 포맷팅 (서버: 1995-12-25T... -> 폼: 19951225)
                let formattedBirthdate = "";
                if (userData.birthdate) {
                    // 앞에서 10글자(YYYY-MM-DD)만 자른 뒤, 하이픈(-)을 모두 제거
                    formattedBirthdate = userData.birthdate.substring(0, 10).replace(/-/g, "");
                }

                reset({
                    username: userData.username,
                    password: "", // 💡 비밀번호는 빈 칸으로 둡니다. (빈 칸이면 서버에서 무시함)
                    name: userData.name,
                    nickname: userData.nickname,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber || "",
                    birthdate: formattedBirthdate,
                    gender: userData.gender,
                    role: userData.role,
                });
            } catch (error) {
                console.error(error);
                if (Platform.OS === "web") {
                    window.alert("유저 정보를 불러오는데 실패했습니다.");
                    router.back();
                } else {
                    Alert.alert("오류", "유저 정보를 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setIsFetching(false);
            }
        };

        if (userId) fetchUser().then(() => {});
    }, [userId, reset, router]);

    // 💡 2. 폼 전송 핸들러
    const onSubmit = async (data: AdminUpdateUserInputType) => {
        try {
            const payload = { ...data };

            // 생년월일 포맷팅 (폼: 19951225 -> 서버: 1995-12-25)
            if (payload.birthdate && payload.birthdate.length === 8) {
                const year = payload.birthdate.slice(0, 4);
                const month = payload.birthdate.slice(4, 6);
                const day = payload.birthdate.slice(6, 8);
                payload.birthdate = `${year}-${month}-${day}`;
            }

            // 비밀번호를 입력하지 않았다면 payload에서 아예 제거 (안전망)
            if (!payload.password) {
                delete payload.password;
            }

            await adminUserApi.updateUser(userId, payload);

            if (Platform.OS === "web") {
                window.alert("유저 정보가 성공적으로 수정되었습니다.");
                router.back();
            } else {
                Alert.alert("수정 완료", "유저 정보가 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            console.error(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;

                if (error.response.status === 409) {
                    if (errorMessage.includes("아이디"))
                        setError("username", { message: errorMessage });
                    else if (errorMessage.includes("이메일"))
                        setError("email", { message: errorMessage });
                    else if (errorMessage.includes("닉네임"))
                        setError("nickname", { message: errorMessage });
                    else setError("root", { message: errorMessage });
                    return;
                }

                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "유저 수정 중 알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    if (isFetching) {
        return <LoadingIndicator fullScreen />;
    }

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="유저 수정" description="가입된 유저의 정보를 수정합니다." />

            <ScrollView className="flex-1 bg-background-paper p-6 rounded-xl border border-divider">
                <View className="pb-10">
                    <TextComponent className="text-lg font-bold text-text-default mb-4">
                        계정 정보
                    </TextComponent>

                    <Controller
                        control={control}
                        name="username"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="아이디"
                                placeholder="영문, 숫자 포함 4자 이상"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorMessage={errors.username?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="새 비밀번호 (선택)"
                                placeholder="변경하지 않으려면 비워두세요"
                                secureTextEntry
                                value={value || ""}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                label="이메일"
                                placeholder="example@domain.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <View className="h-[1px] bg-divider my-6" />

                    <TextComponent className="text-lg font-bold text-text-default mb-4">
                        개인 정보
                    </TextComponent>

                    <View className="flex-col md:flex-row md:gap-4">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="이름"
                                    placeholder="실명 입력"
                                    wrap
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorMessage={errors.name?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="nickname"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="닉네임"
                                    placeholder="서비스에서 사용할 닉네임 (2~10자)"
                                    wrap
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorMessage={errors.nickname?.message}
                                />
                            )}
                        />
                    </View>

                    <View className="flex-col md:flex-row md:gap-4 mt-2">
                        <Controller
                            control={control}
                            name="phoneNumber"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="전화번호 (선택)"
                                    placeholder="010-0000-0000"
                                    keyboardType="phone-pad"
                                    wrap
                                    value={value || ""}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorMessage={errors.phoneNumber?.message}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="birthdate"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="생년월일 (선택)"
                                    placeholder="YYYYMMDD (예: 19951225)"
                                    keyboardType="number-pad"
                                    maxLength={8}
                                    wrap
                                    value={value || ""}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    errorMessage={errors.birthdate?.message}
                                />
                            )}
                        />
                    </View>

                    <View className="h-[1px] bg-divider my-6" />

                    <TextComponent className="text-lg font-bold text-text-default mb-4">
                        권한 및 성별
                    </TextComponent>

                    <View className="flex-col md:flex-row md:gap-4">
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field: { onChange, value } }) => (
                                <SelectGroup
                                    label="성별"
                                    options={GENDER_OPTIONS}
                                    value={value}
                                    onSelect={onChange}
                                    errorMessage={errors.gender?.message}
                                    wrap
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="role"
                            render={({ field: { onChange, value } }) => (
                                <SelectGroup
                                    label="권한 설정"
                                    options={ROLE_OPTIONS}
                                    value={value}
                                    onSelect={onChange}
                                    errorMessage={errors.role?.message}
                                    wrap
                                />
                            )}
                        />
                    </View>

                    {errors.root?.message && (
                        <ErrorMessage size="medium" className="mt-2 text-center">
                            {errors.root.message}
                        </ErrorMessage>
                    )}

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
                            {isSubmitting ? "수정 중..." : "정보 수정"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminUserUpdatePage;
