import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { theme } from "../../constants/theme";
import { auth, db } from "../../firebaseConfig";

type HistoryItem = {
    id: string;
    plate: string;
    registeredAt: Date;
    status: string;
};

export default function HistoryScreen() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        try {
            let email = null;
            const user = auth.currentUser;
            if (user && user.email) {
                email = user.email;
            } else {
                // Try AsyncStorage
                email = await AsyncStorage.getItem("userEmail");
            }
            if (!email) {
                router.replace("/auth/login");
                throw new Error("Utilisateur non connecté");
            }
            const q = query(
                collection(db, "history"),
                where("email", "==", email)
            );
            const querySnapshot = await getDocs(q);
            const realHistory = querySnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    plate: data.plate,
                    registeredAt: data.registeredAt
                        ? new Date(data.registeredAt.seconds * 1000)
                        : new Date(),
                    status: data.status,
                };
            });
            setHistory(realHistory);
        } catch (error) {
            Alert.alert("Erreur", "Impossible de charger l'historique.");
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const filteredHistory = history.filter((item: HistoryItem) => {
        if (filter === "all") return true;
        return (
            (item.status === "authorized" && filter === "found") ||
            (item.status !== "authorized" && filter === "not_found")
        );
    });

    const handleItemPress = (item: HistoryItem & { [key: string]: any }) => {
        router.push({
            pathname: "/carDetails",
            params: {
                plate: item.plate,
                status: item.status,
                registeredAt: item.registeredAt.toISOString(),
                notes: item.notes || "",
                owner: item.owner || "",
                vehicleType: item.vehicleType || "",
            },
        });
    };

    const handleClearHistory = async () => {
        Alert.alert(
            "Effacer l'historique",
            "Êtes-vous sûr de vouloir effacer tout l'historique de vos recherches ? Cette action est irréversible.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Effacer",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const user = auth.currentUser;
                            if (!user || !user.email)
                                throw new Error("Utilisateur non connecté");
                            const q = query(
                                collection(db, "history"),
                                where("email", "==", user.email)
                            );
                            const querySnapshot = await getDocs(q);
                            const deletePromises = querySnapshot.docs.map(
                                (docSnap) =>
                                    deleteDoc(doc(db, "history", docSnap.id))
                            );
                            await Promise.all(deletePromises);
                            setHistory([]);
                        } catch (error) {
                            Alert.alert(
                                "Erreur",
                                "Impossible de supprimer l'historique."
                            );
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
        <TouchableOpacity onPress={() => handleItemPress(item)}>
            <Card variant="default" padding="md" margin="sm">
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Ionicons
                            name="car-sport"
                            size={20}
                            color={theme.colors.primary[500]}
                        />
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: 700,
                                color: theme.colors.text.primary,
                            }}
                        >
                            {item.plate}
                        </Text>
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            borderRadius: 999,
                            backgroundColor:
                                item.status === "authorized"
                                    ? theme.colors.success[100]
                                    : theme.colors.error[100],
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                color:
                                    item.status === "authorized"
                                        ? theme.colors.success[600]
                                        : theme.colors.error[600],
                            }}
                        >
                            {item.status === "authorized"
                                ? "Trouvé"
                                : "Non trouvé"}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: theme.colors.text.tertiary,
                        }}
                    >
                        {item.registeredAt.toLocaleDateString("fr-FR")} à{" "}
                        {item.registeredAt.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={theme.colors.text.tertiary}
                    />
                </View>
            </Card>
        </TouchableOpacity>
    );

    const renderEmptyState = () => (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 24,
                paddingVertical: 32,
            }}
        >
            <Ionicons
                name="time"
                size={64}
                color={theme.colors.text.tertiary}
            />
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                    marginTop: 24,
                    marginBottom: 8,
                }}
            >
                Aucun historique
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    color: theme.colors.text.secondary,
                    textAlign: "center",
                    lineHeight: 22,
                    marginBottom: 32,
                }}
            >
                Vous n'avez pas encore effectué de recherches.
            </Text>
            <Button
                title="Commencer à scanner"
                onPress={() => router.push("/(tabs)/scan")}
                style={{ marginTop: 24 }}
            />
        </View>
    );

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: theme.colors.background.primary,
            }}
        >
            {/* Header */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 24,
                    paddingVertical: 16,
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: theme.colors.text.primary,
                    }}
                >
                    Historique
                </Text>
                {history.length > 0 && (
                    <TouchableOpacity
                        style={{ padding: 8 }}
                        onPress={handleClearHistory}
                    >
                        <Ionicons
                            name="trash"
                            size={20}
                            color={theme.colors.error[500]}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {/* Filter Tabs */}
            {history.length > 0 && (
                <View
                    style={{
                        flexDirection: "row",
                        paddingHorizontal: 24,
                        paddingBottom: 16,
                        gap: 8,
                    }}
                >
                    <Button
                        title="Tous"
                        onPress={() => setFilter("all")}
                        variant={filter === "all" ? "primary" : "outline"}
                        size="sm"
                        style={{ flex: 1 }}
                    />
                    <Button
                        title="Trouvés"
                        onPress={() => setFilter("found")}
                        variant={filter === "found" ? "primary" : "outline"}
                        size="sm"
                        style={{ flex: 1 }}
                    />
                    <Button
                        title="Non trouvés"
                        onPress={() => setFilter("not_found")}
                        variant={filter === "not_found" ? "primary" : "outline"}
                        size="sm"
                        style={{ flex: 1 }}
                    />
                </View>
            )}
            {/* History List */}
            <FlatList
                data={filteredHistory}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary[500]]}
                    />
                }
                ListEmptyComponent={renderEmptyState}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },

    headerTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: 700,
        color: theme.colors.text.primary,
    },

    clearButton: {
        padding: theme.spacing.sm,
    },

    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },

    filterButton: {
        flex: 1,
    },

    listContainer: {
        flexGrow: 1,
        paddingBottom: theme.spacing.lg,
    },

    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
    },

    plateInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },

    plateNumber: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: 600,
        color: theme.colors.text.primary,
    },

    resultBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.full,
    },

    resultText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: 500,
    },

    vehicleInfo: {
        marginBottom: theme.spacing.sm,
    },

    vehicleText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
        fontWeight: 500,
    },

    ownerText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.xs,
    },

    itemFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dateText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.tertiary,
    },

    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xl,
    },

    emptyTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: 700,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },

    emptyText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.secondary,
        textAlign: "center",
        lineHeight: theme.typography.lineHeight.normal,
        marginBottom: theme.spacing.xl,
    },

    emptyButton: {
        marginTop: theme.spacing.lg,
    },
});
