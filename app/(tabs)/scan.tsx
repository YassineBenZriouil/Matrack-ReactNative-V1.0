import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CameraComponent from "../../components/CameraView";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { theme } from "../../constants/theme";
import { auth, db } from "../../firebaseConfig";

export default function ScanScreen() {
    const [ocrResult, setOcrResult] = useState<string | null>(null);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [plateInput, setPlateInput] = useState<string>("");
    const [searchResult, setSearchResult] = useState<
        null | "found" | "not_found"
    >(null);
    const [searching, setSearching] = useState(false);
    const [manualEntryMode, setManualEntryMode] = useState(false);

    const addDebugLog = (message: string) => {
        setDebugLogs((prev) => [
            ...prev.slice(-9),
            `${new Date().toLocaleTimeString()}: ${message}`,
        ]);
    };

    const handleTextRecognized = (text: string) => {
        setOcrResult(text);
        setPlateInput(text);
        setIsProcessing(false);
    };

    const handleSearch = async () => {
        setSearching(true);
        setSearchResult(null);
        try {
            // Search for similar plate in vehicles collection
            const q = query(
                collection(db, "vehicles"),
                where("plate", "==", plateInput.trim())
            );
            const querySnapshot = await getDocs(q);
            const found = !querySnapshot.empty;
            setSearchResult(found ? "found" : "not_found");
            // Always add to history collection
            let email = null;
            const user = auth.currentUser;
            if (user && user.email) {
                email = user.email;
            } else if (user && user.uid) {
                // Try to fetch from Firestore user doc
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        email = userDoc.data().email;
                    }
                } catch (e) {}
            }
            if (!email) {
                email = await AsyncStorage.getItem("userEmail");
            }

            // Check if history already exists for this plate and email
            const historyQuery = query(
                collection(db, "history"),
                where("plate", "==", plateInput.trim()),
                where("email", "==", email)
            );
            const historySnapshot = await getDocs(historyQuery);
            if (historySnapshot.empty) {
                await addDoc(collection(db, "history"), {
                    plate: plateInput.trim(),
                    email: email,
                    registeredAt: Timestamp.now(),
                    status: found ? "authorized" : "not_found",
                });
            }

            if (found) {
                const details = querySnapshot.docs[0].data();
                // Navigate to carDetails screen, passing details as params
                router.push({
                    pathname: "/carDetails",
                    params: {
                        ...details,
                        plate: plateInput.trim(),
                    },
                });
                return;
            }
        } catch (e) {
            Alert.alert(
                "Erreur",
                "Erreur lors de la recherche dans la base de données."
            );
        } finally {
            setSearching(false);
        }
    };

    const handleCancel = () => {
        setOcrResult(null);
        setPlateInput("");
        setSearchResult(null);
        setManualEntryMode(false);
    };

    const handleError = (error: string) => {
        setIsProcessing(false);
        Alert.alert("Erreur de scan", error);
    };

    const handleScanAgain = () => {
        setOcrResult(null);
        setDebugLogs([]);
    };

    const handleManualEntry = () => {
        setManualEntryMode(true);
        setOcrResult("");
        setPlateInput("");
        setSearchResult(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            {!ocrResult && !manualEntryMode ? (
                <View style={styles.cameraContainer}>
                    <CameraComponent
                        onTextRecognized={handleTextRecognized}
                        onError={handleError}
                    />
                    {/* Manual Entry Button */}
                    <View style={styles.manualEntryContainer}>
                        <Button
                            title="Saisie manuelle"
                            onPress={handleManualEntry}
                            variant="outline"
                            leftIcon={
                                <Ionicons
                                    name="create"
                                    size={20}
                                    color={theme.colors.primary[500]}
                                />
                            }
                            style={styles.manualEntryButton}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.resultContainer}>
                    <Card variant="elevated" padding="lg" margin="md">
                        <Text style={styles.heading}>Matricule détecté</Text>
                        <TextInput
                            style={styles.plateInput}
                            value={plateInput}
                            onChangeText={setPlateInput}
                            editable={!searching}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            placeholder="Entrez le numéro de matricule"
                        />
                        {searchResult === "not_found" && (
                            <Text style={styles.notFoundText}>
                                Matricule non trouvé
                            </Text>
                        )}
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Chercher"
                                onPress={handleSearch}
                                loading={searching}
                                disabled={searching || !plateInput.trim()}
                                leftIcon={
                                    <Ionicons
                                        name="search"
                                        size={20}
                                        color={theme.colors.text.inverse}
                                    />
                                }
                                style={styles.actionButton}
                            />
                            <Button
                                title="Annuler"
                                onPress={handleCancel}
                                variant="outline"
                                leftIcon={
                                    <Ionicons
                                        name="close"
                                        size={20}
                                        color={theme.colors.primary[500]}
                                    />
                                }
                                style={styles.actionButton}
                            />
                        </View>
                    </Card>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    cameraContainer: {
        flex: 1,
        position: "relative",
    },
    manualEntryContainer: {
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
    },
    manualEntryButton: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderRadius: 8,
    },
    resultContainer: {
        flex: 1,
        padding: theme.spacing.md,
    },
    heading: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
        textAlign: "center",
    },
    result: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.semibold as any,
        color: theme.colors.primary[500],
        textAlign: "center",
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.primary[50],
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg,
        letterSpacing: 2,
    },
    buttonContainer: {
        gap: theme.spacing.md,
    },
    actionButton: {
        marginBottom: theme.spacing.sm,
    },
    debugTitle: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.semibold as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },
    debugScrollView: {
        maxHeight: 200,
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.sm,
    },
    debugLog: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.secondary,
        fontFamily: "monospace",
        marginBottom: 2,
    },
    clearLogsButton: {
        alignSelf: "center",
        marginTop: theme.spacing.sm,
        padding: theme.spacing.sm,
    },
    clearLogsText: {
        color: theme.colors.primary[500],
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium as any,
    },
    plateInput: {
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.text.primary,
        textAlign: "center",
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.primary[50],
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.lg,
        letterSpacing: 2,
    },
    foundText: {
        color: theme.colors.success[600],
        fontSize: theme.typography.fontSize.base,
        textAlign: "center",
        marginBottom: theme.spacing.md,
        fontWeight: theme.typography.fontWeight.bold as any,
    },
    notFoundText: {
        color: theme.colors.error[600],
        fontSize: theme.typography.fontSize.base,
        textAlign: "center",
        marginBottom: theme.spacing.md,
        fontWeight: theme.typography.fontWeight.bold as any,
    },
});
