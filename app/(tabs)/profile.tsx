import { removeToken } from "@/utils/storage";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getProfile } from "../../services/authService";
import { getCourses } from "../../services/courseService";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(null);
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
      const courseRes = await getCourses();
      const courseList = courseRes?.data || [];

      // Assume enrolled = first few courses
      const enrolled = courseList.slice(0, 5);
      setCoursesCount(enrolled.length);

      // Calculate progress (avg rating based mock)
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

  console.log("profile progress => ", progress);
  console.log("profile data => ", profile);

  // IMAGE PICK
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

  const handleLogout = () => {
    removeToken();
    router.replace("/login");
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* PROFILE IMAGE */}
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{
              uri:
                avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <Text style={styles.editText}>Tap to change photo</Text>
        </TouchableOpacity>

        {/* USER INFO */}
        <Text style={styles.name}>{profile?.username}</Text>
        <View style={styles.card}>
          <Text style={styles.info}>ID: {profile?._id}</Text>
          <Text style={styles.info}>Email: {profile?.email}</Text>
          <Text style={styles.info}>Role: {profile?.role}</Text>
          <Text style={styles.info}>Login Type: {profile?.loginType}</Text>
          <Text style={styles.info}>Created At: {profile?.createdAt}</Text>
          <Text style={styles.info}>Updated At: {profile?.updatedAt}</Text>
        </View>
        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>65%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
        {/* PROGRESS BAR */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `65%` }]} />
        </View>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 250,
    height: 250,
    borderRadius: 250,
    marginBottom: 4,
  },

  editText: {
    fontSize: 12,
    color: "blue",
    textAlign: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    color: "skyblue",
  },

  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },

  info: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
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
    marginTop: 15,
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
