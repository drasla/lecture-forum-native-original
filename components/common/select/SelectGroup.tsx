import { View } from "react-native";
import Select, { SelectOption } from "./Select";
import { twMerge } from "tailwind-merge";
import { StyleSizeType } from "@/types/style";
import Label from "@/components/common/form/Label";
import ErrorMessage from "@/components/common/form/ErrorMessage";

interface SelectGroupProps {
    label?: string;
    errorMessage?: string;
    options: SelectOption[];
    value?: string | number;
    onSelect: (value: string | number) => void;
    placeholder?: string;
    wrap?: boolean;
    size?: StyleSizeType;
    className?: string;
}

function SelectGroup({
    label,
    errorMessage,
    options,
    value,
    onSelect,
    placeholder,
    wrap,
    size = "medium",
    className,
}: SelectGroupProps) {
    return (
        <View className={twMerge("w-full mb-4", wrap && "flex-1", className)}>
            {label && <Label size={size}>{label}</Label>}

            <Select
                options={options}
                value={value}
                onSelect={onSelect}
                placeholder={placeholder}
                hasError={!!errorMessage}
                size={size}
            />

            {errorMessage && <ErrorMessage size={size}>{errorMessage}</ErrorMessage>}
        </View>
    );
}

export default SelectGroup;
