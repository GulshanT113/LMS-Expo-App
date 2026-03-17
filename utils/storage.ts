import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

// ✅ SAVE TOKEN
export const saveToken = async (token: string) => {
  try {
    if (isWeb) {
      localStorage.setItem("token", token);
    } else {
      await SecureStore.setItemAsync("token", token);
    }
  } catch (e) {
    console.log("SAVE TOKEN ERROR:", e);
  }
};

// ✅ GET TOKEN
export const getToken = async () => {
  try {
    if (isWeb) {
      return localStorage.getItem("token");
    } else {
      return await SecureStore.getItemAsync("token");
    }
  } catch (e) {
    console.log("GET TOKEN ERROR:", e);
    return null;
  }
};

// ✅ REMOVE TOKEN
export const removeToken = async () => {
  try {
    if (isWeb) {
      localStorage.removeItem("token");
    } else {
      await SecureStore.deleteItemAsync("token");
      console.log("token deleted successfully!");
    }
  } catch (e) {
    console.log("REMOVE TOKEN ERROR:", e);
  }
};
