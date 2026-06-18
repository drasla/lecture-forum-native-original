import axiosInstance from "@/api/axiosInstance";
import { RegisterUserInputType } from "@/schemas/user/registerUserSchema";
import { User } from "@/types/user";
import { LoginInputType } from "@/schemas/user/loginSchema";

const login = async (data: LoginInputType): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post("/user/login", data);
    return response.data.data;
};

const createUser = async (data: Omit<RegisterUserInputType, "passwordConfirm">): Promise<User> => {
    const response = await axiosInstance.post("/user/create", data);
    return response.data;
};

export default {
    login,
    createUser,
};
