import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeType = "light" | "dark";

type ThemeState = {
    theme: ThemeType;
    onChangeTheme: VoidFunction;
};

export const useThemeStore = create<ThemeState>()(
    persist(
        set => ({
            theme: "light",
            onChangeTheme: () =>
                set(state => ({ theme: state.theme === "light" ? "dark" : "light" })),
        }),
        {
            name: "theme-storage",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
