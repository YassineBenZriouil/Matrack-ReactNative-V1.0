import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { theme } from "../../constants/theme";
import { auth, db } from "../../firebaseConfig";

type User = {
    id: string;
    username: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    createdAt: Date;
    lastLogin: Date;
};

type HistoryItem = {
    id: string;
    plate: string;
    registeredAt: Date;
    status: string;
};

export default function ProfileScreen() {
    const [user, setUser] = useState<User>({
        id: "1",
        username: "Guest",
        email: "Guest",
        role: "Guest",
        firstName: "Guest",
        lastName: "",
        avatar: undefined,
        createdAt: new Date("2024-01-01"),
        lastLogin: new Date(),
    });
    const [trouveCount, setTrouveCount] = useState(0);
    const [nonTrouveCount, setNonTrouveCount] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;
            const userDoc = await getDoc(doc(db, "users", currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUser({
                    id: currentUser.uid,
                    username: data.username || "",
                    email: data.email || "",
                    role: data.role || "agent",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    avatar: data.avatar || undefined,
                    createdAt: data.createdAt
                        ? new Date(data.createdAt)
                        : new Date(),
                    lastLogin: data.lastLogin
                        ? new Date(data.lastLogin)
                        : new Date(),
                });
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            let email = null;
            const user = auth.currentUser;
            if (user && user.email) {
                email = user.email;
            } else {
                email = await AsyncStorage.getItem("userEmail");
            }
            if (!email) return;
            const q = query(
                collection(db, "history"),
                where("email", "==", email)
            );
            const querySnapshot = await getDocs(q);
            let trouve = 0;
            let nonTrouve = 0;
            querySnapshot.docs.forEach((doc) => {
                const data = doc.data();
                if (data.status === "authorized") {
                    trouve++;
                } else {
                    nonTrouve++;
                }
            });
            setTrouveCount(trouve);
            setNonTrouveCount(nonTrouve);
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnecter",
                    style: "destructive",
                    onPress: () => {
                        // TODO: Implement logout logic
                        router.replace("/auth/login");
                    },
                },
            ]
        );
    };

    // Only keep the 'Paramètres' menu item, and make it route to /settings
    const menuItems = [
        {
            title: "Paramètres",
            icon: "settings",
            onPress: () => router.push("/settings"),
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profil</Text>
                </View>

                {/* User Info Card (Account Data) - always at the top */}
                <Card variant="elevated" padding="lg" margin="md">
                    <View style={styles.userInfo}>
                        <View style={styles.avatarContainer}>
                            {user.avatar ? (
                                <Image
                                    source={{ uri: user.avatar }}
                                    style={styles.avatar}
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons
                                        name="person"
                                        size={32}
                                        color={theme.colors.primary[500]}
                                    />
                                </View>
                            )}
                        </View>
                        <View style={styles.userDetails}>
                            <Text style={styles.userName}>
                                {user.firstName} {user.lastName}
                            </Text>
                            <Text style={styles.userRole}>
                                {user.role === "admin"
                                    ? "Administrateur"
                                    : "Agent"}
                            </Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                    </View>
                </Card>

                {/* Parameters Bar (Menu) - below account card */}
                <Card variant="elevated" padding="none" margin="md">
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.title}
                            style={
                                index < menuItems.length - 1
                                    ? [styles.menuItem, styles.menuItemBorder]
                                    : styles.menuItem
                            }
                            onPress={item.onPress}
                        >
                            <View style={styles.menuItemContent}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={20}
                                    color={theme.colors.text.primary}
                                />
                                <Text style={styles.menuItemText}>
                                    {item.title}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color={theme.colors.text.tertiary}
                            />
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* Statistics - below parameters bar */}
                <Card variant="elevated" padding="lg" margin="md">
                    <Text style={styles.sectionTitle}>Statistiques</Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>{trouveCount}</Text>
                            <Text style={styles.statLabel}>
                                Matricules trouvés
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>
                                {nonTrouveCount}
                            </Text>
                            <Text style={styles.statLabel}>Non trouvés</Text>
                        </View>
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

    scrollView: {
        flex: 1,
    },

    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },

    headerTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: 700, // was theme.typography.fontWeight.bold
        color: theme.colors.text.primary,
    },

    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },

    avatarContainer: {
        marginRight: theme.spacing.lg,
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },

    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: theme.colors.primary[50],
        alignItems: "center",
        justifyContent: "center",
    },

    userDetails: {
        flex: 1,
    },

    userName: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: 700, // was theme.typography.fontWeight.bold
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
    },

    userRole: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.primary[500],
        fontWeight: 500, // was theme.typography.fontWeight.medium
        marginBottom: theme.spacing.xs,
    },

    userEmail: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
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
    },

    settingInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },

    settingLabel: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
        fontWeight: 500, // was theme.typography.fontWeight.medium
    },

    menuItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },

    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },

    menuItemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
    },

    menuItemText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.text.primary,
        fontWeight: 500, // was theme.typography.fontWeight.medium
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },

    statItem: {
        alignItems: "center",
    },

    statNumber: {
        fontSize: theme.typography.fontSize["2xl"],
        fontWeight: 700, // was theme.typography.fontWeight.bold
        color: theme.colors.primary[500],
        marginBottom: theme.spacing.xs,
    },

    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        textAlign: "center",
    },

    logoutContainer: {
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },

    logoutButton: {
        marginTop: theme.spacing.lg,
    },
});
