import * as SecureStore from "expo-secure-store";

export const saveBookmarks = async (data: any) => {
  await SecureStore.setItemAsync("bookmarks", JSON.stringify(data));
};

export const getBookmarks = async () => {
  const res = await SecureStore.getItemAsync("bookmarks");

  return res ? JSON.parse(res) : [];
};
