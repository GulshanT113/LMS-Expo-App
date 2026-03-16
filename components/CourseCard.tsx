import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function CourseCard({ item }: any) {
  return (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/courseDetails",
          params: {
            course: encodeURIComponent(JSON.stringify(item)),
          },
        })
      }
    >
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.brand}>
          {item.brand} • {item.category}
        </Text>
        <Text numberOfLines={2}>{item.description}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${item.price}</Text>
          <Text>⭐ {item.rating}</Text>
          <Text>Stock: {item.stock}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 160,
  },

  info: {
    padding: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  brand: {
    color: "gray",
    marginBottom: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  price: {
    fontWeight: "bold",
    color: "#2e7d32",
  },
});
