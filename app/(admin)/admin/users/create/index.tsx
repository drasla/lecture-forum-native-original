import { View, ScrollView, Platform, Alert, } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import TextComponent from "@/components/common/text/TextComponent";
import adminUserApi from "@/api/admin/adminUserApi";
import {
    AdminCreateUserInputType,
    adminCreateUserSchema,
} from "@/schemas/user/adminCreateUserSchema";
import { UserGender, UserRole } from "@/types/user";
import SelectGroup from "@/components/common/select/SelectGroup";

function AdminUserCreatePage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminCreateUserInputType>({
        resolver: zodResolver(adminCreateUserSchema),
        defaultValues: {
            username: "",
            password: "",
            name: "",
            nickname: "",
            email: "",
            phoneNumber: "",
            birthdate: "",
            gender: UserGender.MALE, // 기본값
            role: UserRole.USER, // 기본값
        },
        mode: "onTouched",
    });

    const onSubmit = async (data: AdminCreateUserInputType) => {
        try {
            const payload = { ...data };

            // 2. 생년월일이 입력되어 있다면, slice로 쪼개서 하이픈(-)을 붙여줍니다.
            if (payload.birthdate && payload.birthdate.length === 8) {
                const year = payload.birthdate.slice(0, 4);
                const month = payload.birthdate.slice(4, 6);
                const day = payload.birthdate.slice(6, 8);

                payload.birthdate = `${year}-${month}-${day}`; // "1995-12-25" 형태로 변환
            }

            // 3. 가공된 payload를 백엔드로 전송합니다.
            await adminUserApi.createUser(payload);

            if (Platform.OS === "web") {
                window.alert("유저가 성공적으로 생성되었습니다.");
                router.back();
            } else {
                Alert.alert("생성 완료", "유저가 성공적으로 생성되었습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            console.error(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;

                if (error.response.status === 409) {
                    if (errorMessage.includes("아이디")) {
                        setError("username", { message: errorMessage });
                    } else if (errorMessage.includes("이메일")) {
                        setError("email", { message: errorMessage });
                    } else if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
                    } else {
                        setError("root", { message: errorMessage });
                    }
                    return;
                }

                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "유저 생성 중 알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className="flex-1 w-full bg-background-default">
            <Title title="유저 생성" description="새로운 관리자 또는 일반 유저를 등록합니다." />

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
                                label="비밀번호"
                                placeholder="6자 이상 입력해주세요"
                                secureTextEntry // 💡 비밀번호 마스킹 처리
                                value={value}
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
                                autoCapitalize="none" // 이메일 입력 시 첫 글자 대문자 자동변환 방지
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <View className="h-[1px] bg-divider my-6" />

                    {/* 개인 정보 */}
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
                                    wrap // 💡 md:flex-row 일 때 flex-1 적용을 위함 (InputGroup에 정의해두신 속성)
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

                    <View className="flex-col md:flex-row md:gap-8">
                        {/* 성별 선택 */}
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field: { onChange, value } }) => (
                                <SelectGroup
                                    label="성별"
                                    options={[
                                        { label: "남성", value: "MALE" },
                                        { label: "여성", value: "FEMALE" },
                                    ]}
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
                                    options={[
                                        { label: "관리자 (ADMIN)", value: "ADMIN" },
                                        { label: "일반 유저 (USER)", value: "USER" },
                                    ]}
                                    value={value}
                                    onSelect={onChange}
                                    errorMessage={errors.role?.message}
                                    wrap
                                />
                            )}
                        />
                    </View>

                    {/* 최상위 에러 출력 */}
                    {errors.root?.message && (
                        <ErrorMessage size="medium" className="mt-6 text-center">
                            {errors.root.message}
                        </ErrorMessage>
                    )}

                    {/* 버튼 영역 */}
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
                            {isSubmitting ? "생성 중..." : "유저 생성"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminUserCreatePage;
