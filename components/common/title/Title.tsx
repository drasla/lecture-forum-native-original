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
                "flex-row items-center justify-between w-full mb-6 pb-4 border-b border-divider",
                className,
            )}>
            <View className="flex-1">
                <TextComponent className="text-2xl font-extrabold text-text-default">
                    {title}
                </TextComponent>
                {description && (
                    <TextComponent className="text-sm text-text-secondary mt-1">
                        {description}
                    </TextComponent>
                )}
            </View>

            {children && <View className="ml-4">{children}</View>}
        </View>
    );
}

export default Title;
