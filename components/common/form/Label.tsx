import { Text, TextProps } from "react-native";
import { StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface LabelProps extends TextProps {
    size?: StyleSizeType;
}

function Label({ size = "medium", className, children, ...props }: LabelProps) {
    const LABEL_SIZE_STYLES = {
        small: "text-xs mb-1",
        medium: "text-sm mb-1.5",
        large: "text-base mb-2",
    };

    return (
        <Text
            className={twMerge(
                "font-semibold ml-0.5 text-text-default",
                LABEL_SIZE_STYLES[size],
                className,
            )}
            {...props}>
            {children}
        </Text>
    );
}

export default Label;
