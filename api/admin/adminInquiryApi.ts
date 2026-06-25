import api from "@/api/axiosInstance";
import { ApiResponse, PaginationResponseType } from "@/types/common";
import { Inquiry } from "@/types/inquiry";
import { InquiryAnswerInputType } from "@/schemas/inquiry/adminAnswerInquirySchema";

const getInquiryList = async (
    page: number = 1,
    size: number = 20,
): Promise<PaginationResponseType<Inquiry>> => {
    const response = await api.get("/admin/inquiry/list", {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getInquiryById = async (inquiryId: number): Promise<Inquiry> => {
    const response = await api.get(`/admin/inquiry/${inquiryId}`);
    return response.data.data;
};

const answerInquiry = async (
    inquiryId: number,
    input: InquiryAnswerInputType,
): Promise<Inquiry> => {
    const response = await api.patch<ApiResponse<Inquiry>>(`/admin/inquiry/${inquiryId}`, input);
    return response.data.data;
};

const deleteInquiry = async (inquiryId: number): Promise<void> => {
    await api.delete(`/admin/inquiry/${inquiryId}`);
};

export default {
    getInquiryList,
    getInquiryById,
    answerInquiry,
    deleteInquiry,
};
