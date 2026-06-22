import React, { useState } from "react";
import { Text, Modal, FlatList, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { INPUT_SIZE_STYLES } from "@/constants/style";
import { StyleSizeType } from "@/types/style";
import { Ionicons } from "@expo/vector-icons";

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SelectProps {
    options: SelectOption[];
    value?: string | number;
    onSelect: (value: string | number) => void;
    placeholder?: string;
    hasError?: boolean;
    size?: StyleSizeType;
    className?: string;
}

function Select({
    options,
    value,
    onSelect,
    placeholder = "선택해주세요",
    hasError,
    size = "medium",
    className,
}: SelectProps) {
    const [isModalVisible, setModalVisible] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (selectedValue: string | number) => {
        onSelect(selectedValue);
        setModalVisible(false);
    };

    return (
        <>
            <Pressable
                onPress={() => {
                    setModalVisible(true);
                }}
                className={twMerge(
                    "w-full flex-row justify-between items-center bg-background-default rounded-lg border",
                    INPUT_SIZE_STYLES[size],
                    hasError ? "border-error-main" : "border-divider",
                    className,
                )}>
                <Text
                    className={twMerge(
                        "text-[15px]",
                        selectedOption ? "text-text-default" : "text-text-secondary",
                    )}>
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={16}
                    color="#9CA3AF" // text-text-secondary 색상에 맞춤
                />
            </Pressable>

            {isModalVisible && (
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}>
                    <Pressable
                        className="flex-1 justify-center items-center px-5"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                        onPress={() => setModalVisible(false)}>
                        <Pressable
                            className="w-full max-w-sm bg-background-paper rounded-xl overflow-hidden max-h-[60%]"
                            onPress={() => {}}>
                            <FlatList
                                data={options}
                                keyExtractor={item => String(item.value)}
                                renderItem={({ item }) => (
                                    <Pressable
                                        onPress={() => handleSelect(item.value)}
                                        className={twMerge(
                                            "px-5 py-4 border-b border-divider flex-row justify-between",
                                            item.value === value && "bg-primary-main/10",
                                        )}>
                                        <Text
                                            className={twMerge(
                                                "text-base",
                                                item.value === value
                                                    ? "text-primary-main font-bold"
                                                    : "text-text-default",
                                            )}>
                                            {item.label}
                                        </Text>
                                        {item.value === value && (
                                            <Ionicons
                                                name="checkmark"
                                                size={20}
                                                className="text-primary-main"
                                            />
                                        )}
                                    </Pressable>
                                )}
                            />
                        </Pressable>
                    </Pressable>
                </Modal>
            )}
        </>
    );
}

export default Select;
