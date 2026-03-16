import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

export default function CourseDetails() {
  const { course } = useLocalSearchParams();

  const item = course ? JSON.parse(decodeURIComponent(course as string)) : null;

  console.log("course details page => ", item);

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Course not found</Text>
      </View>
    );
  }

  const enroll = () => {
    Alert.alert("Success", "You enrolled successfully!");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.brand}>
          {item.brand} • {item.category}
        </Text>

        <Text numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>

        <View style={styles.row}>
          <Text style={styles.price}>${item.price}</Text>

          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.stock}>Stock: {item.stock}</Text>

          <Text style={styles.discount}>{item.discountPercentage}% OFF</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={enroll}>
        <Text style={styles.buttonText}>Enroll</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 180,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  brand: {
    color: "#666",
    marginBottom: 6,
  },
  description: {
    color: "#444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  rating: {
    fontSize: 14,
  },
  stock: {
    color: "#555",
  },
  discount: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
});
