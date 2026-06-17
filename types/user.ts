export const UserGender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
};

export type UserGenderType = (typeof UserGender)[keyof typeof UserGender];

export const UserRole = {
    USER: "USER",
    ADMIN: "ADMIN",
};

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    username: string;
    name: string;
    nickname: string;
    email: string;
    phoneNumber: string | null;
    birthdate: string | null;
    gender: UserGenderType;
    role: UserRoleType;
}
