import { Category } from "@/types/category";
import axiosInstance from "@/api/axiosInstance";

const getCategoryList = async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/category");
    return response.data.data;
}

export default {
    getCategoryList,
}