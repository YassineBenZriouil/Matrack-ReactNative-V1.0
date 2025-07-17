import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { auth } from "../../firebaseConfig";
import { LoginCredentials } from "../types";

export default function LoginScreen() {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginCredentials> = {};

        if (!credentials.username.trim()) {
            newErrors.username = "Le nom d'utilisateur est requis";
        }

        if (!credentials.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (credentials.password.length < 6) {
            newErrors.password =
                "Le mot de passe doit contenir au moins 6 caractères";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Use Firebase Auth for login
            await signInWithEmailAndPassword(
                auth,
                credentials.username,
                credentials.password
            );
            // Save email to AsyncStorage
            await AsyncStorage.setItem("userEmail", credentials.username);
            // Navigate to main app
            router.replace("/(tabs)");
        } catch (error: any) {
            let message = "Nom d'utilisateur ou mot de passe incorrect";
            if (error.code === "auth/user-not-found")
                message = "Utilisateur non trouvé";
            if (error.code === "auth/wrong-password")
                message = "Mot de passe incorrect";
            Alert.alert("Erreur de connexion", message, [{ text: "OK" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        router.push("/auth/register");
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
                        <View style={styles.logoContainer}>
                            <Image
                                source={require("../../assets/images/NoBgLogo.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.title}>Mattrak</Text>
                        <Text>Vérification des matricules de véhicules</Text>
                    </View>

                    {/* Login Form */}
                    <Card variant="elevated" padding="lg" margin="md">
                        <Text style={styles.formTitle}>Connexion</Text>

                        <Input
                            label="Nom d'utilisateur"
                            placeholder="Entrez votre nom d'utilisateur"
                            value={credentials.username}
                            onChangeText={(text) =>
                                setCredentials({
                                    ...credentials,
                                    username: text,
                                })
                            }
                            leftIcon="person"
                            error={errors.username}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Input
                            label="Mot de passe"
                            placeholder="Entrez votre mot de passe"
                            value={credentials.password}
                            onChangeText={(text) =>
                                setCredentials({
                                    ...credentials,
                                    password: text,
                                })
                            }
                            secureTextEntry
                            leftIcon="lock-closed"
                            error={errors.password}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <Button
                            title="Se connecter"
                            onPress={handleLogin}
                            loading={loading}
                            fullWidth
                            style={styles.loginButton}
                        />
                    </Card>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Vous n'avez pas de compte ?
                        </Text>
                        <Button
                            title="Créer un compte"
                            onPress={handleRegister}
                            variant="ghost"
                            size="sm"
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            © 2024 Mattrak. Tous droits réservés.
                        </Text>
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
        justifyContent: "center",
        paddingHorizontal: theme.spacing.lg,
    },

    header: {
        alignItems: "center",
        marginBottom: theme.spacing.xl,
    },

    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: theme.colors.primary[50],
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.md,
        ...theme.shadows.md,
    },

    logo: {
        width: 200,
        height: 200,
    },

    title: {
        fontSize: theme.typography.fontSize["3xl"],
        fontWeight: theme.typography.fontWeight.bold as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.sm,
    },

    formTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold as any,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.lg,
        textAlign: "center",
    },

    loginButton: {
        marginTop: theme.spacing.lg,
    },

    registerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: theme.spacing.lg,
        gap: theme.spacing.sm,
    },

    registerText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.secondary,
    },

    footer: {
        alignItems: "center",
        marginTop: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
    },

    footerText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.tertiary,
    },
});
