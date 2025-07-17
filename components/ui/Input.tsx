import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { theme } from "../../constants/theme";

export interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?:
        | "default"
        | "email-address"
        | "numeric"
        | "phone-pad"
        | "number-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
    error?: string;
    disabled?: boolean;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    autoCorrect = false,
    multiline = false,
    numberOfLines = 1,
    maxLength,
    error,
    disabled = false,
    leftIcon,
    rightIcon,
    onRightIconPress,
    style,
    inputStyle,
    containerStyle,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRightIconPress = () => {
        if (secureTextEntry) {
            setShowPassword(!showPassword);
        } else if (onRightIconPress) {
            onRightIconPress();
        }
    };

    const inputContainerStyle = [
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error,
        disabled && styles.disabled,
        style,
    ];

    const textInputStyle = [
        styles.input,
        multiline && styles.multiline,
        inputStyle,
    ];

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={inputContainerStyle}>
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={20}
                        color={theme.colors.text.tertiary}
                        style={styles.leftIcon}
                    />
                )}

                <TextInput
                    style={textInputStyle}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.text.tertiary}
                    secureTextEntry={secureTextEntry && !showPassword}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={autoCorrect}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    maxLength={maxLength}
                    editable={!disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {(rightIcon || secureTextEntry) && (
                    <TouchableOpacity
                        onPress={handleRightIconPress}
                        style={styles.rightIconContainer}
                        disabled={disabled}
                    >
                        <Ionicons
                            name={
                                secureTextEntry
                                    ? showPassword
                                        ? "eye-off"
                                        : "eye"
                                    : rightIcon!
                            }
                            size={20}
                            color={theme.colors.text.tertiary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },

    label: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.background.primary,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        minHeight: theme.layout.input.height,
        ...theme.shadows.sm,
    },

    input: {
        flex: 1,
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
        fontFamily: theme.typography.fontFamily.regular,
    },

    multiline: {
        textAlignVertical: "top",
        paddingVertical: theme.spacing.sm,
    },

    leftIcon: {
        marginRight: theme.spacing.sm,
    },

    rightIconContainer: {
        marginLeft: theme.spacing.sm,
        padding: theme.spacing.xs,
    },

    focused: {
        borderColor: theme.colors.primary[500],
        ...theme.shadows.md,
    },

    error: {
        borderColor: theme.colors.error[500],
    },

    disabled: {
        backgroundColor: theme.colors.background.tertiary,
        opacity: 0.6,
    },

    errorText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.error[500],
        marginTop: theme.spacing.xs,
    },
});
