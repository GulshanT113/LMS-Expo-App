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

export default function CourseDetails() {
  const { data }: any = useLocalSearchParams();
  const router = useRouter();
  const course = JSON.parse(data);

  const [bookmarked, setBookmarked] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [loadingState, setLoadingState] = useState(true); // ✅ prevent flicker

  useEffect(() => {
    loadInitialState();
  }, []);

  // ✅ Load both states together
  const loadInitialState = async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarks");
      const savedEnrollments = await AsyncStorage.getItem("enrollments");

      const bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
      const enrollments = savedEnrollments ? JSON.parse(savedEnrollments) : [];

      setBookmarked(bookmarks.some((i: any) => i.id === course.id));
      setEnrolled(enrollments.some((i: any) => i.id === course.id));
    } catch (e) {
      console.log("LOAD ERROR", e);
    } finally {
      setLoadingState(false); // ✅ render after load
    }
  };

  // 🔖 Toggle Bookmark (INSTANT UI)
  const toggleBookmark = async () => {
    try {
      const saved = await AsyncStorage.getItem("bookmarks");
      let list = saved ? JSON.parse(saved) : [];

      let updatedList;

      if (bookmarked) {
        updatedList = list.filter((i: any) => i.id !== course.id);
      } else {
        updatedList = [...list, course];
      }

      setBookmarked(!bookmarked); // ✅ instant update
      await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedList));
    } catch (e) {
      console.log("BOOKMARK ERROR", e);
    }
  };

  // 🎓 Enroll (Persisted)
  const handleEnroll = async () => {
    try {
      const saved = await AsyncStorage.getItem("enrollments");
      let list = saved ? JSON.parse(saved) : [];

      if (!list.some((i: any) => i.id === course.id)) {
        list.push(course);
        await AsyncStorage.setItem("enrollments", JSON.stringify(list));
      }

      setEnrolled(true); // ✅ instant
      Alert.alert("Success", "You are enrolled 🎉");
    } catch (e) {
      console.log("ENROLL ERROR", e);
    }
  };

  // ⛔ prevent wrong initial UI
  if (loadingState) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Back */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>⬅ Back</Text>
      </TouchableOpacity>

      {/* 📘 Title */}
      <Text style={styles.title}>{course.title || "No Title"}</Text>

      {/* 👨‍🏫 Instructor */}
      <Text style={styles.label}>Instructor: {course.instructorName}</Text>

      {/* 📦 FULL INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.section}>📘 Course Details</Text>

        {Object.entries(course).map(([key, value]) => (
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  back: { color: "#007bff", marginBottom: 10 },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  label: { fontSize: 16, marginBottom: 15, color: "#555" },

  card: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  section: { fontWeight: "bold", marginBottom: 10 },

  row: { flexDirection: "row", marginBottom: 5, flexWrap: "wrap" },

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
