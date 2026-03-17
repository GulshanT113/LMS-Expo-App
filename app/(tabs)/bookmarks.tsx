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
    const saved = await AsyncStorage.getItem("bookmarks");
    const list = saved ? JSON.parse(saved) : [];
    setBookmarks(list);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Bookmarked Courses</Text>

      <FlatList
        data={bookmarks}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>No bookmarks yet</Text>}
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
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
});
