import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
        ...FontAwesome.font,
    });
    const router = useRouter();

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkLogin = async () => {
            const email = await AsyncStorage.getItem("userEmail");
            if (!email) {
                router.replace("/auth/login");
            }
        };
        checkLogin();
    }, []);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="auth/login"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="auth/register"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="settings"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="carDetails"
                    options={{
                        headerShown: true,
                        title: "Détails du véhicule",
                    }}
                />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
