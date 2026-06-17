import { View, Text } from "react-native";
import Select, { SelectOption } from "./Select";
import { twMerge } from "tailwind-merge";
import { StyleSizeType } from "@/types/style";

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
            {label && (
                <Text className="text-sm font-semibold text-text-default mb-1.5 ml-0.5">
                    {label}
                </Text>
            )}

            <Select
                options={options}
                value={value}
                onSelect={onSelect}
                placeholder={placeholder}
                hasError={!!errorMessage}
                size={size}
            />

            {errorMessage && (
                <Text className="text-xs text-error-main mt-1 ml-0.5">{errorMessage}</Text>
            )}
        </View>
    );
}

export default SelectGroup;
