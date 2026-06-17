import styled, { ThemeProvider } from "styled-components/native";
import { Slot } from "expo-router";
import { darkTheme, lightTheme } from "@/constants/theme";
import { useThemeStore } from "@/stores/theme/useThemeStore";

function RootLayout() {
    const { theme } = useThemeStore();

    return (
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
            <RootContainer>
                <Slot />
            </RootContainer>
        </ThemeProvider>
    );
}

export default RootLayout;

const RootContainer = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background.default};
`;
