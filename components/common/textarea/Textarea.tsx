import { TextInput, TextInputProps, Platform } from "react-native";
import { twMerge } from "tailwind-merge";
import { StyleSizeType } from "@/types/style";

interface TextareaProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

function Textarea({
    hasError,
    className,
    size = "medium",
    placeholderClassName,
    ...props
}: TextareaProps) {
    // 사이즈별 텍스트 크기 지정 (Input과 달리 고정 높이(h-10 등)를 쓰지 않기 위해 별도 분리)
    const getTextSizeClass = () => {
        switch (size) {
            case "small":
                return "text-xs";
            case "large":
                return "text-base";
            case "medium":
            default:
                return "text-sm";
        }
    };

    return (
        <TextInput
            multiline={true}
            textAlignVertical="top" // 💡 안드로이드에서 텍스트가 위에서부터 시작하도록 필수 설정
            className={twMerge(
                "w-full bg-background-default rounded-lg text-text-default border p-4 min-h-[120px]",
                getTextSizeClass(),
                hasError ? "border-error-main" : "border-divider focus:border-primary-main",
                Platform.OS === "web" && "outline-none", // 웹 환경 포커스 아웃라인 제거
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}
        />
    );
}

export default Textarea;
