import api from "@/api/axiosInstance";
import { Notice } from "@/types/notice";
import { AdminNoticeInputType } from "@/schemas/notice/adminNoticeSchema";

const createNotice = async (input: AdminNoticeInputType): Promise<Notice> => {
    const response = await api.post(`/admin/notice/create`, input);
    return response.data.data;
};

const updateNotice = async (noticeId: number, input: AdminNoticeInputType): Promise<Notice> => {
    const response = await api.patch(`/admin/notice/${noticeId}`, input);
    return response.data.data;
};

const deleteNotice = async (noticeId: number): Promise<void> => {
    await api.delete(`/admin/notice/${noticeId}`);
};

export default {
    createNotice,
    updateNotice,
    deleteNotice,
};
