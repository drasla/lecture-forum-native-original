import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";

interface AccordionProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    className?: string; // 아코디언 전체를 감싸는 컨테이너 스타일
    headerClassName?: string; // 터치하는 헤더 영역 스타일
    contentClassName?: string; // 펼쳐지는 내용 영역 스타일
}

function Accordion({
    title,
    children,
    defaultExpanded = false,
    className,
    headerClassName,
    contentClassName,
}: AccordionProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <View className={twMerge("w-full overflow-hidden", className)}>
            {/* 헤더 영역 (클릭 시 토글) */}
            <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                className={twMerge(
                    "flex-row items-center justify-between p-4 transition-colors active:bg-divider",
                    // 내용이 펼쳐졌을 때만 헤더와 내용 사이에 구분선 추가
                    isExpanded && "border-b border-divider",
                    headerClassName,
                )}>
                <TextComponent className="text-base font-medium">{title}</TextComponent>
                <Feather
                    name={isExpanded ? "chevron-down" : "chevron-right"}
                    size={20}
                    className="text-text-secondary"
                />
            </Pressable>

            {/* 내용 영역 */}
            {isExpanded && (
                <View
                    className={twMerge(
                        "bg-background-paper py-1 border-b border-divider",
                        contentClassName,
                    )}>
                    {children}
                </View>
            )}
        </View>
    );
}

export default Accordion;
