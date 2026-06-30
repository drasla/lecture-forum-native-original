import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Card from "@/components/common/card/Card";
import postApi from "@/api/user/postApi";
import { PostDetail } from "@/types/post";

import PostDetailVoteContainer from "./PostDetailVoteContainer";
import PostDetailReplyContainer from "./PostDetailReplyContainer";
import useAuthStore from "@/stores/auth/useAuthStore";

function PostDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const postId = Number(id);
    const { user } = useAuthStore();

    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPostDetail = useCallback(async () => {
        try {
            const data = await postApi.getPostById(postId);
            setPost(data);
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") {
                window.alert("게시글 정보를 불러오는데 실패했습니다.");
                router.back();
            } else {
                Alert.alert("오류", "게시글 정보를 불러오는데 실패했습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [postId, router]);

    useEffect(() => {
        if (!isNaN(postId)) {
            fetchPostDetail().then(() => {});
        }
    }, [postId, fetchPostDetail]);

    // 게시글 삭제 핸들러
    const handleDelete = () => {
        const confirmDelete = async () => {
            try {
                // await postApi.deletePost(postId); // API 연동 시 주석 해제
                if (Platform.OS === "web") {
                    window.alert("게시글이 삭제되었습니다.");
                } else {
                    Alert.alert("성공", "게시글이 삭제되었습니다.");
                }
                router.replace("/posts"); // 목록으로 이동
            } catch (error) {
                console.error(error);
                if (Platform.OS === "web") {
                    window.alert("게시글 삭제에 실패했습니다.");
                } else {
                    Alert.alert("오류", "게시글 삭제에 실패했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
                confirmDelete();
            }
        } else {
            Alert.alert("게시글 삭제", "정말로 이 게시글을 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: confirmDelete },
            ]);
        }
    };

    if (isLoading || !post) {
        return <LoadingIndicator fullScreen />;
    }

    const isAuthor = post.user.id === user?.id;

    return (
        <ScrollView
            className="flex-1 w-full bg-background-default"
            showsVerticalScrollIndicator={false}>
            <Title title="토론 게시판" description="다양한 의견을 나누고 투표에 참여하세요." />

            <Card className="p-6 md:p-8 flex-col mb-10">
                {/* 1. 글 헤더 영역 */}
                <View className="border-b border-divider pb-4 mb-6">
                    <TextComponent className="text-xl md:text-2xl font-bold text-text-default mb-4">
                        {post.title}
                    </TextComponent>

                    <View className="flex-row items-center justify-between flex-wrap gap-2">
                        <View className="flex-row items-center gap-2">
                            <TextComponent className="text-sm font-bold text-text-default">
                                {post.user.nickname}
                            </TextComponent>
                        </View>
                        <View className="flex-row items-center gap-3">
                            <TextComponent className="text-sm text-text-secondary">
                                조회 {post.views}
                            </TextComponent>
                            <TextComponent className="text-sm text-divider">|</TextComponent>
                            <TextComponent className="text-sm text-text-secondary">
                                {post.createdAt.substring(0, 10)}
                            </TextComponent>
                        </View>
                    </View>
                </View>

                {/* 2. 글 본문 영역 */}
                <View className="min-h-[200px]">
                    <TextComponent className="text-base text-text-default leading-relaxed">
                        {post.content}
                    </TextComponent>
                </View>

                {/* 3. 투표 영역 */}
                {post.option1Text && post.option2Text && (
                    <PostDetailVoteContainer post={post} onRefresh={fetchPostDetail} />
                )}

                {/* 5. 목록으로 돌아가기 버튼 */}
                <View className="flex-row items-center justify-end mt-10 gap-3">
                    {isAuthor && (
                        <Button variant="outlined" color="error" onPress={handleDelete}>
                            삭제
                        </Button>
                    )}
                    <Button variant="contained" color="secondary" onPress={() => router.back()}>
                        목록으로
                    </Button>
                </View>

                {/* 4. 댓글 컨테이너 (입력폼 + 리스트) */}
                <PostDetailReplyContainer postId={post.id} />
            </Card>
        </ScrollView>
    );
}

export default PostDetailPage;
