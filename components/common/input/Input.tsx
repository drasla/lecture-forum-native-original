import { TextInput, TextInputProps } from "react-native";
import { twMerge } from "tailwind-merge";
import { StyleSizeType } from "@/types/style";
import { INPUT_SIZE_STYLES } from "@/constants/style";

interface InputProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

// TextInput 에서는 placeholder의 색상은 별도의 속성으로 전달되어야 함
function Input({
    hasError,
    className,
    size = "medium",
    placeholderClassName,
    ...props
}: InputProps) {
    return (
        <TextInput
            className={twMerge(
                "w-full bg-background-default rounded-lg text-text-default border",
                INPUT_SIZE_STYLES[size],
                hasError ? "border-error-main" : "border-divider focus:border-primary-main",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}
        />
    );
}

export default Input;
