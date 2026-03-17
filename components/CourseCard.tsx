// import { router } from "expo-router";
// import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// export default function CourseCard({ item }: any) {
//   return (
//     <TouchableOpacity
//       key={item.id}
//       style={styles.card}
//       onPress={() =>
//         router.push({
//           pathname: "/courseDetails",
//           params: {
//             course: encodeURIComponent(JSON.stringify(item)),
//           },
//         })
//       }
//     >
//       <Image source={{ uri: item.thumbnail }} style={styles.image} />
//       <View style={styles.info}>
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.brand}>
//           {item.brand} • {item.category}
//         </Text>
//         <Text numberOfLines={2}>{item.description}</Text>
//         <View style={styles.row}>
//           <Text style={styles.price}>${item.price}</Text>
//           <Text>⭐ {item.rating}</Text>
//           <Text>Stock: {item.stock}</Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// }
// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     marginBottom: 15,
//     overflow: "hidden",
//     elevation: 3,
//   },

//   image: {
//     width: "100%",
//     height: 160,
//   },

//   info: {
//     padding: 12,
//   },

//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },

//   brand: {
//     color: "gray",
//     marginBottom: 5,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 8,
//   },

//   price: {
//     fontWeight: "bold",
//     color: "#2e7d32",
//   },
// });

// 🔥 Recursive Component
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function CourseCard({ item, level = 0, parentKey = "" }: any) {
  return (
    <View style={[styles.container, { marginLeft: level * 10 }]}>
      {Object.entries(item).map(([key, value], index) => {
        const uniqueKey = `${parentKey}-${key}-${index}`;

        if (typeof value === "object" && value !== null) {
          return (
            <View key={uniqueKey} style={styles.nestedBox}>
              {/* <Text style={styles.key}>{key}:</Text> */}
              {/* <CourseCard
                item={value}
                level={level + 1}
                parentKey={uniqueKey}
              /> */}
            </View>
          );
        } else {
          return (
            <View key={uniqueKey} style={styles.row}>
              <Text style={styles.key}>{key}:</Text>
              <Text style={styles.value}>{String(value)}</Text>
            </View>
          );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },
  container: {
    marginTop: 5,
  },
  nestedBox: {
    paddingLeft: 5,
    borderLeftWidth: 2,
    borderLeftColor: "#ddd",
    marginVertical: 5,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 2,
  },
  key: {
    fontWeight: "bold",
    color: "#555",
    marginRight: 5,
  },
  value: {
    color: "#222",
    paddingBottom: 2,
  },
});
