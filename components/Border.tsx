import React from "react";
import { StyleSheet, View } from "react-native";
const Border = () => {
  return <View style={styles.borderBox}></View>;
};

export default Border;

const styles = StyleSheet.create({
  borderBox: {
    borderWidth: 1,
    backgroundColor: "darkgray",
    borderRadius: 8, // optional (for smooth corners)
    padding: 1, // optional (spacing inside)
  },
});
