import { MenuType } from "@/types/common";

export const ADMIN_NAV_LIST: MenuType[] = [
    { path: "/admin/categories", label: "카테고리 관리", icon: "grid" },
    { path: "/admin/users", label: "유저 관리", icon: "users" },
    { path: "/admin/notices", label: "공지사항 관리", icon: "bell" },
    { path: "/admin/inquiries", label: "1:1 문의 관리", icon: "message-square" },
    { path: "/", label: "서비스로 돌아가기", icon: "home" },
];

export const MYPAGE_NAV_LIST: MenuType[] = [
    { path: "/my/profile", label: "회원정보 수정" },
    { path: "/my/password", label: "비밀번호 변경" },
    { path: "/my/inquiry", label: "1:1 문의 내역" },
    { path: "/my/withdraw", label: "회원 탈퇴", isDanger: true },
];
