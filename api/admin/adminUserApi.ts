import { PaginationResponseType } from "@/types/common";
import { User } from "@/types/user";
import axiosInstance from "@/api/axiosInstance";
import { AdminCreateUserInputType } from "@/schemas/user/adminCreateUserSchema";
import { AdminUpdateUserInputType } from "@/schemas/user/adminUpdateUserSchema";

const getUserList = async (
    page: number = 1,
    size: number = 20,
): Promise<PaginationResponseType<User>> => {
    const response = await axiosInstance.get(`/admin/user/list`, {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getUserById = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/admin/user/${id}`);
    return response.data.data;
};

const createUser = async (input: AdminCreateUserInputType): Promise<User> => {
    const response = await axiosInstance.post(`/admin/user/create`, input);
    return response.data.data;
};

const updateUser = async (id: number, input: AdminUpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}`, input);
    return response.data.data;
};

const toggleUser = async (id: number): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}/delete`);
    return response.data.data;
};

export default {
    getUserList,
    getUserById,
    createUser,
    updateUser,
    toggleUser,
};
