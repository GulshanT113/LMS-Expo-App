import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🔔 Notification import
import { checkBookmarkNotification } from "../../services/notificationService";

export default function CourseDetails() {
  const { data }: any = useLocalSearchParams();
  const router = useRouter();

  // ✅ SAFE PARSE
  let course = null;
  try {
    course = data ? JSON.parse(data) : null;
  } catch (e) {
    console.log("PARSE ERROR", e);
  }

  const [bookmarked, setBookmarked] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [loadingState, setLoadingState] = useState(true);

  // ✅ Unique ID
  const uniqueId = course ? `${course.id}-${course.title}` : "";

  useEffect(() => {
    if (course) {
      loadInitialState();
    } else {
      setLoadingState(false);
    }
  }, []);

  // ✅ Load saved state
  const loadInitialState = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarks");
      const savedEnrollments = await AsyncStorage.getItem("enrollments");

      const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      const enrollments = savedEnrollments ? JSON.parse(savedEnrollments) : [];

      setBookmarked(
        bookmarks.some((i: any) => `${i.id}-${i.title}` === uniqueId),
      );

      setEnrolled(
        enrollments.some((i: any) => `${i.id}-${i.title}` === uniqueId),
      );
    } catch (e) {
      console.log("LOAD ERROR", e);
    } finally {
      setLoadingState(false);
    }
  };

  // 🔖 Toggle Bookmark + Notification
  const toggleBookmark = async () => {
    try {
      const saved = await AsyncStorage.getItem("bookmarks");
      let list = saved ? JSON.parse(saved) : [];
      let updatedList;

      if (bookmarked) {
        updatedList = list.filter(
          (i: any) => `${i.id}-${i.title}` !== uniqueId,
        );
      } else {
        updatedList = [...list, course];
      }

      setBookmarked(!bookmarked);
      await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedList));

      // 🔔 Trigger notification when count reaches 5
      await checkBookmarkNotification();
    } catch (e) {
      console.log("BOOKMARK ERROR", e);
    }
  };

  // 🎓 Enroll
  const handleEnroll = async () => {
    try {
      const saved = await AsyncStorage.getItem("enrollments");
      let list = saved ? JSON.parse(saved) : [];

      if (!list.some((i: any) => `${i.id}-${i.title}` === uniqueId)) {
        list.push(course);
        await AsyncStorage.setItem("enrollments", JSON.stringify(list));
      }

      setEnrolled(true);
      Alert.alert("Success", "You are enrolled 🎉");
    } catch (e) {
      console.log("ENROLL ERROR", e);
    }
  };

  // ⏳ Loading UI
  if (loadingState) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // ❌ NO DATA UI
  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          No data is selected right now.
          {"\n\n"}
          Please go to Home page and select any course card, then you will be
          redirected here.
        </Text>

        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 📦 Order Data
  const orderedEntries = Object.entries(course)
    .filter(([key]) => key !== "images")
    .sort(([a], [b]) => {
      if (a === "id") return -1;
      if (b === "id") return 1;
      if (a === "instructorName") return 1;
      if (b === "instructorName") return -1;
      if (a === "thumbnail") return 1;
      if (b === "thumbnail") return -1;
      return 0;
    });

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Back */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>⬅ Back</Text>
      </TouchableOpacity>

      {/* 📘 Title */}
      <Text style={styles.title}>{course.title || "No Title"}</Text>

      {/* 📦 DETAILS CARD */}
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

      {/* 🎓 Enroll */}
      <TouchableOpacity
        style={[styles.button, enrolled && { backgroundColor: "green" }]}
        onPress={handleEnroll}
        disabled={enrolled}
      >
        <Text style={styles.buttonText}>
          {enrolled ? "Enrolled ✅" : "Enroll Now"}
        </Text>
      </TouchableOpacity>

      {/* 🔖 Bookmark */}
      <TouchableOpacity
        style={[styles.button, bookmarked && { backgroundColor: "orange" }]}
        onPress={toggleBookmark}
      >
        <Text style={styles.buttonText}>
          {bookmarked ? "Bookmarked ⭐" : "Add Bookmark"}
        </Text>
      </TouchableOpacity>

      {/* 🌐 WebView */}
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
  container: {
    flex: 1,
    padding: 15,
    marginTop: 30,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#444",
  },

  back: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  section: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },

  key: {
    fontWeight: "bold",
    marginRight: 5,
    color: "#333",
  },

  value: {
    flexShrink: 1,
    color: "#555",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
