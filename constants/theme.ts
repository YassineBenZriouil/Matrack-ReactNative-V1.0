import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const colors = {
    // Primary colors
    primary: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
    },

    // Secondary colors
    secondary: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
    },

    // Success colors
    success: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d",
    },

    // Warning colors
    warning: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f",
    },

    // Error colors
    error: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
    },

    // Neutral colors
    neutral: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
    },

    // Background colors
    background: {
        primary: "#ffffff",
        secondary: "#f8fafc",
        tertiary: "#f1f5f9",
        dark: "#0f172a",
    },

    // Text colors
    text: {
        primary: "#0f172a",
        secondary: "#475569",
        tertiary: "#64748b",
        inverse: "#ffffff",
        disabled: "#94a3b8",
    },

    // Border colors
    border: {
        light: "#e2e8f0",
        medium: "#cbd5e1",
        dark: "#94a3b8",
    },

    // Status colors
    status: {
        active: "#22c55e",
        expired: "#f59e0b",
        suspended: "#ef4444",
        stolen: "#dc2626",
    },
};

export const typography = {
    fontFamily: {
        regular: "System",
        medium: "System",
        semibold: "System",
        bold: "System",
    },

    fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        "2xl": 24,
        "3xl": 30,
        "4xl": 36,
        "5xl": 48,
    },

    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },

    fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
    },
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
    "3xl": 64,
    "4xl": 96,
};

export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    full: 9999,
};

export const shadows = {
    sm: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    xl: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
};

export const layout = {
    screen: {
        width,
        height,
    },

    header: {
        height: 60,
    },

    tabBar: {
        height: 80,
    },

    button: {
        height: 48,
        borderRadius: borderRadius.md,
    },

    input: {
        height: 48,
        borderRadius: borderRadius.md,
    },

    card: {
        borderRadius: borderRadius.lg,
        padding: spacing.md,
    },
};

export const animation = {
    duration: {
        fast: 200,
        normal: 300,
        slow: 500,
    },

    easing: {
        ease: "ease",
        easeIn: "ease-in",
        easeOut: "ease-out",
        easeInOut: "ease-in-out",
    },
};

export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    layout,
    animation,
};

export default theme;
