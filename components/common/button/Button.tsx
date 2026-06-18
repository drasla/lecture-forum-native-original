import { Pressable, Text, PressableProps } from "react-native";
import { twMerge } from "tailwind-merge";
import { BUTTON_SIZE_STYLES } from "@/constants/style";
import { StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";

interface Props extends PressableProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    fullWidth?: boolean;
}

function Button({
    children,
    color = "primary",
    variant = "contained",
    size = "medium",
    fullWidth = false,
    className,
    ...props
}: Props) {
    const getVariantClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${color}-main`;
            case "outlined":
                return `border border-${color}-main bg-transparent`;
            case "text":
                return "bg-transparent";
            case "icon":
                return "rounded-full p-2";
            default:
                return "";
        }
    };

    const getTextColorClasses = () => {
        if (variant === "contained") return `text-${color}-contrastText`;
        return `text-${color}-main`;
    };

    return (
        <Pressable
            className={twMerge(
                "flex justify-center items-center rounded-md font-bold",
                BUTTON_SIZE_STYLES[size],
                getVariantClasses(),
                fullWidth ? "w-full" : "w-auto",
                className,
            )}
            {...props}>
            {typeof children === "string" ? (
                <Text
                    className={twMerge(
                        "font-bold text-sm",
                        getTextColorClasses(),
                        size === "small" ? "text-xs" : size === "large" ? "text-base" : "text-sm",
                    )}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Pressable>
    );
}

export default Button;
