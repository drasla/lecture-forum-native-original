import type { Config } from "tailwindcss";

export default {
    darkMode: "class",
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./constants/**/*.{js,jsx,ts,tsx}",
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: {
                    default: "var(--bg-default)",
                    paper: "var(--bg-paper)",
                },
                text: {
                    default: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                },
                divider: "var(--divider)",
                primary: {
                    main: "var(--primary-main)",
                    contrastText: "var(--primary-contrast)",
                },
                secondary: {
                    main: "var(--secondary-main)",
                    contrastText: "var(--secondary-contrast)",
                },
                success: {
                    main: "var(--success-main)",
                    contrastText: "var(--success-contrast)",
                },
                error: {
                    main: "var(--error-main)",
                    contrastText: "var(--error-contrast)",
                },
                warning: {
                    main: "var(--warning-main)",
                    contrastText: "var(--warning-contrast)",
                },
                info: {
                    main: "var(--info-main)",
                    contrastText: "var(--info-contrast)",
                },
            },
        },
    },
    safelist: [
        "py-3",
        "py-6",
        {
            pattern:
                /(bg|text|border)-(primary|secondary|success|error|warning|info)-(main|contrastText)/,
        },
    ],
    plugins: [],
} satisfies Config;
