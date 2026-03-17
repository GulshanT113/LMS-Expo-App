import { useRouter } from "expo-router"; // ✅ navigation
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CourseCard from "../../components/CourseCard";
import { getCourses, getInstructors } from "../../services/courseService";

export default function Home() {
  const router = useRouter(); // ✅

  const [courses, setCourses] = useState([]);
  const [instructor, setInstructor] = useState([]);

  const [page, setPage] = useState(1);

  // ✅ Separate loading states
  const [courseLoading, setCourseLoading] = useState(false);
  const [instructorLoading, setInstructorLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCourses(1, true);
    loadInstructors();
  }, []);

  // 🔥 Load Courses
  const loadCourses = async (pageNumber: any, reset = false) => {
    if (courseLoading) return;

    setCourseLoading(true);
    try {
      const response = await getCourses(pageNumber);
      const list = response?.data?.data || [];
      const nextPage = response?.data?.nextPage;

      setCourses((prev) => (reset ? list : [...prev, ...list]));
      setHasMore(!!nextPage);
    } catch (error) {
      console.log("COURSE ERROR:", error);
    } finally {
      setCourseLoading(false);
      setRefreshing(false);
    }
  };

  // 🔥 Load Instructors
  const loadInstructors = async () => {
    if (instructorLoading) return;

    setInstructorLoading(true);
    try {
      const response = await getInstructors();
      const users = response?.data?.data || [];
      setInstructor(users);
    } catch (error) {
      console.log("INSTRUCTOR ERROR:", error);
    } finally {
      setInstructorLoading(false);
    }
  };

  // ✅ Stable Instructor Mapping
  const combinedData = useMemo(() => {
    if (!instructor.length) return courses;

    return courses.map((course: any, index) => {
      const instructorIndex = course.id
        ? course.id % instructor.length
        : index % instructor.length;

      return {
        ...course,
        instructorName:
          `${instructor[instructorIndex]?.name?.title} ${instructor[instructorIndex]?.name?.first} ${instructor[instructorIndex]?.name?.last}` ||
          "Unknown",
      };
    });
  }, [courses, instructor]);

  // 🔍 Search
  const filteredCourses = useMemo(() => {
    if (!search) return combinedData;

    const searchText = search.trim().toLowerCase();

    return combinedData.filter((item) => {
      const fullData = JSON.stringify(item).toLowerCase();
      return fullData.includes(searchText);
    });
  }, [search, combinedData]);

  // 🔄 Pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadCourses(1, true);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* 🔍 Search */}
      <TextInput
        placeholder="Search anything..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />

      <FlatList
        data={filteredCourses}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/courseDetails",
                params: { data: JSON.stringify(item) },
              })
            }
          >
            <Text style={styles.title}>
              {item.title || item.name?.first || "No Title"}
            </Text>

            <CourseCard item={item} />
          </TouchableOpacity>
        )}
        // 🔥 Infinite Scroll
        onEndReached={() => {
          if (hasMore && !courseLoading) {
            const next = page + 1;
            setPage(next);
            loadCourses(next);
          }
        }}
        onEndReachedThreshold={0.5}
        // 🔄 Pull to Refresh
        refreshing={refreshing}
        onRefresh={handleRefresh}
        // 🔻 Footer
        ListFooterComponent={
          courseLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : hasMore ? (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => {
                const next = page + 1;
                setPage(next);
                loadCourses(next);
              }}
            >
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.endText}>No More Data</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

// 🎨 Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  search: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },

  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },

  loadMoreBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    margin: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  loadMoreText: {
    color: "#fff",
    fontWeight: "bold",
  },

  endText: {
    textAlign: "center",
    margin: 15,
    color: "gray",
  },
});
