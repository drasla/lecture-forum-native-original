import { View, Text } from "react-native";
import Input from "../input/Input";
import type { TextInputProps } from "react-native";
import type { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { StyleSizeType } from "@/types/style";

interface Props extends TextInputProps {
    label?: string;
    errorMessage?: string;
    registerObj?: UseFormRegisterReturn;
    wrap?: boolean;
    size?: StyleSizeType;
}

function InputGroup({
    label,
    id,
    errorMessage,
    registerObj,
    wrap,
    className,
    size = "medium",
    ...props
}: Props) {
    return (
        <View className={twMerge("w-full mb-4", wrap && "flex-1", className)}>
            {label && (
                <Text className="text-sm font-semibold text-text-default mb-1.5 ml-0.5">
                    {label}
                </Text>
            )}

            <Input id={id} hasError={!!errorMessage} size={size} {...registerObj} {...props} />

            {errorMessage && (
                <Text className="text-xs text-error-main mt-1 ml-0.5">{errorMessage}</Text>
            )}
        </View>
    );
}

export default InputGroup;
