import { TextInputProps, View } from "react-native";
import { StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";
import Label from "@/components/common/form/Label";
import Input from "@/components/common/input/Input";
import ErrorMessage from "@/components/common/form/ErrorMessage";

interface InputGroupProps extends TextInputProps {
    label?: string;
    errorMessage?: string;
    wrap?: boolean;
    size?: StyleSizeType;
}

function InputGroup({
    label,
    errorMessage,
    wrap,
    className,
    size = "medium",
    ...props
}: InputGroupProps) {
    return (
        <View className={twMerge("w-full mb-4", wrap && "flex-1", className)}>
            {label && <Label size={size}>{label}</Label>}
            <Input hasError={!!errorMessage} size={size} {...props} />
            {errorMessage && <ErrorMessage size={size}>{errorMessage}</ErrorMessage>}
        </View>
    );
}

export default InputGroup;
