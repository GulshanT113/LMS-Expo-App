import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const BOOKMARK_FLAG = "bookmark_notified";
const ENROLL_FLAG = "enroll_notified";

export const requestPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

// Bookmark Notification
export const checkBookmarkNotification = async (list: any) => {
  const alreadyNotified = await AsyncStorage.getItem(BOOKMARK_FLAG);

  if (list.length >= 6 && !alreadyNotified) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔥 Bookmark Master!",
        body: "You crossed 5 bookmarks 🚀",
      },
      trigger: null,
    });

    await AsyncStorage.setItem(BOOKMARK_FLAG, "true");
  }
};

// Enroll Notification
export const checkEnrollNotification = async (list: any) => {
  const alreadyNotified = await AsyncStorage.getItem(ENROLL_FLAG);

  if (list.length >= 6 && !alreadyNotified) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎓 Learning Streak!",
        body: "You enrolled in 5+ courses 🚀",
      },
      trigger: null,
    });

    await AsyncStorage.setItem(ENROLL_FLAG, "true");
  }
};

export const scheduleInactiveReminder = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync(); // reset old

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Come Back!",
      body: "You haven’t used the app for 10 mins. Stay consistent 🚀",
    },
    trigger: {
      seconds: 600, // 10 mins
    },
  });
};
