import { useState } from "react";
import { View, Alert, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // 💡 아이콘 임포트

import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import postApi from "@/api/user/postApi";
import { PostDetail } from "@/types/post";

interface PostDetailVoteContainerProps {
    post: PostDetail;
    onRefresh: () => void;
}

function PostDetailVoteContainer({ post, onRefresh }: PostDetailVoteContainerProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { vote, option1Text, option2Text, id: postId } = post;

    const handleVote = async (option: number) => {
        try {
            setIsProcessing(true);
            await postApi.votePost(postId, option);
            onRefresh();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "투표 처리 중 오류가 발생했습니다.";
            if (Platform.OS === "web") {
                window.alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelVote = async () => {
        try {
            setIsProcessing(true);
            await postApi.cancelVotePost(postId);
            onRefresh();
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "투표 취소 중 오류가 발생했습니다.";
            if (Platform.OS === "web") {
                window.alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const option1Percent =
        vote.totalCount > 0 ? Math.round((vote.option1Count / vote.totalCount) * 100) : 0;
    const option2Percent =
        vote.totalCount > 0 ? Math.round((vote.option2Count / vote.totalCount) * 100) : 0;

    return (
        <View className="mt-8 pt-6 border-t border-divider">
            {/* 💡 이모지 대신 아이콘 적용 */}
            <View className="flex-row items-center justify-center gap-2 mb-4">
                <Ionicons name="bar-chart-outline" size={20} color="#6b7280" />
                <TextComponent className="text-lg font-bold text-text-default">
                    투표에 참여해보세요
                </TextComponent>
            </View>

            {vote.hasVoted ? (
                <View className="bg-background-paper p-5 rounded-xl border border-divider">
                    <TextComponent className="text-sm text-text-secondary mb-4 text-center">
                        총 {vote.totalCount}명 참여
                    </TextComponent>

                    {/* 옵션 1 결과 */}
                    <View className="mb-4">
                        <View className="flex-row justify-between mb-1.5">
                            <TextComponent className="text-sm font-medium text-text-default">
                                {option1Text}
                            </TextComponent>
                            <TextComponent className="text-sm font-bold text-success-main">
                                {option1Percent}% ({vote.option1Count}명)
                            </TextComponent>
                        </View>
                        <View className="h-3 w-full bg-divider rounded-full overflow-hidden">
                            <View
                                className="h-full bg-success-main rounded-full"
                                style={{ width: `${option1Percent}%` }}
                            />
                        </View>
                    </View>

                    {/* 옵션 2 결과 */}
                    <View className="mb-6">
                        <View className="flex-row justify-between mb-1.5">
                            <TextComponent className="text-sm font-medium text-text-default">
                                {option2Text}
                            </TextComponent>
                            <TextComponent className="text-sm font-bold text-error-main">
                                {option2Percent}% ({vote.option2Count}명)
                            </TextComponent>
                        </View>
                        <View className="h-3 w-full bg-divider rounded-full overflow-hidden">
                            <View
                                className="h-full bg-error-main rounded-full"
                                style={{ width: `${option2Percent}%` }}
                            />
                        </View>
                    </View>

                    <Button
                        variant="outlined"
                        color="secondary"
                        onPress={handleCancelVote}
                        disabled={isProcessing}
                        className="w-full">
                        다시 투표하기
                    </Button>
                </View>
            ) : (
                <View className="flex-col md:flex-row gap-4">
                    <Button
                        variant="outlined"
                        color="success"
                        className="flex-1"
                        onPress={() => handleVote(1)}
                        disabled={isProcessing}>
                        {option1Text}
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        className="flex-1"
                        onPress={() => handleVote(2)}
                        disabled={isProcessing}>
                        {option2Text}
                    </Button>
                </View>
            )}
        </View>
    );
}

export default PostDetailVoteContainer;
