// /constants/style.ts

export const BUTTON_SIZE_STYLES = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-2 text-sm",
    large: "px-5 py-3 text-base",
};

export const BUTTON_VARIANT_STYLES = {
    contained: "bg-primary-main", // 기본값, 컬러별로 동적 교체 가능
    outlined: "border border-primary-main bg-transparent",
    text: "bg-transparent",
    icon: "rounded-full p-2",
};

export const INPUT_BASE_STYLES =
    "w-full px-4 py-3 bg-background-default rounded-lg text-[15px] text-text-default border";

export const INPUT_SIZE_STYLES = {
    small: "px-3 py-1.5 text-xs",
    medium: "px-4 py-3 text-sm",
    large: "px-5 py-4 text-base",
};

export const ERROR_STYLES = "border-error-main";
export const FOCUS_STYLES = "border-primary-main";
