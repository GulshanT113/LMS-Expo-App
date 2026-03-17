import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { getToken } from "../../utils/storage";

// 🔔 IMPORT NOTIFICATION SERVICE
import {
  requestPermission,
  scheduleReminderIfInactive,
  updateLastOpenTime,
} from "../../services/notificationService";

export default function Index() {
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    // ✅ Notification Setup
    await requestPermission();
    await scheduleReminderIfInactive();
    await updateLastOpenTime();

    // ✅ Auth Check
    checkLogin();
  };

  const checkLogin = async () => {
    const token = await getToken();
    console.log("check token ? => ", token);

    if (token) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
