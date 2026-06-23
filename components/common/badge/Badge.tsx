import { View, Text, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import { StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";

interface BadgeProps extends ViewProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
}

function Badge({
    color = "primary",
    variant = "outlined",
    size = "medium",
    className,
    children,
    ...props
}: BadgeProps) {
    const getContainerClasses = () => {
        switch (variant) {
            case "contained":
                return `bg-${color}-main border border-${color}-main`;
            case "outlined":
                return `bg-transparent border border-${color}-main`;
            case "text":
                return "bg-transparent border border-transparent";
            default:
                return "";
        }
    };

    const getTextColorClasses = () => {
        if (variant === "contained") return `text-${color}-contrastText`;
        return `text-${color}-main`;
    };

    const getSizeClasses = () => {
        switch (size) {
            case "small":
                return "px-2 py-0.5";
            case "large":
                return "px-3 py-1.5";
            case "medium":
            default:
                return "px-2.5 py-1";
        }
    };

    const getTextSizeClasses = () => {
        switch (size) {
            case "small":
                return "text-[10px]";
            case "large":
                return "text-sm";
            case "medium":
            default:
                return "text-xs";
        }
    };

    return (
        <View
            className={twMerge(
                "rounded-full items-center justify-center self-center flex-row",
                getSizeClasses(),
                getContainerClasses(),
                className,
            )}
            {...props}>
            {typeof children === "string" ? (
                <Text className={twMerge("font-bold", getTextSizeClasses(), getTextColorClasses())}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </View>
    );
}

export default Badge;
