export type ApiResponse<T> = {
    message: string;
    data: T;
};

export type PaginationResponseType<T> = {
    page: number;
    size: number;
    total: number;
    list: T[];
};

export type MenuType = {
    path: string;
    label: string;
    icon?: string;
    isDanger?: boolean;
}