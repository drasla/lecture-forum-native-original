import { View, Pressable, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { StyleColorType, StyleSizeType } from "@/types/style";

interface PaginationProps {
    currentPage: number;
    totalPage: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
    size?: StyleSizeType;
    color?: StyleColorType;
    shape?: "square" | "round";
}

function Pagination({
    currentPage,
    totalPage,
    onPageChange,
    maxVisiblePages,
    size = "medium",
    color = "primary",
    shape = "square",
}: PaginationProps) {
    const { width } = useWindowDimensions();

    const isMobile = width < 768;
    const displayPages = maxVisiblePages ?? (isMobile ? 5 : 10);

    if (totalPage <= 1) {
        return null;
    }

    const currentBlock = Math.ceil(currentPage / displayPages);
    const startPage = (currentBlock - 1) * displayPages + 1;
    const endPage = Math.min(startPage + displayPages - 1, totalPage);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // 1. 사이즈 및 여백 설정
    const getSizeClasses = () => {
        switch (size) {
            case "small":
                return "min-w-[32px] h-8 px-1";
            case "large":
                return "min-w-[40px] h-10 px-2";
            case "medium":
            default:
                return "min-w-[36px] h-9 px-1.5";
        }
    };

    // 2. 글자 크기 설정
    const getTextSizeClasses = () => {
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

    // 3. 아이콘 크기 설정
    const getIconSize = () => {
        switch (size) {
            case "small":
                return 16;
            case "large":
                return 22;
            case "medium":
            default:
                return 18;
        }
    };

    // 4. 형태 (Shape) 설정
    const shapeClass = shape === "round" ? "rounded-full" : "rounded-md";

    return (
        <View className="flex-row items-center justify-center gap-1 md:gap-2 mt-8">
            {/* 왼쪽 화살표 */}
            <Pressable
                disabled={currentPage === 1}
                onPress={() => onPageChange(currentPage - 1)}
                className={twMerge(
                    "justify-center items-center border border-divider bg-background-paper transition-all",
                    shapeClass,
                    getSizeClasses(),
                    currentPage === 1
                        ? "opacity-50"
                        : "hover:bg-background-default active:bg-divider",
                )}>
                <Feather name="chevron-left" size={getIconSize()} className="text-text-secondary" />
            </Pressable>

            {/* 페이지 번호들 */}
            {pageNumbers.map(item => {
                const isActive = item === currentPage;
                return (
                    <Pressable
                        key={item}
                        onPress={() => onPageChange(item)}
                        className={twMerge(
                            "justify-center items-center border transition-all",
                            shapeClass,
                            getSizeClasses(),
                            isActive
                                ? `bg-${color}-main border-${color}-main`
                                : "bg-background-paper border-divider hover:bg-background-default active:bg-divider",
                        )}>
                        <TextComponent
                            className={twMerge(
                                "font-bold",
                                getTextSizeClasses(),
                                isActive ? `text-${color}-contrastText` : "text-text-default",
                            )}>
                            {item}
                        </TextComponent>
                    </Pressable>
                );
            })}

            {/* 오른쪽 화살표 */}
            <Pressable
                disabled={currentPage === totalPage}
                onPress={() => onPageChange(currentPage + 1)}
                className={twMerge(
                    "justify-center items-center border border-divider bg-background-paper transition-all",
                    shapeClass,
                    getSizeClasses(),
                    currentPage === totalPage
                        ? "opacity-50"
                        : "hover:bg-background-default active:bg-divider",
                )}>
                <Feather
                    name="chevron-right"
                    size={getIconSize()}
                    className="text-text-secondary"
                />
            </Pressable>
        </View>
    );
}

export default Pagination;
