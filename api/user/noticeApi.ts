import { Notice } from "@/types/notice";
import api from "@/api/axiosInstance";
import { PaginationResponseType } from "@/types/common";

const getNoticeList = async (
    page: number = 1,
    size: number = 20,
): Promise<PaginationResponseType<Notice>> => {
    const response = await api.get(`/notice/list`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getNoticeById = async (noticeId: number): Promise<Notice> => {
    const response = await api.get(`/notice/${noticeId}`);
    return response.data.data;
};

export default {
    getNoticeList,
    getNoticeById,
}