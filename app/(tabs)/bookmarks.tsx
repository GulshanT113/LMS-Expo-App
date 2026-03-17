import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem("bookmarks");
      const list = saved ? JSON.parse(saved) : [];
      setBookmarks(list);
    } catch (e) {
      console.log("BOOKMARK LOAD ERROR", e);
      setBookmarks([]);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.title}>⬅ Back</Text>
      </TouchableOpacity>

      <FlatList
        data={bookmarks}
        keyExtractor={(item, index) => index.toString()}
        // ✅ CUSTOM EMPTY UI
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No selected bookmark right now.
              {"\n\n"}
              Please go through the Course-Details page. If the course data is
              here then you can bookmark or enroll from there.
              {"\n\n"}
              Otherwise, you can visit the Home page, select one course, and
              then bookmark or enroll.
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/courseDetails")}
            >
              <Text style={styles.buttonText}>Go to Course Details</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/courseDetails",
                params: { data: JSON.stringify(item) },
              })
            }
          >
            <Text style={styles.name}>{item.title}</Text>
            <Text>{item.instructorName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    marginTop: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },

  name: {
    fontWeight: "bold",
    fontSize: 16,
  },

  // ✅ EMPTY STATE STYLES
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#444",
  },

  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width: "60%",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
