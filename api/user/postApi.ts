import api from "@/api/axiosInstance";
import { PaginationResponseType } from "@/types/common";
import { Post, PostDetail, PostListItem, RecentPostListItem } from "@/types/post";
import { PostInputType } from "@/schemas/post/postSchema";

const getRecentPosts = async (): Promise<RecentPostListItem[]> => {
    const response = await api.get(`/post/recent/list`);
    return response.data.data;
};

const getPostsByCategory = async (
    categoryId: number,
    page: number = 1,
    size: number = 20,
): Promise<PaginationResponseType<PostListItem>> => {
    const response = await api.get(`/post/list/${categoryId}`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getPostById = async (postId: number): Promise<PostDetail> => {
    const response = await api.get(`/post/${postId}`);
    return response.data.data;
};

const createPost = async (data: PostInputType): Promise<Post> => {
    const response = await api.post(`/post/create`, data);
    return response.data.data;
};

const votePost = async (postId: number, option: number): Promise<void> => {
    await api.post(`/post/${postId}/vote`, { option });
};

const cancelVotePost = async (postId: number): Promise<void> => {
    await api.delete(`/post/${postId}/vote`);
};

export default {
    getRecentPosts,
    getPostsByCategory,
    getPostById,
    createPost,
    votePost,
    cancelVotePost,
};
