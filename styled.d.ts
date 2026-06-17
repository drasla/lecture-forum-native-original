import "styled-components";

declare module "styled-components/native" {
    export interface DefaultTheme {
        colors: {
            background: {
                default: string;
                paper: string;
            };
            text: {
                default: string;
                secondary: string;
            };
            divider: string;
            primary: {
                main: string;
                contrastText: string;
            };
            secondary: {
                main: string;
                contrastText: string;
            };
            success: {
                main: string;
                contrastText: string;
            };
            error: {
                main: string;
                contrastText: string;
            };
            warning: {
                main: string;
                contrastText: string;
            };
            info: {
                main: string;
                contrastText: string;
            };
        };
    }
}
