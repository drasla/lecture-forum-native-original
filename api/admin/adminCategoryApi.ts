import { Category } from "@/types/category";
import axiosInstance from "@/api/axiosInstance";
import { AdminCategoryInputType } from "@/schemas/category/adminCategorySchema";

const getCategoryList = async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/admin/category/list");
    return response.data.data;
};

const getCategoryById = async (id: number): Promise<Category> => {
    const response = await axiosInstance.get(`/admin/category/${id}`);
    return response.data.data;
};

const createCategory = async (input: AdminCategoryInputType): Promise<Category> => {
    const response = await axiosInstance.post("/admin/category/create", input);
    return response.data.data;
};

const updateCategory = async (id: number, input: AdminCategoryInputType): Promise<Category> => {
    const response = await axiosInstance.patch(`/admin/category/${id}`, input);
    return response.data.data;
};

const toggleCategoryStatusById = async (id: number): Promise<Category> => {
    const response = await axiosInstance.patch(`/admin/category/${id}/status`);
    return response.data.data;
};

export default {
    getCategoryList,
    getCategoryById,
    createCategory,
    updateCategory,
    toggleCategoryStatusById,
};
