import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui/Button";
import { theme } from "../constants/theme";

export default function SettingsScreen() {
    const handleClearData = () => {
        Alert.alert(
            "Effacer les données",
            "Êtes-vous sûr de vouloir effacer toutes les données locales ? Cette action est irréversible.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Effacer",
                    style: "destructive",
                    onPress: () => {
                        // TODO: Implement data clearing
                        Alert.alert(
                            "Succès",
                            "Toutes les données ont été effacées."
                        );
                    },
                },
            ]
        );
    };

    const handleExportData = () => {
        // TODO: Implement data export
        Alert.alert("Export", "Fonctionnalité d'export à implémenter.");
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.text.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Paramètres</Text>
                <View style={styles.headerSpacer} />
            </View>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button
                    title="Déconnecter"
                    onPress={() => {
                        // TODO: Implement logout logic
                        router.replace("/auth/login");
                    }}
                    variant="danger"
                    leftIcon={
                        <Ionicons
                            name="log-out"
                            size={20}
                            color={theme.colors.text.inverse}
                        />
                    }
                    style={{ marginTop: 16, width: 200 }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },

    scrollView: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },

    backButton: {
        padding: theme.spacing.sm,
    },

    headerTitle: {
        flex: 1,
        fontSize: theme.typography.fontSize.xl,
        fontWeight: 700, // was theme.typography.fontWeight.bold
        color: theme.colors.text.primary,
        textAlign: "center",
    },

    headerSpacer: {
        width: 40,
    },

    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: 600, // was theme.typography.fontWeight.semibold
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },

    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    settingInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        flex: 1,
    },

    settingLabel: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
        fontWeight: 500, // was theme.typography.fontWeight.medium
    },

    optionButtons: {
        flexDirection: "row",
        gap: theme.spacing.xs,
    },

    optionButton: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
    },

    optionButtonActive: {
        backgroundColor: theme.colors.primary[500],
        borderColor: theme.colors.primary[500],
    },

    optionButtonText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.primary,
        fontWeight: 500, // was theme.typography.fontWeight.medium
    },

    optionButtonTextActive: {
        color: theme.colors.text.inverse,
    },

    dataButton: {
        marginBottom: theme.spacing.sm,
    },

    aboutItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    aboutLabel: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
        fontWeight: 500, // was theme.typography.fontWeight.medium
    },

    aboutValue: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.secondary,
    },
});
