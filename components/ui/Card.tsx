import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { theme } from "../../constants/theme";

export interface CardProps {
    children: React.ReactNode;
    variant?: "default" | "elevated" | "outlined" | "flat";
    padding?: "none" | "sm" | "md" | "lg";
    margin?: "none" | "sm" | "md" | "lg";
    style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = "default",
    padding = "md",
    margin = "none",
    style,
}) => {
    const getPaddingStyle = () => {
        switch (padding) {
            case "none":
                return styles.paddingNone;
            case "sm":
                return styles.paddingSm;
            case "md":
                return styles.paddingMd;
            case "lg":
                return styles.paddingLg;
            default:
                return styles.paddingMd;
        }
    };

    const getMarginStyle = () => {
        switch (margin) {
            case "none":
                return styles.marginNone;
            case "sm":
                return styles.marginSm;
            case "md":
                return styles.marginMd;
            case "lg":
                return styles.marginLg;
            default:
                return styles.marginNone;
        }
    };

    const cardStyle = [
        styles.base,
        styles[variant],
        getPaddingStyle(),
        getMarginStyle(),
        style,
    ];

    return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
    base: {
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
    },

    // Variants
    default: {
        ...theme.shadows.sm,
    },

    elevated: {
        ...theme.shadows.lg,
    },

    outlined: {
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    flat: {
        backgroundColor: theme.colors.background.secondary,
    },

    // Padding variants
    paddingNone: {
        padding: 0,
    },

    paddingSm: {
        padding: theme.spacing.sm,
    },

    paddingMd: {
        padding: theme.spacing.md,
    },

    paddingLg: {
        padding: theme.spacing.lg,
    },

    // Margin variants
    marginNone: {
        margin: 0,
    },

    marginSm: {
        margin: theme.spacing.sm,
    },

    marginMd: {
        margin: theme.spacing.md,
    },

    marginLg: {
        margin: theme.spacing.lg,
    },
});
