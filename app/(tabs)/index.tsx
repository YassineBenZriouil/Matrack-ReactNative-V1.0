import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { theme } from "../../constants/theme";

export default function HomeScreen() {
    const [stats, setStats] = useState({
        totalScans: 156,
        foundPlates: 89,
        notFoundPlates: 67,
        todayScans: 12,
    });
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        // TODO: Implement actual data refresh
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const quickActions = [
        {
            title: "Scanner un matricule",
            description: "Utilisez la caméra pour scanner",
            icon: "qr-code",
            color: theme.colors.primary[500],
            onPress: () => router.push("/(tabs)/scan"),
        },
        {
            title: "Saisie manuelle",
            description: "Entrez le numéro manuellement",
            icon: "create",
            color: theme.colors.secondary[500],
            onPress: () => router.push("/(tabs)/scan"),
        },
        {
            title: "Voir l'historique",
            description: "Consultez les recherches récentes",
            icon: "time",
            color: theme.colors.success[500],
            onPress: () => router.push("/(tabs)/history"),
        },
        {
            title: "Paramètres",
            description: "Configurez l'application",
            icon: "settings",
            color: theme.colors.warning[500],
            onPress: () => router.push("/settings"),
        },
    ];

    const recentActivity = [
        {
            id: "1",
            plateNumber: "ABC-123",
            result: "found",
            time: "Il y a 5 min",
            vehicle: "Toyota Corolla",
        },
        {
            id: "2",
            plateNumber: "XYZ-789",
            result: "not_found",
            time: "Il y a 15 min",
            vehicle: null,
        },
        {
            id: "3",
            plateNumber: "DEF-456",
            result: "found",
            time: "Il y a 1 heure",
            vehicle: "Mercedes Sprinter",
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.minimalContainer}>
                <Image
                    source={require("../../assets/images/NoBgLogo.png")}
                    style={styles.headerLogo}
                    resizeMode="contain"
                />
                <Text style={styles.greeting}>Bienvenue sur Mattrak</Text>
                <Button
                    title="Scanner un matricule"
                    onPress={() => router.push("/(tabs)/scan")}
                    style={styles.mainActionButton}
                />
                <Button
                    title="Saisie manuelle"
                    onPress={() =>
                        router.push({
                            pathname: "/(tabs)/scan",
                            params: { manual: "true" },
                        })
                    }
                    style={styles.secondaryButton}
                    variant="outline"
                />
                <Button
                    title="Voir l'historique"
                    onPress={() => router.push("/(tabs)/history")}
                    style={styles.secondaryButton}
                    variant="outline"
                />
                <View style={styles.staticInfoRow}>
                    <View style={styles.staticInfoCard}>
                        <Ionicons
                            name="shield-checkmark"
                            size={28}
                            color={theme.colors.primary[500]}
                        />
                        <Text style={styles.staticInfoText}>
                            Application sécurisée
                        </Text>
                    </View>
                    <View style={styles.staticInfoCard}>
                        <Ionicons
                            name="time"
                            size={28}
                            color={theme.colors.success[500]}
                        />
                        <Text style={styles.staticInfoText}>Support 24/7</Text>
                    </View>
                    <View style={styles.staticInfoCard}>
                        <Ionicons
                            name="information-circle"
                            size={28}
                            color={theme.colors.primary[500]}
                        />
                        <Text style={styles.staticInfoText}>Version 3.1</Text>
                    </View>
                </View>
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
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.lg,
    },

    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
    },

    headerLogo: {
        width: 200,
        height: 200,
    },

    greeting: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold as any,
        color: theme.colors.text.primary,
    },

    subtitle: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.xs,
    },

    notificationButton: {
        position: "relative",
        padding: theme.spacing.sm,
    },

    notificationBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.error[500],
    },

    statsContainer: {
        flexDirection: "row",
        paddingHorizontal: theme.spacing.lg,
        gap: theme.spacing.sm,
    },

    statCard: {
        flex: 1,
    },

    statContent: {
        alignItems: "center",
    },

    statNumber: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold as any,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.xs,
    },

    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        textAlign: "center",
        marginTop: theme.spacing.xs,
    },

    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },

    actionsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: theme.spacing.md,
    },

    actionItem: {
        width: "48%",
        alignItems: "center",
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.secondary,
    },

    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.sm,
    },

    actionTitle: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.semibold as any,
        color: theme.colors.text.primary,
        textAlign: "center",
        marginBottom: theme.spacing.xs,
    },

    actionDescription: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.secondary,
        textAlign: "center",
    },

    activityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.md,
    },

    viewAllText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.primary[500],
        fontWeight: theme.typography.fontWeight.medium as any,
    },

    activityItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    activityIcon: {
        marginRight: theme.spacing.sm,
    },

    activityContent: {
        flex: 1,
    },

    activityPlate: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium as any,
        color: theme.colors.text.primary,
    },

    activityVehicle: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.xs,
    },

    activityTime: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.tertiary,
        marginTop: theme.spacing.xs,
    },

    activityBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },

    activityBadgeText: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.medium as any,
    },

    quickScanContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },

    quickScanButton: {
        marginTop: theme.spacing.lg,
    },
    minimalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background.primary,
    },
    mainActionButton: {
        marginTop: theme.spacing.xl,
        width: 220,
    },
    secondaryButton: {
        marginTop: theme.spacing.lg,
        width: 220,
    },
    staticInfoRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: theme.spacing.xl,
        gap: theme.spacing.lg,
    },
    staticInfoCard: {
        alignItems: "center",
        padding: theme.spacing.md,
        backgroundColor: theme.colors.background.secondary || "#f2f5f5",
        borderRadius: theme.borderRadius.md,
        minWidth: 90,
    },
    staticInfoText: {
        marginTop: theme.spacing.sm,
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        textAlign: "center",
    },
});
