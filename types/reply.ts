import { User } from "@/types/user";

// 기본 Reply 엔티티 타입 (DB 모델과 1:1 매칭)
export interface Reply {
    id: number;
    content: string;
    postId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

// 💡 용도에 따라 포함되는 User 정보가 다르므로 각각 Pick
export type ReplyListUser = Pick<User, "id" | "nickname">;
export type CreatedReplyUser = Pick<User, "id" | "nickname" | "email">;

// 1. 댓글 목록 조회용 타입
export interface ReplyListItem extends Reply {
    user: ReplyListUser;
}

// 2. 댓글 생성 완료 후 반환받는 타입
export interface CreatedReply extends Reply {
    user: CreatedReplyUser;
}