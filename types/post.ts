import { User } from "@/types/user";
import { Category } from "@/types/category";

export interface Post {
    id: number;
    title: string;
    content: string;
    views: number;
    categoryId: number;
    userId: number;
    option1Text: string | null;
    option2Text: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type PostUser = Pick<User, "id" | "nickname" | "email">;
export type PostCategory = Pick<Category, "id" | "name">;

export interface PostListItem extends Post {
    user: PostUser;
}

export interface RecentPostListItem extends Post {
    user: PostUser;
    category: PostCategory;
}

export interface PostVoteInfo {
    option1Count: number;
    option2Count: number;
    totalCount: number;
    hasVoted: boolean;
}

export interface PostDetail extends Post {
    user: PostUser;
    vote: PostVoteInfo;
}