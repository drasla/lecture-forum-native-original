import api from "@/api/axiosInstance";
import { PaginationResponseType } from "@/types/common";
import { Reply, ReplyListItem, CreatedReply } from "@/types/reply";
import { ReplyInputType } from "@/schemas/reply/replySchema";

const getRepliesByPostId = async (
    postId: number,
    page: number = 1,
    size: number = 10,
): Promise<PaginationResponseType<ReplyListItem>> => {
    const response = await api.get(`/reply/${postId}`, {
        params: { page, size },
    });
    return response.data.data;
};

const createReply = async (postId: number, data: ReplyInputType): Promise<CreatedReply> => {
    // 💡 백엔드가 기대하는 req.body 형태 { postId, content }로 조립해서 전송
    const response = await api.post(`/reply/create`, {
        postId,
        content: data.content,
    });
    return response.data.data;
};

const updateReply = async (replyId: number, data: ReplyInputType): Promise<Reply> => {
    // 백엔드는 { content } 만 기대하므로 data를 그대로 전송
    const response = await api.patch(`/reply/${replyId}`, data);
    return response.data.data;
};

const deleteReply = async (replyId: number): Promise<void> => {
    await api.delete(`/reply/${replyId}`);
};

export default {
    getRepliesByPostId,
    createReply,
    updateReply,
    deleteReply,
};
