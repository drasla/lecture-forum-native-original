import { View } from "react-native";
import type { ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";

function Card({ className, children, ...props }: ViewProps) {
    return (
        <View
            className={twMerge(
                "bg-background-paper border border-divider rounded-xl shadow-sm p-8",
                className,
            )}
            {...props}>
            {children}
        </View>
    );
}

export default Card;
