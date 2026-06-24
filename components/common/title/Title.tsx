import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { PropsWithChildren } from "react";

interface TitleProps extends PropsWithChildren {
    title: string;
    description?: string;
    className?: string;
}

function Title({ title, description, className, children }: TitleProps) {
    return (
        <View
            className={twMerge(
                // 기본(모바일)은 flex-col로 세로 배치, md 이상은 flex-row로 가로 배치
                "flex-col md:flex-row md:items-center justify-between w-full mb-6 pb-4 border-b border-divider gap-4 md:gap-0",
                className,
            )}>
            <View className="w-full md:flex-1">
                <TextComponent className="text-2xl font-extrabold text-text-default">
                    {title}
                </TextComponent>
                {description && (
                    <TextComponent className="text-sm text-text-secondary mt-1">
                        {description}
                    </TextComponent>
                )}
            </View>

            {/* children 영역: 모바일에서는 너비를 100% 차지하고 우측 정렬, PC에서는 내용물 크기만큼만 차지 */}
            {children && (
                <View className="w-full md:w-auto flex-row justify-end md:ml-4">{children}</View>
            )}
        </View>
    );
}

export default Title;
