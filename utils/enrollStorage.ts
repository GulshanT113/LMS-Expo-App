import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "enrollments";

export const getEnrollments = async () => {
  const res = await AsyncStorage.getItem(KEY);
  return res ? JSON.parse(res) : [];
};

export const saveEnrollments = async (data: any) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};
