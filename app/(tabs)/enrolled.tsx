import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Border from "@/components/Border";
import { getEnrollments } from "../../utils/enrollStorage";

export default function Enrolled() {
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getEnrollments();
    setList(data);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enrolled Courses</Text>
      <Border />
      <FlatList
        data={list}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
        ListEmptyComponent={
          <Text style={styles.empty}>No enrolled courses</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, marginTop: 30, backgroundColor: "white" },
  title: { fontSize: 30, fontWeight: "bold", color: "black" },
  card: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  name: { fontWeight: "bold" },
  empty: {
    textAlign: "center",
    marginTop: 315,
    fontSize: 20,
  },
});
