import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../components/ui/Card";
import { theme } from "../constants/theme";
import { db } from "../firebaseConfig";

export default function CarDetailsScreen() {
    const params = useLocalSearchParams();
    // Extract known fields
    const plate = params.plate as string | undefined;
    const status = params.status as string | undefined;
    const registeredAt = params.registeredAt as string | undefined;
    const notes = params.notes as string | undefined;
    const owner = params.owner as string | undefined;
    const vehicleType = params.vehicleType as string | undefined;

    // Vehicle data from Firestore
    const [vehicle, setVehicle] = useState<any>(null);
    const [vehicleLoading, setVehicleLoading] = useState(false);

    useEffect(() => {
        const fetchVehicle = async () => {
            if (!plate) return;
            setVehicleLoading(true);
            try {
                const q = query(
                    collection(db, "vehicles"),
                    where("plate", "==", plate)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const vehicleData = querySnapshot.docs[0].data();
                    setVehicle(vehicleData);
                } else {
                    setVehicle(null);
                }
            } catch (e) {
                setVehicle(null);
            } finally {
                setVehicleLoading(false);
            }
        };
        fetchVehicle();
    }, [plate]);

    // Format date for both vehicle and params
    function formatRegisteredAt(raw: any): string {
        if (!raw) return "Non disponible";
        let dateObj = null;
        if (typeof raw === "string") {
            // Try ISO string
            dateObj = new Date(raw);
        } else if (raw instanceof Date) {
            dateObj = raw;
        } else if (raw.seconds) {
            // Firestore Timestamp
            dateObj = new Date(raw.seconds * 1000);
        } else {
            // Try to parse as number (timestamp in ms)
            try {
                dateObj = new Date(Number(raw));
            } catch {
                return "Non disponible";
            }
        }
        if (!dateObj || isNaN(dateObj.getTime())) return "Non disponible";
        return `${dateObj.toLocaleDateString(
            "fr-FR"
        )} à ${dateObj.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Card
                    variant="elevated"
                    padding="lg"
                    margin="md"
                    style={styles.card}
                >
                    {/* Vehicle Section */}
                    <View style={styles.sectionHeaderRow}>
                        <Ionicons
                            name="car-sport"
                            size={28}
                            color={theme.colors.primary[500]}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={styles.sectionHeader}>Véhicule</Text>
                    </View>
                    {vehicleLoading ? (
                        <Text style={styles.detailValue}>Chargement...</Text>
                    ) : vehicle ? (
                        <>
                            <View style={styles.keyInfoRow}>
                                <Text style={styles.plate}>
                                    {vehicle.plate || "Non disponible"}
                                </Text>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        {
                                            backgroundColor:
                                                (vehicle.status || status) ===
                                                "authorized"
                                                    ? theme.colors.success[100]
                                                    : theme.colors.error[100],
                                        },
                                    ]}
                                >
                                    <Ionicons
                                        name={
                                            (vehicle.status || status) ===
                                            "authorized"
                                                ? "checkmark-circle"
                                                : "close-circle"
                                        }
                                        size={18}
                                        color={
                                            (vehicle.status || status) ===
                                            "authorized"
                                                ? theme.colors.success[600]
                                                : theme.colors.error[600]
                                        }
                                        style={{ marginRight: 4 }}
                                    />
                                    <Text
                                        style={[
                                            styles.statusText,
                                            {
                                                color:
                                                    (vehicle.status ||
                                                        status) === "authorized"
                                                        ? theme.colors
                                                              .success[600]
                                                        : theme.colors
                                                              .error[600],
                                            },
                                        ]}
                                    >
                                        {(vehicle.status || status) ===
                                        "authorized"
                                            ? "Trouvé"
                                            : "Non trouvé"}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailKey}>Type:</Text>
                                <Text style={styles.detailValue}>
                                    {vehicle.vehicleType || "Non disponible"}
                                </Text>
                            </View>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailKey}>
                                    Propriétaire:
                                </Text>
                                <Text style={styles.detailValue}>
                                    {vehicle.owner || "Non disponible"}
                                </Text>
                            </View>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailKey}>Marque:</Text>
                                <Text style={styles.detailValue}>
                                    {vehicle.brand || "Non disponible"}
                                </Text>
                            </View>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailKey}>Modèle:</Text>
                                <Text style={styles.detailValue}>
                                    {vehicle.model || "Non disponible"}
                                </Text>
                            </View>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailKey}>Année:</Text>
                                <Text style={styles.detailValue}>
                                    {vehicle.year || "Non disponible"}
                                </Text>
                            </View>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailKey}>Couleur:</Text>
                                <Text style={styles.detailValue}>
                                    {vehicle.color || "Non disponible"}
                                </Text>
                            </View>
                            <View style={styles.detailLine}>
                                <Text style={styles.detailKey}>
                                    Date d'ajout:
                                </Text>
                                <Text style={styles.detailValue}>
                                    {formatRegisteredAt(vehicle.registeredAt)}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.detailValue}>
                            Aucune donnée véhicule trouvée.
                        </Text>
                    )}

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* History Section */}
                    <View style={styles.sectionHeaderRow}>
                        <Ionicons
                            name="time"
                            size={24}
                            color={theme.colors.primary[400]}
                            style={{ marginRight: 8 }}
                        />
                        <Text style={styles.sectionHeader}>Historique</Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.detailKey}>Date de recherche:</Text>
                        <Text style={styles.detailValue}>
                            {vehicle
                                ? formatRegisteredAt(vehicle.registeredAt)
                                : formatRegisteredAt(registeredAt)}
                        </Text>
                    </View>
                    <View style={styles.detailLine}>
                        <Text style={styles.detailKey}>Notes:</Text>
                        <Text style={styles.detailValue}>
                            {vehicle
                                ? vehicle.notes || "Non disponible"
                                : notes || "Non disponible"}
                        </Text>
                    </View>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    scrollContainer: {
        paddingBottom: theme.spacing.xl,
    },
    card: {
        marginTop: theme.spacing.lg,
        borderRadius: 18,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
        marginTop: theme.spacing.md,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "700",
        color: theme.colors.primary[700],
        letterSpacing: 0.5,
    },
    keyInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing.md,
    },
    plate: {
        fontSize: 28,
        fontWeight: "700",
        color: theme.colors.primary[600],
        letterSpacing: 2,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    statusText: {
        fontSize: 16,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.light,
        marginVertical: theme.spacing.lg,
        borderRadius: 2,
    },
    detailLine: {
        flexDirection: "row",
        marginBottom: theme.spacing.sm,
        alignItems: "center",
    },
    detailKey: {
        fontWeight: "600",
        color: theme.colors.text.primary,
        marginRight: theme.spacing.sm,
        minWidth: 110,
    },
    detailValue: {
        color: theme.colors.text.secondary,
        fontSize: theme.typography.fontSize.base,
        flexShrink: 1,
    },
});
