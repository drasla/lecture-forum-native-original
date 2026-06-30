import { useState } from "react";
import { View, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import PostDetailReplyList from "./PostDetailReplyList";
import replyApi from "@/api/user/replyApi";
import { replySchema, ReplyInputType } from "@/schemas/reply/replySchema";

interface PostDetailReplyContainerProps {
    postId: number;
}

function PostDetailReplyContainer({ postId }: PostDetailReplyContainerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 💡 댓글 목록 갱신을 위한 트리거 상태
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // 💡 react-hook-form 설정
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReplyInputType>({
        resolver: zodResolver(replySchema),
        defaultValues: {
            content: "",
        },
    });

    const onSubmit = async (data: ReplyInputType) => {
        try {
            setIsSubmitting(true);

            // 💡 실제 API 연동
            await replyApi.createReply(postId, data);
            reset(); // 폼 초기화 (내용 비우기)
            setRefreshTrigger(prev => prev + 1); // 댓글 리스트 갱신 트리거 발동
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                window.alert("댓글 등록에 실패했습니다.");
            } else {
                Alert.alert("오류", "댓글 등록에 실패했습니다.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="mt-10 pt-6 border-t border-divider">
            <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#1f2937" />
                <TextComponent className="text-lg font-bold text-text-default">댓글</TextComponent>
            </View>

            {/* 댓글 입력 폼 */}
            <View className="mb-8">
                <Controller
                    control={control}
                    name="content"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextareaGroup
                            placeholder="타인을 존중하는 바른 말을 사용해주세요."
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            errorMessage={errors.content?.message}
                        />
                    )}
                />

                <View className="flex-row justify-end mt-3">
                    <Button
                        variant="contained"
                        color="primary"
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "댓글 등록"}
                    </Button>
                </View>
            </View>

            <PostDetailReplyList postId={postId} refreshTrigger={refreshTrigger} />
        </View>
    );
}

export default PostDetailReplyContainer;
