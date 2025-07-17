import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/Colors";

/**
 * Custom tab bar icons using Ionicons for better visual consistency
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
}) {
    return <Ionicons size={26} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                tabBarInactiveTintColor:
                    Colors[colorScheme ?? "light"].tabIconDefault,
                tabBarStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                    borderTopWidth: 1,
                    borderTopColor: isDark ? "#1e293b" : "#e2e8f0",
                    height: 80,
                    paddingBottom: 10,
                    paddingTop: 10,
                    elevation: 8, // Android shadow
                    shadowColor: "#000", // iOS shadow
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 4,
                },
                tabBarIconStyle: {
                    marginBottom: 2,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="home" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: "Scanner",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="qr-code" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "Historique",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="time" color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="person" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
