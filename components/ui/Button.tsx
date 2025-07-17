import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";
import { theme } from "../../constants/theme";

export interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = "primary",

    size = "md",
    disabled = false,
    loading = false,
    fullWidth = false,
    style,
    textStyle,
    leftIcon,
    rightIcon,
}) => {
    const buttonStyle = [
        styles.base,
        styles[variant] as ViewStyle,
        styles[size] as ViewStyle,
        fullWidth ? styles.fullWidth : undefined,
        disabled ? styles.disabled : undefined,
        style,
    ].filter(Boolean) as ViewStyle[];

    const textStyleComposed = [
        styles.text,
        styles[`${variant}Text`] as TextStyle,
        styles[`${size}Text`] as TextStyle,
        disabled ? styles.disabledText : undefined,
        textStyle,
    ].filter(Boolean) as TextStyle[];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={
                        variant === "primary"
                            ? theme.colors.text.inverse
                            : theme.colors.primary[500]
                    }
                />
            ) : (
                <>
                    {leftIcon && <>{leftIcon}</>}
                    <Text style={textStyleComposed}>{title}</Text>
                    {rightIcon && <>{rightIcon}</>}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: theme.borderRadius.md,
    },

    // ✅ Variants (shadows only for solid buttons)
    primary: {
        backgroundColor: theme.colors.primary[500],
        ...theme.shadows.sm,
    },
    secondary: {
        backgroundColor: theme.colors.secondary[100],
        ...theme.shadows.sm,
    },
    outline: {
        backgroundColor: "transparent", // ✅ FIXED: no white background
        borderWidth: 1,
        borderColor: theme.colors.primary[500],
        shadowOpacity: 0, // ✅ remove shadow
        elevation: 0,
    },
    ghost: {
        backgroundColor: "transparent",
        shadowOpacity: 0, // ✅ remove shadow
        borderWidth: 1,

        elevation: 0,
    },
    danger: {
        backgroundColor: theme.colors.error[500],
        ...theme.shadows.sm,
    },

    // ✅ Sizes
    sm: {
        height: 36,
        paddingHorizontal: theme.spacing.md,
    },
    md: {
        height: 48,
        paddingHorizontal: theme.spacing.lg,
    },
    lg: {
        height: 56,
        paddingHorizontal: theme.spacing.xl,
    },

    // ✅ States
    disabled: {
        opacity: 0.5,
    },
    fullWidth: {
        width: "100%",
    },

    // ✅ Text styles
    text: {
        fontFamily: theme.typography.fontFamily.medium,
        fontWeight: "500",
        textAlign: "center",
    },
    primaryText: {
        color: theme.colors.text.inverse,
    },
    secondaryText: {
        color: theme.colors.text.primary,
    },
    outlineText: {
        color: theme.colors.primary[500],
    },
    ghostText: {
        color: theme.colors.primary[500],
    },
    dangerText: {
        color: theme.colors.text.inverse,
    },

    smText: {
        fontSize: theme.typography.fontSize.sm,
    },
    mdText: {
        fontSize: theme.typography.fontSize.base,
    },
    lgText: {
        fontSize: theme.typography.fontSize.lg,
    },

    disabledText: {
        color: theme.colors.text.disabled,
    },
});
