import * as SecureStore from "expo-secure-store";

const KEY = "bookmarks";

export const getBookmarks = async () => {
  const res = await SecureStore.getItemAsync(KEY);
  return res ? JSON.parse(res) : [];
};

export const saveBookmarks = async (data: any) => {
  await SecureStore.setItemAsync(KEY, JSON.stringify(data));
};
