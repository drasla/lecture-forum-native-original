import React, { useEffect, useState, useCallback } from "react";
import { View, Platform, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Pagination from "@/components/common/pagination/Pagination";
import TextareaGroup from "@/components/common/textarea/TextareaGroup";
import replyApi from "@/api/user/replyApi";
import { ReplyListItem } from "@/types/reply";
import useAuthStore from "@/stores/auth/useAuthStore";

// 💡 단일 댓글 아이템 렌더링 및 수정/삭제 상태 관리를 위한 내부 컴포넌트
function ReplyItem({
    item,
    myUserId,
    onRefresh,
}: {
    item: ReplyListItem;
    myUserId?: number;
    onRefresh: () => void;
}) {
    const isAuthor = item.user.id === myUserId;
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(item.content);
    const [isProcessing, setIsProcessing] = useState(false);

    // 댓글 수정 처리
    const handleUpdate = async () => {
        if (!editContent.trim()) return;
        try {
            setIsProcessing(true);
            await replyApi.updateReply(item.id, { content: editContent });
            setIsEditing(false);
            onRefresh();
        } catch (error) {
            console.error(error);
            if (Platform.OS === "web") window.alert("댓글 수정에 실패했습니다.");
            else Alert.alert("오류", "댓글 수정에 실패했습니다.");
        } finally {
            setIsProcessing(false);
        }
    };

    // 댓글 삭제 처리
    const handleDelete = () => {
        const confirmDelete = async () => {
            try {
                setIsProcessing(true);
                await replyApi.deleteReply(item.id);
                onRefresh();
            } catch (error) {
                console.error(error);
                if (Platform.OS === "web") window.alert("댓글 삭제에 실패했습니다.");
                else Alert.alert("오류", "댓글 삭제에 실패했습니다.");
            } finally {
                setIsProcessing(false);
            }
        };

        if (Platform.OS === "web") {
            if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) confirmDelete();
        } else {
            Alert.alert("댓글 삭제", "정말로 이 댓글을 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: confirmDelete },
            ]);
        }
    };

    return (
        <View className="bg-background-paper p-4 rounded-xl border border-divider flex-col gap-3">
            {/* 상단: 작성자 & 작성일 */}
            <View className="flex-row items-center justify-between">
                <TextComponent className="text-sm font-bold text-text-default">
                    {item.user.nickname}
                </TextComponent>
                <View className="flex-row items-center gap-2">
                    <TextComponent className="text-xs text-text-secondary">
                        {item.createdAt.substring(0, 10)} {item.createdAt.substring(11, 16)}
                    </TextComponent>
                </View>
            </View>

            {/* 본문 영역 (수정 모드 vs 일반 모드) */}
            {isEditing ? (
                <View className="flex-col gap-2 mt-1">
                    <TextareaGroup
                        value={editContent}
                        onChangeText={setEditContent}
                        placeholder="수정할 내용을 입력해주세요."
                    />
                    <View className="flex-row justify-end gap-2">
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onPress={() => {
                                setIsEditing(false);
                                setEditContent(item.content); // 원상복구
                            }}
                            disabled={isProcessing}>
                            취소
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onPress={handleUpdate}
                            disabled={isProcessing || !editContent.trim()}>
                            수정 완료
                        </Button>
                    </View>
                </View>
            ) : (
                <View>
                    <TextComponent className="text-sm text-text-default leading-relaxed">
                        {item.content}
                    </TextComponent>

                    {/* 작성자 전용 제어 버튼 */}
                    {isAuthor && (
                        <View className="flex-row justify-end gap-2 mt-3">
                            <Button
                                variant="text"
                                color="secondary"
                                size="small"
                                onPress={() => setIsEditing(true)}>
                                수정
                            </Button>
                            <Button
                                variant="text"
                                color="error"
                                size="small"
                                onPress={handleDelete}>
                                삭제
                            </Button>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

// ---------------------------------------------------------
// 메인 댓글 리스트 컴포넌트
// ---------------------------------------------------------

interface PostDetailReplyListProps {
    postId: number;
    refreshTrigger: number; // 부모에서 새 댓글 작성 시 값을 올려 목록을 갱신시킴
}

function PostDetailReplyList({ postId, refreshTrigger }: PostDetailReplyListProps) {
    const { user } = useAuthStore();
    const [list, setList] = useState<ReplyListItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // 댓글은 페이지 파라미터를 URL이 아닌 로컬 상태로 관리 (게시글 목록과 충돌 방지)
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchReplies = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await replyApi.getRepliesByPostId(postId, currentPage, pageSize);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [postId, currentPage, pageSize]);

    // 💡 refreshTrigger가 변경되거나 페이지가 바뀔 때마다 리스트 재조회
    useEffect(() => {
        fetchReplies();
    }, [fetchReplies, refreshTrigger]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    if (isLoading && list.length === 0) {
        return <LoadingIndicator />;
    }

    if (list.length === 0) {
        return (
            <View className="py-10 items-center justify-center bg-background-paper rounded-lg border border-divider">
                <Ionicons name="chatbox-outline" size={32} color="#9ca3af" className="mb-2" />
                <TextComponent className="text-text-secondary mt-2">
                    아직 등록된 댓글이 없습니다.
                </TextComponent>
            </View>
        );
    }

    return (
        <View className="flex-col gap-4">
            <View className="flex-row items-center mb-1">
                <TextComponent className="text-sm font-medium text-text-secondary">
                    총 {total}개의 의견
                </TextComponent>
            </View>

            {/* 댓글 리스트 렌더링 */}
            {list.map(reply => (
                <ReplyItem
                    key={reply.id}
                    item={reply}
                    myUserId={user?.id}
                    onRefresh={fetchReplies}
                />
            ))}

            {/* 댓글 페이지네이션 */}
            {totalPage > 1 && (
                <View className="py-4 mt-2">
                    <Pagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onPageChange={page => setCurrentPage(page)}
                        size="small"
                        color="primary"
                        shape="square"
                    />
                </View>
            )}
        </View>
    );
}

export default PostDetailReplyList;
