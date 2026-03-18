import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ✅ existing
import { getBookmarks, saveBookmarks } from "../../utils/bookmarkStorage";

// ✅ NEW (notification)
import Border from "@/components/Border";
import {
  checkBookmarkNotification,
  checkEnrollNotification,
} from "../../services/notificationService";

export default function CourseDetails() {
  const { data }: any = useLocalSearchParams();
  const router = useRouter();

  let course = null;
  try {
    course = data ? JSON.parse(data) : null;
  } catch (e) {
    console.log("Parse Error:", e);
  }

  const [bookmarked, setBookmarked] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [loadingState, setLoadingState] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const uniqueId = course
    ? `${course.id}-${course.title}-${course.description}`
    : "";

  useEffect(() => {
    loadInitialState();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadInitialState();
    setRefreshing(false);
  }, []);

  const loadInitialState = async () => {
    try {
      const bookmarks = await getBookmarks();
      const savedEnrollments = await AsyncStorage.getItem("enrollments");

      const enrollments = savedEnrollments ? JSON.parse(savedEnrollments) : [];

      const isBookmarked = bookmarks.some(
        (i: any) => `${i.id}-${i.title}-${i.description}` === uniqueId,
      );

      const isEnrolled = enrollments.some(
        (i: any) => `${i.id}-${i.title}-${i.description}` === uniqueId,
      );
      setBookmarked(isBookmarked);
      setEnrolled(isEnrolled);
    } catch (e) {
      console.log("Load Error:", e);
    } finally {
      setLoadingState(false);
    }
  };

  // ✅ UPDATED: Bookmark with notification
  const toggleBookmark = async () => {
    try {
      let list = await getBookmarks();

      const exists = list.some(
        (i: any) => `${i.id}-${i.title}-${i.description}` === uniqueId,
      );

      if (exists) {
        Alert.alert("Remove Bookmark", "Are you sure?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              const updated = list.filter(
                (i: any) => `${i.id}-${i.title}-${i.description}` !== uniqueId,
              );
              await saveBookmarks(updated);
              await checkBookmarkNotification(updated);
              setBookmarked(false);
            },
          },
        ]);
      } else {
        const updated = [...list, course];
        await saveBookmarks(updated);
        await checkBookmarkNotification(updated);
        setBookmarked(true);
        Alert.alert("Success", "You are Bookmarked! 🎉");
      }
    } catch (e) {
      console.log("Bookmark Error:", e);
    }
  };

  // Enroll with notification
  const toggleEnroll = async () => {
    try {
      const saved = await AsyncStorage.getItem("enrollments");
      let list = saved ? JSON.parse(saved) : [];

      const exists = list.some(
        (i: any) => `${i.id}-${i.title}-${i.description}` === uniqueId,
      );

      if (exists) {
        Alert.alert("Unenroll", "Are you sure?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: async () => {
              const updated = list.filter(
                (i: any) => `${i.id}-${i.title}-${i.description}` !== uniqueId,
              );
              await AsyncStorage.setItem(
                "enrollments",
                JSON.stringify(updated),
              );
              await checkEnrollNotification(updated);
              setEnrolled(false);
            },
          },
        ]);
      } else {
        const updated = [...list, course];
        await AsyncStorage.setItem("enrollments", JSON.stringify(updated));
        await checkEnrollNotification(updated);
        setEnrolled(true);
        Alert.alert("Success", "You are enrolled! 🎉");
      }
    } catch (e) {
      console.log("Enroll Error:", e);
    }
  };

  if (loadingState) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <View style={styles.center2}>
          <Text style={styles.title2}>Course Details</Text>
          <Border />
        </View>

        <Text style={styles.text}>No Course Data Found</Text>
        <Text></Text>
      </View>
    );
  }

  const orderedEntries = Object.entries(course).filter(
    ([key]) => key !== "images",
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Course Details</Text>
      <Border />
      <View style={styles.card}>
        <Text style={styles.section}>📘 Course Details</Text>

        {orderedEntries.map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.key}>{key}:</Text>
            <Text style={styles.value}>
              {typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, enrolled && { backgroundColor: "red" }]}
        onPress={toggleEnroll}
      >
        <Text style={styles.buttonText}>
          {enrolled ? "Unenroll ❌" : "Enroll 🎓"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, bookmarked && { backgroundColor: "orange" }]}
        onPress={toggleBookmark}
      >
        <Text style={styles.buttonText}>
          {bookmarked ? "Remove Bookmark ❌" : "Add Bookmark ⭐"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/webview",
            params: { data: JSON.stringify(course) },
          })
        }
      >
        <Text style={styles.buttonText}>Open WebView 🌐</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, marginTop: 30, backgroundColor: "white" },
  center: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
    marginTop: 30,
  },
  center2: {
    marginLeft: 5,
    marginRight: 5,
  },
  back: { fontSize: 18, marginBottom: 10 },
  title: { fontSize: 30, fontWeight: "bold", color: "black" },
  title2: {
    fontSize: 30,
    fontWeight: "bold",
    // marginLeft: 5,
    color: "black",
    marginTop: 5,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    elevation: 3,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 8,
  },
  section: { fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 6 },
  key: { fontWeight: "bold", marginRight: 5 },
  value: { flexShrink: 1 },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
