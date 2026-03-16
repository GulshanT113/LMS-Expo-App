import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEffect, useState } from "react";

import CourseCard from "@/components/CourseCard";
import { getCourses } from "../../services/courseService";

const data = {
  currentPageItems: 10,
  data: [
    {
      id: 1,
      title: "iPhone 9",
      brand: "Apple",
      category: "smartphones",
      description: "An apple mobile which is nothing like apple",
      price: 549,
      discountPercentage: 12.96,
      rating: 4.69,
      stock: 94,
      thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
      images: [],
    },
    {
      id: 2,
      title: "iPhone X",
      brand: "Apple",
      category: "smartphones",
      description:
        "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip",
      price: 899,
      discountPercentage: 17.94,
      rating: 4.44,
      stock: 34,
      thumbnail: "https://cdn.dummyjson.com/product-images/2/thumbnail.jpg",
      images: [],
    },
    {
      id: 3,
      title: "Samsung Universe 9",
      brand: "Samsung",
      category: "smartphones",
      description:
        "Samsung's new variant which goes beyond Galaxy to the Universe",
      price: 1249,
      discountPercentage: 15.46,
      rating: 4.09,
      stock: 36,
      thumbnail: "https://cdn.dummyjson.com/product-images/3/thumbnail.jpg",
      images: [],
    },
    {
      id: 4,
      title: "OPPOF19",
      brand: "OPPO",
      category: "smartphones",
      description: "OPPO F19 is officially announced on April 2021.",
      price: 280,
      discountPercentage: 17.91,
      rating: 4.3,
      stock: 123,
      thumbnail: "https://cdn.dummyjson.com/product-images/4/thumbnail.jpg",
      images: [],
    },
    {
      id: 5,
      title: "Huawei P30",
      brand: "Huawei",
      category: "smartphones",
      description:
        "Huawei’s re-badged P30 Pro New Edition was officially unveiled yesterday in Germany.",
      price: 499,
      discountPercentage: 10.58,
      rating: 4.09,
      stock: 32,
      thumbnail: "https://cdn.dummyjson.com/product-images/5/thumbnail.jpg",
      images: [],
    },
    {
      id: 6,
      title: "MacBook Pro",
      brand: "Apple",
      category: "laptops",
      description:
        "MacBook Pro 2021 with mini-LED display may launch between September and November",
      price: 1749,
      discountPercentage: 11.02,
      rating: 4.57,
      stock: 83,
      thumbnail: "https://cdn.dummyjson.com/product-images/6/thumbnail.png",
      images: [],
    },
    {
      id: 7,
      title: "Samsung Galaxy Book",
      brand: "Samsung",
      category: "laptops",
      description: "Samsung Galaxy Book S laptop with Intel Lakefield Chip",
      price: 1499,
      discountPercentage: 4.15,
      rating: 4.25,
      stock: 50,
      thumbnail: "https://cdn.dummyjson.com/product-images/7/thumbnail.jpg",
      images: [],
    },
    {
      id: 8,
      title: "Microsoft Surface Laptop 4",
      brand: "Microsoft Surface",
      category: "laptops",
      description:
        "Style and speed with vibrant touchscreen and HD video calls",
      price: 1499,
      discountPercentage: 10.23,
      rating: 4.43,
      stock: 68,
      thumbnail: "https://cdn.dummyjson.com/product-images/8/thumbnail.jpg",
      images: [],
    },
    {
      id: 9,
      title: "Infinix INBOOK",
      brand: "Infinix",
      category: "laptops",
      description: "Infinix Inbook X1 Ci3 10th Gen 8GB RAM 256GB SSD",
      price: 1099,
      discountPercentage: 11.83,
      rating: 4.54,
      stock: 96,
      thumbnail: "https://cdn.dummyjson.com/product-images/9/thumbnail.jpg",
      images: [],
    },
    {
      id: 10,
      title: "HP Pavilion 15-DK1056WM",
      brand: "HP Pavilion",
      category: "laptops",
      description: "Gaming laptop with GTX 1650 GPU and Core i5 processor",
      price: 1099,
      discountPercentage: 6.18,
      rating: 4.43,
      stock: 89,
      thumbnail: "https://cdn.dummyjson.com/product-images/10/thumbnail.jpeg",
      images: [],
    },
  ],
  limit: 10,
  nextPage: true,
  page: 1,
  previousPage: false,
  totalItems: 100,
  totalPages: 10,
};

const dData = data?.data;

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const response = await getCourses();
    console.log("HOME RESPONSE:", response);
    const list = response?.data || [];
    setCourses(list);
    setFiltered(list);
    console.log("COURSES LENGTH:", list.length);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = dData.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase()),
    );
    setFiltered(filteredData);
  };

  const [page, setPage] = useState(data?.page);
  const loadNextPage = () => {
    if (data?.nextPage) {
      console.log("Load next page...");
      // later you will call API with page + 1
      setPage(page + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Courses..."
        style={styles.search}
        value={search}
        onChangeText={handleSearch}
      />
      <ScrollView style={styles.container}>
        {dData ? (
          dData.map((item: any) => <CourseCard item={item} />)
        ) : (
          <Text style={styles.empty}>No Data Found</Text>
        )}
        {/* Pagination Button */}
        {data?.nextPage && (
          <View style={{ marginVertical: 20 }}>
            <Button title="Load More" onPress={loadNextPage} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
  },
});
