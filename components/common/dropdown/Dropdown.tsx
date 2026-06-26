import React, { useState, ReactNode } from "react";
import { View, Pressable, Platform } from "react-native";
import { twMerge } from "tailwind-merge";

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode | ((close: () => void) => ReactNode);
    className?: string;
    dropdownClassName?: string;
}

function Dropdown({ trigger, children, className, dropdownClassName }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const close = () => setIsOpen(false);

    return (
        <View className={twMerge("relative z-50", className)}>
            {/* 드롭다운을 여는 버튼 영역 */}
            <Pressable onPress={() => setIsOpen(!isOpen)}>{trigger}</Pressable>

            {isOpen && (
                <>
                    {/* 외부 클릭 감지용 투명 오버레이 */}
                    <Pressable
                        className="z-40"
                        style={
                            Platform.OS === "web"
                                ? { position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }
                                : {
                                      position: "absolute",
                                      top: -1000,
                                      left: -1000,
                                      width: 3000,
                                      height: 3000,
                                  }
                        }
                        onPress={close}
                    />

                    {/* 드롭다운 메뉴 아이템 영역 */}
                    <View
                        className={twMerge(
                            "absolute top-full right-0 mt-2 bg-background-paper border border-divider rounded-lg shadow-md z-50 min-w-[150px] overflow-hidden",
                            dropdownClassName,
                        )}>
                        {/* children이 함수일 경우 close 함수를 넘겨주어 메뉴 클릭 시 닫히게 할 수 있음 */}
                        {typeof children === "function" ? children(close) : children}
                    </View>
                </>
            )}
        </View>
    );
}

export default Dropdown;
