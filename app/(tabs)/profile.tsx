import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { getProfile } from "../../services/authService";
import { getCourses } from "../../services/courseService";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [avatar, setAvatar] = useState<string | null>(null);

  // ✅ NEW STATES
  const [coursesCount, setCoursesCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await getProfile();
      setProfile(user?.data);
      setAvatar(user?.data?.avatar?.url);

      // ✅ FETCH COURSES
      const courseRes = await getCourses();
      const courseList = courseRes?.data || [];

      // 👉 Assume enrolled = first few courses
      const enrolled = courseList.slice(0, 5);

      setCoursesCount(enrolled.length);

      // 👉 Calculate progress (avg rating based mock)
      const totalRating = enrolled.reduce(
        (sum: number, item: any) => sum + item.rating,
        0,
      );

      const avgProgress = Math.round((totalRating / enrolled.length) * 20);
      // rating (0-5) → convert to %

      setProgress(avgProgress);
    } catch (error) {
      console.log("ERROR:", error);
    }

    setLoading(false);
  };

  // ✅ IMAGE PICK
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ PROFILE IMAGE */}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{
            uri:
              avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.editText}>Tap to change photo</Text>
      </TouchableOpacity>

      {/* ✅ USER INFO */}
      <Text style={styles.name}>{profile?.username}</Text>
      <Text style={styles.info}>Email: {profile?.email}</Text>

      {/* ✅ STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{coursesCount}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{progress}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      {/* ✅ PROGRESS BAR */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* ✅ LOGOUT */}
      <TouchableOpacity
        style={styles.logout}
        onPress={() => router.replace("/login")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },

  editText: {
    fontSize: 12,
    color: "blue",
    textAlign: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  info: {
    fontSize: 16,
    marginBottom: 5,
  },

  statsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },

  statBox: {
    backgroundColor: "#fff",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
    width: 100,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },

  statLabel: {
    color: "gray",
  },

  logout: {
    marginTop: 30,
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  progressBar: {
    height: 10,
    width: "80%",
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
});
