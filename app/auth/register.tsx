import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { theme } from "../../constants/theme";
import { auth, db } from "../../firebaseConfig";
import { RegisterData } from "../types";

export default function RegisterScreen() {
    const [formData, setFormData] = useState<RegisterData>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "agent",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<
        Partial<RegisterData & { confirmPassword: string }>
    >({});

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterData & { confirmPassword: string }> =
            {};

        if (!formData.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est requis";
        } else if (formData.username.length < 3) {
            newErrors.username =
                "Le nom d'utilisateur doit contenir au moins 3 caractères";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "L'email n'est pas valide";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Le mot de passe doit contenir au moins 6 caractères";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirmez votre mot de passe";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword =
                "Les mots de passe ne correspondent pas";
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = "Le prénom est requis";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Le nom de famille est requis";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Use Firebase Auth for registration
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            // Add user to Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: formData.email,
                username: formData.username,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: formData.role,
                createdAt: new Date(),
            });
            Alert.alert(
                "Inscription réussie",
                "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
                [
                    {
                        text: "OK",
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error: any) {
            let message =
                "Une erreur est survenue lors de la création du compte.";
            if (error.code === "auth/email-already-in-use")
                message = "Cet email est déjà utilisé.";
            if (error.code === "auth/invalid-email")
                message = "L'email n'est pas valide.";
            if (error.code === "auth/weak-password")
                message = "Le mot de passe est trop faible.";
            message += `\n\n${error.message}`;
            Alert.alert("Erreur d'inscription", message, [{ text: "OK" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (role: "admin" | "agent") => {
        setFormData({ ...formData, role });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Button
                            title=""
                            onPress={() => router.back()}
                            variant="ghost"
                            leftIcon={
                                <Ionicons
                                    name="arrow-back"
                                    size={24}
                                    color={theme.colors.text.primary}
                                />
                            }
                            style={styles.backButton}
                        />
                        <View style={styles.headerContent}>
                            <Image
                                source={require("../../assets/images/NoBgLogo.png")}
                                style={styles.headerLogo}
                                resizeMode="contain"
                            />
                            <Text style={styles.headerTitle}>
                                Créer un compte
                            </Text>
                        </View>
                        <View style={styles.headerSpacer} />
                    </View>

                    {/* Registration Form */}
                    <Card variant="elevated" padding="lg" margin="md">
                        <Input
                            label="Prénom"
                            placeholder="Entrez votre prénom"
                            value={formData.firstName}
                            onChangeText={(text) =>
                                setFormData({ ...formData, firstName: text })
                            }
                            leftIcon="person"
                            error={errors.firstName}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Nom de famille"
                            placeholder="Entrez votre nom de famille"
                            value={formData.lastName}
                            onChangeText={(text) =>
                                setFormData({ ...formData, lastName: text })
                            }
                            leftIcon="person"
                            error={errors.lastName}
                            autoCapitalize="words"
                        />

                        <Input
                            label="Nom d'utilisateur"
                            placeholder="Choisissez un nom d'utilisateur"
                            value={formData.username}
                            onChangeText={(text) =>
                                setFormData({ ...formData, username: text })
                            }
                            leftIcon="at"
                            error={errors.username}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Email"
                            placeholder="Entrez votre email"
                            value={formData.email}
                            onChangeText={(text) =>
                                setFormData({ ...formData, email: text })
                            }
                            leftIcon="mail"
                            error={errors.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Mot de passe"
                            placeholder="Créez un mot de passe"
                            value={formData.password}
                            onChangeText={(text) =>
                                setFormData({ ...formData, password: text })
                            }
                            secureTextEntry
                            leftIcon="lock-closed"
                            error={errors.password}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            placeholder="Confirmez votre mot de passe"
                            value={formData.confirmPassword}
                            onChangeText={(text) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: text,
                                })
                            }
                            secureTextEntry
                            leftIcon="lock-closed"
                            error={errors.confirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        {/* Role Selection */}
                        <View style={styles.roleContainer}>
                            <Text style={styles.roleLabel}>Rôle</Text>
                            <View style={styles.roleButtons}>
                                <Button
                                    title="Agent"
                                    onPress={() => handleRoleChange("agent")}
                                    variant={
                                        formData.role === "agent"
                                            ? "primary"
                                            : "outline"
                                    }
                                    size="sm"
                                    style={styles.roleButton}
                                />
                                <Button
                                    title="Admin"
                                    onPress={() => handleRoleChange("admin")}
                                    variant={
                                        formData.role === "admin"
                                            ? "primary"
                                            : "outline"
                                    }
                                    size="sm"
                                    style={styles.roleButton}
                                />
                            </View>
                        </View>

                        <Button
                            title="Créer le compte"
                            onPress={handleRegister}
                            loading={loading}
                            fullWidth
                            style={styles.registerButton}
                        />
                    </Card>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Vous avez déjà un compte ?
                        </Text>
                        <Button
                            title="Se connecter"
                            onPress={() => router.back()}
                            variant="ghost"
                            size="sm"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },

    keyboardAvoidingView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },

    backButton: {
        marginRight: theme.spacing.md,
    },

    headerContent: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        gap: theme.spacing.sm,
    },

    headerLogo: {
        width: 32,
        height: 32,
    },

    headerTitle: {
        fontSize: theme.typography.fontSize["2xl"],
        fontWeight: theme.typography.fontWeight.bold as any,
        color: theme.colors.text.primary,
    },

    headerSpacer: {
        width: 40,
    },

    roleContainer: {
        marginBottom: theme.spacing.lg,
    },

    roleLabel: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },

    roleButtons: {
        flexDirection: "row",
        gap: theme.spacing.sm,
    },

    roleButton: {
        flex: 1,
    },

    registerButton: {
        marginTop: theme.spacing.lg,
    },

    loginContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: theme.spacing.lg,
        gap: theme.spacing.sm,
    },

    loginText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.secondary,
    },
});
