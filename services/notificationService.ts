import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// ✅ Ask Permission
export const requestPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

// ✅ Bookmark Notification (5+)
export const checkBookmarkNotification = async () => {
  const saved = await AsyncStorage.getItem("bookmarks");
  const list = saved ? JSON.parse(saved) : [];

  if (list.length >= 5) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Great Learning!",
        body: "You bookmarked 5+ courses. Keep growing 🚀",
      },
      trigger: null, // instant
    });
  }
};

// ✅ Save Last Open Time
export const updateLastOpenTime = async () => {
  await AsyncStorage.setItem("lastOpen", Date.now().toString());
};

// ✅ 24 Hour Reminder
export const scheduleReminderIfInactive = async () => {
  const lastOpen = await AsyncStorage.getItem("lastOpen");

  if (!lastOpen) return;

  const diff = Date.now() - Number(lastOpen);

  const hours24 = 24 * 60 * 60 * 1000;

  if (diff > hours24) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📚 Come Back!",
        body: "You haven’t opened the app in a while. Continue learning!",
      },
      trigger: null,
    });
  }
};
