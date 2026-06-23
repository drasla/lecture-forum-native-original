import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

interface LoadingIndicatorProps extends ActivityIndicatorProps {
    fullScreen?: boolean;
    className?: string;
}

function LoadingIndicator({
    fullScreen = false,
    size = "large",
    color = "#3B82F6", // 💡 기본값을 primary 컬러의 Hex로 지정 (디자인 시스템에 맞춰 수정 가능)
    className,
    ...props
}: LoadingIndicatorProps) {
    // 1. 전체 화면을 덮는 로딩일 경우 (flex-1 사용)
    if (fullScreen) {
        return (
            <View
                className={twMerge(
                    "flex-1 w-full justify-center items-center bg-background-default",
                    className,
                )}>
                <ActivityIndicator size={size} color={color} {...props} />
            </View>
        );
    }

    // 2. 리스트나 특정 영역 내부의 로딩일 경우 (상하 여백만 줌)
    return (
        <View className={twMerge("py-10 justify-center items-center", className)}>
            <ActivityIndicator size={size} color={color} {...props} />
        </View>
    );
}

export default LoadingIndicator;
