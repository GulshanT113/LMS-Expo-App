import { useColorScheme } from "@/hooks/use-color-scheme";
import NetInfo from "@react-native-community/netinfo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications"; // ✅ NEW
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import "react-native-reanimated";

import {
  requestPermission,
  scheduleInactiveReminder, // ✅ NEW
} from "../services/notificationService";

export const unstable_settings = {
  anchor: "(stack)",
};

// IMPORTANT: Notification handler (fix for not showing notifications)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    // ✅ Notification Permission
    await requestPermission();

    // ✅ Start 10 min inactivity notification
    await scheduleInactiveReminder();
  };

  // ✅ Reset inactivity timer every time app loads
  useEffect(() => {
    scheduleInactiveReminder();
  }, []);

  // 🌐 INTERNET CHECK (your existing logic untouched)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected: any = state.isConnected && state.isInternetReachable;

      setIsConnected(connected);

      if (!connected) {
        Alert.alert(
          "No Internet 🚫",
          "Your data is turned off. Please turn on your internet to use services.",
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
