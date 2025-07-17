/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#3b82f6";
const tintColorDark = "#60a5fa";

export const Colors = {
    light: {
        text: "#11181C",
        background: "#ffffff",
        tint: tintColorLight,
        icon: "#64748b",
        tabIconDefault: "#64748b",
        tabIconSelected: tintColorLight,
    },
    dark: {
        text: "#ECEDEE",
        background: "#0f172a",
        tint: tintColorDark,
        icon: "#94a3b8",
        tabIconDefault: "#94a3b8",
        tabIconSelected: tintColorDark,
    },
};
