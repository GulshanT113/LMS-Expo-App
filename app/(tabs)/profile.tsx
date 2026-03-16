import {
  ActivityIndicator,
  Button,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { useEffect, useState } from "react";
import { getProfile } from "../../services/authService";

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await getProfile();
      console.log("PROFILE DATA:", user);
      setProfile(user?.data);
    } catch (error) {
      console.log("PROFILE ERROR:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>No profile found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {profile ? (
        <View>
          <Image source={{ uri: profile?.avatar?.url }} style={styles.avatar} />
          <Text style={styles.name}>{profile?.username}</Text>
          <Text style={styles.info}>Email: {profile?.email}</Text>
          <Text style={styles.info}>Role: {profile?.role}</Text>
          <Text style={styles.info}>User ID: {profile?._id}</Text>
          <Text style={styles.info}>Created At: {profile?.createdAt}</Text>
        </View>
      ) : (
        <Text>No Data</Text>
      )}
      <Button title="Logout" onPress={() => router.push("/login")} />
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
    marginBottom: 20,
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
});
